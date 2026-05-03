from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel

from app.core.database import get_db
from app.models.gmail_account import GmailAccount
from app.models.event import Event

router = APIRouter(prefix="/api/customers", tags=["Customers"])


class RegisterCustomer(BaseModel):
    email: str
    full_name: str | None = None


@router.post("/register")
def register_customer(data: RegisterCustomer, db: Session = Depends(get_db)):
    existing = db.query(GmailAccount).filter(
        GmailAccount.email == data.email
    ).first()

    if existing:
        return {"message": "Customer already exists"}

    new_customer = GmailAccount(
        email=data.email,
        full_name=data.full_name,
        google_sub=data.email,
        is_active=True,
    )

    db.add(new_customer)
    db.commit()

    return {"message": "Customer registered successfully"}


@router.get("/")
def list_customers(db: Session = Depends(get_db)):
    accounts = db.query(GmailAccount).all()
    result = []

    for acc in accounts:
        total_events = db.query(func.count(Event.id)).filter(
            Event.customer_email == acc.email
        ).scalar()

        last_activity = db.query(func.max(Event.event_time)).filter(
            Event.customer_email == acc.email
        ).scalar()

        result.append({
            "email": acc.email,
            "full_name": acc.full_name,
            "total_events": total_events or 0,
            "last_activity": last_activity,
        })

    return result


@router.get("/{email}/activity")
def customer_activity(email: str, db: Session = Depends(get_db)):
    account = db.query(GmailAccount).filter(GmailAccount.email == email).first()
    if not account:
        raise HTTPException(status_code=404, detail="Customer not found")

    events = db.query(Event).filter(
        Event.customer_email == email
    ).order_by(Event.event_time.desc()).all()

    return {
        "email": email,
        "events": events,
    }