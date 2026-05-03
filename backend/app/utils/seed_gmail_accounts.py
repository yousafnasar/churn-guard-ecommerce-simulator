from app.core.database import SessionLocal, Base, engine
from app.models.gmail_account import GmailAccount

Base.metadata.create_all(bind=engine)

db = SessionLocal()

accounts = [
    {
        "email": "customer1@gmail.com",
        "full_name": "Customer One",
        "google_sub": "google-sub-1001",
        "access_token": None,
        "refresh_token": None,
        "is_active": True,
    },
    {
        "email": "customer2@gmail.com",
        "full_name": "Customer Two",
        "google_sub": "google-sub-1002",
        "access_token": None,
        "refresh_token": None,
        "is_active": True,
    },
]

for item in accounts:
    existing = db.query(GmailAccount).filter(GmailAccount.email == item["email"]).first()
    if not existing:
        db.add(GmailAccount(**item))

db.commit()
db.close()

print("Gmail accounts seeded successfully")