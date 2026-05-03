from sqlalchemy.orm import Session
from app.models.event import Event
from app.schemas.event import EventCreate


def create_event(db: Session, event_data: EventCreate):
    event = Event(**event_data.model_dump())
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


def get_events(db: Session):
    return db.query(Event).order_by(Event.event_time.desc()).all()


def get_events_by_user(db: Session, user_id: int):
    return db.query(Event).filter(Event.user_id == user_id).order_by(Event.event_time.desc()).all()