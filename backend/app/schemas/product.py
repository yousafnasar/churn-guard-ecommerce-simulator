from pydantic import BaseModel


class ProductBase(BaseModel):
    category_id: int
    category_code: str | None = None
    brand: str | None = None
    price: float


class ProductCreate(ProductBase):
    pass


class ProductResponse(ProductBase):
    product_id: int

    class Config:
        from_attributes = True