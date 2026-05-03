from fastapi import APIRouter
from app.api.routes import (
    products,
    events,
    simulator,
    dashboard,
    customers,
    simulate_api,
    churn_sync,
)

api_router = APIRouter()

api_router.include_router(products.router)
api_router.include_router(events.router)
api_router.include_router(simulator.router)
api_router.include_router(dashboard.router)
api_router.include_router(customers.router)
api_router.include_router(simulate_api.router)
api_router.include_router(churn_sync.router)