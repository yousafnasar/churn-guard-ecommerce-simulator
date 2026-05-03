from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.event import EventCreate
from app.services.event_service import create_event, get_events, get_events_by_user

import csv
import io

router = APIRouter(prefix="/events", tags=["Events"])


@router.post("/")
def create_new_event(event: EventCreate, db: Session = Depends(get_db)):
    return create_event(db, event)


@router.get("/")
def read_events(db: Session = Depends(get_db)):
    return get_events(db)


@router.get("/user/{user_id}")
def read_events_by_user(user_id: int, db: Session = Depends(get_db)):
    return get_events_by_user(db, user_id)


@router.get("/export")
def export_events_csv(db: Session = Depends(get_db)):
    events = get_events(db)

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow([
        "event_time",
        "event_type",
        "product_id",
        "category_id",
        "category_code",
        "brand",
        "price",
        "user_id",
        "user_session",
        "customer_email",
    ])

    for event in events:
        writer.writerow([
            event.event_time.isoformat(),
            event.event_type,
            event.product_id,
            event.category_id,
            event.category_code,
            event.brand,
            event.price,
            event.user_id,
            event.user_session,
            
        ])

    output.seek(0)

    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=events_export.csv"},
    )