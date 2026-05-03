from pydantic import BaseModel
from datetime import datetime


class EventCreate(BaseModel):
    event_time: datetime
    event_type: str
    product_id: int
    category_id: int
    category_code: str | None = None
    brand: str | None = None
    price: float
    user_id: int
    user_session: str


class EventResponse(EventCreate):
    id: int

    class Config:
        from_attributes = True