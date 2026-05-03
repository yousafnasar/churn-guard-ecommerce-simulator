from sqlalchemy.orm import Session
from app.models.product import Product


def get_products(db: Session):
    return db.query(Product).all()


def get_product_by_id(db: Session, product_id: int):
    return db.query(Product).filter(Product.product_id == product_id).first()


def create_product(db: Session, product_data: dict):
    product = Product(**product_data)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product