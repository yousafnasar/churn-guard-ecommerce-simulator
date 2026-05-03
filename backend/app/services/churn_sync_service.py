import requests
from sqlalchemy.orm import Session

from app.core.config import CHURN_APP_IMPORT_URL
from app.models.gmail_account import GmailAccount
from app.models.event import Event


def push_customer_events_to_churn(db: Session, email: str):
    customer = db.query(GmailAccount).filter(
        GmailAccount.email == email
    ).first()

    if not customer:
        return {"error": "Customer not found"}

    events = db.query(Event).filter(
        Event.customer_email == email
    ).order_by(Event.event_time.asc()).all()

    payload = {
        "customer": {
            "email": customer.email,
            "full_name": customer.full_name,
        },
        "events": [
            {
                "event_time": event.event_time.isoformat(),
                "event_type": event.event_type,
                "product_id": event.product_id,
                "category_id": event.category_id,
                "category_code": event.category_code,
                "brand": event.brand,
                "price": event.price,
                "user_id": event.user_id,
                "user_session": event.user_session,
                "customer_email": event.customer_email,
            }
            for event in events
        ],
    }

    try:
        response = requests.post(
            CHURN_APP_IMPORT_URL,
            json=payload,
            timeout=30,
        )

        return {
            "message": "Data pushed to churn app",
            "email": email,
            "events_sent": len(events),
            "status_code": response.status_code,
            "churn_app_response": response.json()
            if "application/json" in response.headers.get("content-type", "")
            else response.text,
        }

    except requests.RequestException as error:
        return {
            "error": "Failed to push data to churn app",
            "details": str(error),
        }