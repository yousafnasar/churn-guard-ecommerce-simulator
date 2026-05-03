from sqlalchemy import Column, Integer, String, DateTime
from app.core.database import Base
from datetime import datetime


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    persona = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)