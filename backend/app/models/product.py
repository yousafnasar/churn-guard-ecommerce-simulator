from sqlalchemy import Column, Integer, String, Float
from app.core.database import Base


class Product(Base):
    __tablename__ = "products"

    product_id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer)
    category_code = Column(String, nullable=True)
    brand = Column(String, nullable=True)
    price = Column(Float)