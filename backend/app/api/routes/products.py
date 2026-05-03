from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.product_service import get_products, get_product_by_id

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("/")
def read_products(db: Session = Depends(get_db)):
    return get_products(db)


@router.get("/{product_id}")
def read_product(product_id: int, db: Session = Depends(get_db)):
    product = get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product