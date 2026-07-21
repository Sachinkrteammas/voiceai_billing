from datetime import datetime

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from db import get_db2, get_db4
from pydantic import BaseModel


class RechargeWebhook(BaseModel):
    company_name: str
    amount: float


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

    recharge = float(recharge or 0)

    # Fixed June usage
    june_minutes = 2517

    # Fixed usage for July 1–6
    july_first_six_days_minutes = 1224

    # Dynamic usage from July 7 onwards
    dynamic_minutes = db.execute(
        text("""
            SELECT
                IFNULL(
                    ROUND(SUM(call_duration) / 60, 2),
                    0
                )
            FROM dashboard_webhook_sokudu
            WHERE call_time >= '2026-07-07'
        """)
    ).scalar()

    dynamic_minutes = float(dynamic_minutes or 0)

    # Total consumed minutes
    total_consumed_minutes = round(
        june_minutes
        + july_first_six_days_minutes
        + dynamic_minutes,
        2
    )

    total_consumed_amount = round(
        total_consumed_minutes * rate,
        2
    )

    current_balance = round(
        recharge - total_consumed_amount,
        2
    )

    available_minutes = round(
        current_balance / rate,
        2
    )

    health_percent = (
        round(
            (current_balance / recharge) * 100,
            2
        )
        if recharge > 0
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

        "juneMinutes": june_minutes,
        "julyFirstSixDaysMinutes": july_first_six_days_minutes,
        "dynamicMinutes": dynamic_minutes,
        "monthlyMinutes": total_consumed_minutes
    }


@router.get("/transactions")
def wallet_transactions(
    db=Depends(get_db4),
    db2=Depends(get_db2)
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
            ORDER BY created_at DESC
        """)
    ).mappings().all()

    # Fixed June usage
    june_row = {
        "created_at": "2026-06-30 23:59:59",
        "transaction_type": "Usage Deduction",
        "reference_id": "USG-2026-06-001",
        "amount": round(-(2517 * rate), 2),
        "status": "Completed"
    }

    # Fixed usage for July 1–6
    july_first_six_days_minutes = 1224

    july_row = {
        "created_at": "2026-07-06 23:59:59",
        "transaction_type": "Usage Deduction",
        "reference_id": "USG-2026-07-01-006",
        "amount": round(
            -(july_first_six_days_minutes * rate),
            2
        ),
        "status": "Completed"
    }

    # Dynamic usage from July 7 onwards
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

            WHERE call_time >= '2026-07-07'

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
        + [july_row]
        + list(usage_rows)
    )

    rows.sort(
        key=lambda x: str(x["created_at"]),
        reverse=True
    )

    return rows



@router.post("/recharge")
def recharge_wallet(
    payload: RechargeWebhook,
    db2: Session = Depends(get_db2)
):
    try:
        db2.execute(
            text("""
                INSERT INTO wallet_transactions (
                    company_name,
                    transaction_type,
                    amount,
                    minutes,
                    status
                )
                VALUES (
                    :company_name,
                    'Recharge',
                    :amount,
                    NULL,
                    'Completed'
                )
            """),
            {
                "company_name": payload.company_name,
                "amount": payload.amount
            }
        )

        db2.commit()

        return {
            "success": True,
            "message": "Recharge added successfully",
            "company_name": payload.company_name,
            "amount": payload.amount
        }

    except Exception as e:
        db2.rollback()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )