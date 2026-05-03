from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.gmail_simulator_service import simulate_for_email, simulate_for_all

router = APIRouter(prefix="/api", tags=["Simulation API"])


class SimulateRequest(BaseModel):
    email: str | None = None
    simulate_all: bool = False
    events_per_user: int = 10


@router.post("/simulate")
def simulate(request: SimulateRequest, db: Session = Depends(get_db)):
    if request.simulate_all:
        return simulate_for_all(db, request.events_per_user)

    if request.email:
        return simulate_for_email(db, request.email, request.events_per_user)

    return {"error": "Provide email or set simulate_all=true"}