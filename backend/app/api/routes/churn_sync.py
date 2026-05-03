from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.churn_sync_service import push_customer_events_to_churn

router = APIRouter(prefix="/api/churn", tags=["Churn Sync"])


class PushToChurnRequest(BaseModel):
    email: str


@router.post("/push")
def push_to_churn_app(
    request: PushToChurnRequest,
    db: Session = Depends(get_db),
):
    return push_customer_events_to_churn(db, request.email)