import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.gmail_account import GmailAccount
from app.models.product import Product
from app.models.event import Event

PERSONAS = {
    "loyal_customer": ["view", "view", "cart", "purchase"],
    "casual_browser": ["view", "view", "view"],
    "cart_abandoner": ["view", "cart", "remove_from_cart"],
    "returning_customer": ["view", "cart", "purchase", "return"],
    "price_sensitive": ["view", "view", "cart"],
}


def simulate_for_email(db: Session, email: str, events_per_user: int = 10):
    account = db.query(GmailAccount).filter(GmailAccount.email == email).first()
    if not account:
        return {"error": "Customer not found"}

    products = db.query(Product).all()
    if not products:
        return {"error": "No products found"}

    persona = random.choice(list(PERSONAS.keys()))
    created = 0

    for _ in range(events_per_user):
        session_id = f"gmail-{email}-{random.randint(1000, 9999)}"
        product = random.choice(products)
        event_type = random.choice(PERSONAS[persona])

        event = Event(
            event_time=datetime.utcnow() - timedelta(minutes=random.randint(0, 10000)),
            event_type=event_type,
            product_id=product.product_id,
            category_id=product.category_id,
            category_code=product.category_code,
            brand=product.brand,
            price=product.price,
            user_id=abs(hash(email)) % 1000000,
            user_session=session_id,
            customer_email=email,
        )
        db.add(event)
        created += 1

    db.commit()

    return {
        "message": "Simulation completed",
        "email": email,
        "persona": persona,
        "events_created": created,
    }


def simulate_for_all(db: Session, events_per_user: int = 10):
    accounts = db.query(GmailAccount).all()
    total = 0

    for account in accounts:
        result = simulate_for_email(db, account.email, events_per_user)
        if "events_created" in result:
            total += result["events_created"]

    return {
        "message": "Simulation completed for all accounts",
        "accounts_count": len(accounts),
        "events_created": total,
    }