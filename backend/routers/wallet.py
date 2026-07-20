from datetime import datetime

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text

from db import get_db2, get_db4

router = APIRouter(
    prefix="/wallet",
    tags=["Wallet"]
)

COMPANY_NAME = "Sokudu"


def get_rate(db2):
    rate = db2.execute(
        text("""
            SELECT rate_per_min
            FROM company_billing
            WHERE company_name=:company
            LIMIT 1
        """),
        {"company": COMPANY_NAME}
    ).scalar()

    return float(rate or 4)

@router.get("/summary")
def wallet_summary(
    db: Session = Depends(get_db4),
    db2: Session = Depends(get_db2)
):
    rate = get_rate(db2)

    recharge = db2.execute(
        text("""
            SELECT IFNULL(SUM(amount), 0)
            FROM wallet_transactions
            WHERE transaction_type = 'Recharge'
        """)
    ).scalar()

    current_month = datetime.now().month

    dashboard_minutes = db.execute(
        text("""
            SELECT
                IFNULL(
                    ROUND(SUM(call_duration) / 60, 2),
                    0
                )
            FROM dashboard_webhook_sokudu
            WHERE MONTH(call_time) = MONTH(CURDATE())
              AND YEAR(call_time) = YEAR(CURDATE())
        """)
    ).scalar()

    dashboard_minutes = float(dashboard_minutes)

    # Fixed values
    june_minutes = 2517
    july_total_minutes = 2386

    missing_minutes = 0
    this_month_minutes = dashboard_minutes

    if current_month == 7:

        # 1 Jul → 6 Jul data is missing
        missing_minutes = round(
            july_total_minutes - dashboard_minutes,
            2
        )

        # Complete July usage
        this_month_minutes = (
            missing_minutes + dashboard_minutes
        )

    # June + current month total usage
    total_consumed_minutes = round(
        june_minutes + this_month_minutes,
        2
    )

    total_consumed_amount = round(
        total_consumed_minutes * rate,
        2
    )

    current_balance = round(
        float(recharge) - total_consumed_amount,
        2
    )

    available_minutes = round(
        current_balance / rate,
        2
    )

    health_percent = (
        round(
            (current_balance / float(recharge)) * 100,
            2
        )
        if recharge
        else 0
    )

    if health_percent > 50:
        health = "Healthy"
    elif health_percent > 20:
        health = "Low"
    else:
        health = "Critical"

    return {
        "currentBalance": current_balance,
        "totalRecharged": recharge,
        "totalConsumed": total_consumed_amount,
        "availableMinutes": available_minutes,
        "health": health,
        "healthPercent": health_percent,

        # Extra values
        "juneMinutes": june_minutes,
        "dashboardMinutes": dashboard_minutes,
        "missingMinutes": missing_minutes,
        "thisMonthMinutes": this_month_minutes,
        "monthlyMinutes": total_consumed_minutes
    }

@router.get("/transactions")
def wallet_transactions(
    db=Depends(get_db4),      # dashboard_webhook_sokudu
    db2=Depends(get_db2)      # wallet_transactions
):
    rate = get_rate(db2)

    # Recharge history
    wallet_rows = db2.execute(
        text("""
            SELECT
                created_at,
                transaction_type,
                reference_id,
                amount,
                status
            FROM wallet_transactions
        """)
    ).mappings().all()

    # June hardcoded (2517 min)
    june_row = {
        "created_at": "2026-06-30 23:59:59",
        "transaction_type": "Usage Deduction",
        "reference_id": "USG-2026-06-001",
        "amount": round(-(2517 * rate), 2),
        "status": "Completed"
    }

    # July total usage already known
    july_total_minutes = 2386

    # Current July usage present in DB (7 Jul onwards)
    july_db_minutes = db.execute(
        text("""
            SELECT
                IFNULL(
                    ROUND(SUM(call_duration) / 60, 2),
                    0
                )
            FROM dashboard_webhook_sokudu
            WHERE YEAR(call_time) = YEAR(CURDATE())
              AND MONTH(call_time) = MONTH(CURDATE())
        """)
    ).scalar()

    july_db_minutes = float(july_db_minutes)

    # Missing usage (1 Jul → 6 Jul)
    missing_minutes = round(
        july_total_minutes - july_db_minutes,
        2
    )

    missing_row = {
        "created_at": "2026-07-06 23:59:59",
        "transaction_type": "Usage Deduction",
        "reference_id": "USG-2026-07-01-006",
        "amount": round(-(missing_minutes * rate), 2),
        "status": "Completed"
    }

    # Daily usage from DB (7 Jul onwards)
    usage_rows = db.execute(
        text("""
            SELECT
                DATE(call_time) AS created_at,

                'Usage Deduction' AS transaction_type,

                CONCAT(
                    'USG-',
                    DATE_FORMAT(
                        DATE(call_time),
                        '%Y-%m-%d'
                    ),
                    '-001'
                ) AS reference_id,

                -ROUND(
                    (SUM(call_duration) / 60) * :rate,
                    2
                ) AS amount,

                'Completed' AS status

            FROM dashboard_webhook_sokudu

            WHERE call_time IS NOT NULL

            GROUP BY DATE(call_time)

            ORDER BY DATE(call_time) DESC
        """),
        {
            "rate": rate
        }
    ).mappings().all()

    rows = (
        list(wallet_rows)
        + [june_row]
        + [missing_row]
        + list(usage_rows)
    )

    rows.sort(
        key=lambda x: str(x["created_at"]),
        reverse=True
    )

    return rows