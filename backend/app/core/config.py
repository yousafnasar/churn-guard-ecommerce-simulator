from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ecommerce.db")
APP_NAME = os.getenv("APP_NAME", "Ecommerce Simulator API")
APP_VERSION = os.getenv("APP_VERSION", "1.0.0")
CHURN_APP_IMPORT_URL = os.getenv(
    "CHURN_APP_IMPORT_URL",
    "http://127.0.0.1:9000/api/simulator/import"
)