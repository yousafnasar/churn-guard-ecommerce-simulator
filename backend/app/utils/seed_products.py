from app.core.database import SessionLocal, engine, Base
from app.models.product import Product

# Create tables before seeding
Base.metadata.create_all(bind=engine)

db = SessionLocal()

products = [
    {
        "product_id": 1,
        "category_id": 100,
        "category_code": "electronics.phone",
        "brand": "Samsung",
        "price": 500.0,
    },
    {
        "product_id": 2,
        "category_id": 101,
        "category_code": "electronics.laptop",
        "brand": "Dell",
        "price": 900.0,
    },
    {
        "product_id": 3,
        "category_id": 102,
        "category_code": "home.appliance",
        "brand": "LG",
        "price": 300.0,
    },
]

for p in products:
    existing = db.query(Product).filter(Product.product_id == p["product_id"]).first()
    if not existing:
        db.add(Product(**p))

db.commit()
db.close()

print("Products seeded successfully")