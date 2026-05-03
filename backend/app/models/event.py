from sqlalchemy import Column, Integer, String, Float, DateTime
from app.core.database import Base
from datetime import datetime


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    event_time = Column(DateTime, default=datetime.utcnow, nullable=False)
    event_type = Column(String, nullable=False)
    product_id = Column(Integer, nullable=False)
    category_id = Column(Integer, nullable=False)
    category_code = Column(String, nullable=True)
    brand = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    user_id = Column(Integer, nullable=False)
    user_session = Column(String, nullable=False)
    customer_email = Column(String, nullable=True, index=True)