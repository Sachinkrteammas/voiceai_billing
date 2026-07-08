from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text

from db import get_db4,get_db2
from decimal import Decimal

router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)


GST_PERCENT = 18
COMPANY_NAME = "Sokudu"

def get_rate(db2):
    rate = db2.execute(
        text("""
            SELECT rate_per_min
            FROM company_billing
            WHERE company_name = :company
            LIMIT 1
        """),
        {"company": COMPANY_NAME},
    ).scalar()

    return rate or Decimal("4")

@router.get("/summary")
def dashboard_summary(
    from_date: str = Query(...),
    to_date: str = Query(...),
    db: Session = Depends(get_db4),
    db2: Session = Depends(get_db2)
):

    result = db.execute(
        text("""
            SELECT
                IFNULL(SUM(call_duration),0) total_seconds,
                COUNT(*) total_calls
            FROM dashboard_webhook_sokudu
            WHERE DATE(call_time)
            BETWEEN :from_date AND :to_date
        """),
        {
            "from_date": from_date,
            "to_date": to_date
        }
    ).mappings().first()

    total_minutes = float(round((result["total_seconds"] or 0) / 60, 2))

    rate = get_rate(db2)

    usage_cost = round(float(total_minutes) * float(rate), 2)

    gst = round(usage_cost * GST_PERCENT /100,2)

    total_charge = round(usage_cost + gst,2)

    return {
        "totalMinutes": total_minutes,
        "usageCost": usage_cost,
        "gst": gst,
        "totalCharge": total_charge,
        "totalCalls": result["total_calls"]
    }

@router.get("/daily-usage")
def daily_usage(
    from_date:str,
    to_date:str,
    db:Session=Depends(get_db4),
    db2:Session=Depends(get_db2)
):
    rate = get_rate(db2)
    rows=db.execute(
        text("""
        SELECT

        DATE(call_time) date,

        ROUND(SUM(call_duration)/60,2) minutes,

        ROUND((SUM(call_duration)/60)*:rate,2) cost

        FROM dashboard_webhook_sokudu

        WHERE DATE(call_time)
        BETWEEN :from_date AND :to_date

        GROUP BY DATE(call_time)

        ORDER BY DATE(call_time)
        """),
        {
            "from_date":from_date,
            "to_date":to_date,
            "rate": rate
        }
    ).mappings().all()

    return rows

@router.get("/bot-breakdown")
def bot_breakdown(
    from_date:str,
    to_date:str,
    db:Session=Depends(get_db4),
    db2: Session = Depends(get_db2)
):
    rate = get_rate(db2)
    rows=db.execute(
        text("""
        SELECT

        campaign bot,

        COUNT(*) total_calls,

        ROUND(SUM(call_duration)/60,2) minutes,

        ROUND((SUM(call_duration)/60)*:rate,2) cost

        FROM dashboard_webhook_sokudu

        WHERE DATE(call_time)

        BETWEEN :from_date AND :to_date

        GROUP BY campaign
        """),
        {
            "from_date":from_date,
            "to_date":to_date,
            "rate": rate
        }
    ).mappings().all()

    return rows

@router.get("/daily-breakdown")
def daily_breakdown(
    from_date:str,
    to_date:str,
    db:Session=Depends(get_db4),
    db2:Session=Depends(get_db2)
):
    rate = get_rate(db2)
    rows=db.execute(
        text("""
        SELECT

        DATE(call_time) date,

        campaign bot,

        ROUND(SUM(call_duration)/60,2) minutes,

        4 rate,

        ROUND((SUM(call_duration)/60)*:rate,2) usage_cost,

        ROUND((SUM(call_duration)/60)*:rate*0.18,2) gst,

        ROUND((SUM(call_duration)/60)*:rate*1.18,2) total_charge

        FROM dashboard_webhook_sokudu

        WHERE DATE(call_time)

        BETWEEN :from_date AND :to_date

        GROUP BY DATE(call_time),campaign

        ORDER BY DATE(call_time)
        """),
        {
            "from_date":from_date,
            "to_date":to_date,
            "rate": rate
        }
    ).mappings().all()

    return rows

@router.get("/calls")
def calls(
    from_date:str,
    to_date:str,
    db:Session=Depends(get_db4)
):

    rows=db.execute(
        text("""
        SELECT

        phone,

        caller_city,

        call_time,

        call_duration,

        classification,

        disposition,

        recording_url

        FROM dashboard_webhook_sokudu

        WHERE DATE(call_time)

        BETWEEN :from_date AND :to_date

        ORDER BY call_time DESC
        """),
        {
            "from_date":from_date,
            "to_date":to_date
        }
    ).mappings().all()

    return rows

@router.get("/filters")
def filters(
    db:Session=Depends(get_db4)
):

    bots=db.execute(
        text("""
        SELECT DISTINCT campaign
        FROM dashboard_webhook_sokudu
        ORDER BY campaign
        """)
    ).scalars().all()

    return{
        "bots":bots
    }