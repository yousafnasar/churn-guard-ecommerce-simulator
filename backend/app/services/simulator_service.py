import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.product import Product
from app.models.event import Event

PERSONAS = [
    "loyal_customer",
    "casual_browser",
    "cart_abandoner",
    "price_sensitive",
    "churn_risk_user",
]


def seed_users(db: Session, count: int = 20):
    created_users = []

    current_max = db.query(User).order_by(User.user_id.desc()).first()
    next_id = current_max.user_id + 1 if current_max else 1000

    for i in range(count):
        persona = random.choice(PERSONAS)
        user = User(
            user_id=next_id + i,
            persona=persona,
        )
        db.add(user)
        created_users.append(user)

    db.commit()
    return created_users


def get_all_users(db: Session):
    return db.query(User).all()


def generate_event_sequence_for_user(user: User, products: list[Product], now: datetime):
    events = []
    session_id = f"session-{user.user_id}-{random.randint(1000, 9999)}"

    session_length = random.randint(1, 6)

    if user.persona == "loyal_customer":
        event_choices = ["view", "view", "cart", "purchase"]
    elif user.persona == "casual_browser":
        event_choices = ["view", "view", "view"]
    elif user.persona == "cart_abandoner":
        event_choices = ["view", "cart", "remove_from_cart"]
    elif user.persona == "price_sensitive":
        event_choices = ["view", "view", "cart"]
    else:
        event_choices = ["view"]

    for i in range(session_length):
        product = random.choice(products)
        event_type = random.choice(event_choices)

        event = Event(
            event_time=now - timedelta(minutes=random.randint(0, 5000)),
            event_type=event_type,
            product_id=product.product_id,
            category_id=product.category_id,
            category_code=product.category_code,
            brand=product.brand,
            price=product.price,
            user_id=user.user_id,
            user_session=session_id,
        )
        events.append(event)

    return events


def generate_events(db: Session, events_per_user: int = 10):
    users = db.query(User).all()
    products = db.query(Product).all()

    if not users:
        return {"error": "No users found. Seed users first."}

    if not products:
        return {"error": "No products found. Seed products first."}

    created_count = 0
    now = datetime.utcnow()

    for user in users:
        for _ in range(events_per_user):
            event_sequence = generate_event_sequence_for_user(user, products, now)
            for event in event_sequence:
                db.add(event)
                created_count += 1

    db.commit()

    return {
        "message": "Events generated successfully",
        "users_count": len(users),
        "events_created": created_count,
    }