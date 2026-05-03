from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.simulator_service import seed_users, get_all_users, generate_events

router = APIRouter(prefix="/simulator", tags=["Simulator"])


@router.post("/seed-users")
def seed_dummy_users(count: int = Query(20, ge=1, le=500), db: Session = Depends(get_db)):
    users = seed_users(db, count)
    return {
        "message": "Users seeded successfully",
        "count": len(users),
    }


@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    return get_all_users(db)


@router.post("/generate-events")
def generate_dummy_events(
    events_per_user: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return generate_events(db, events_per_user)