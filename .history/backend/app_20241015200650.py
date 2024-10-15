from fastapi import FastAPI
from routes import users, admin, products, carts, dashboard, sale
from database import connect_db, disconnect_db

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    await connect_db()

@app.on_event("shutdown")
async def shutdown_event():
    await disconnect_db()

app.include_router(users.router, prefix="/api")

app.include_router(admin.router, prefix="/api")

app.include_router(products.router, prefix="/api")

app.include_router(carts.router, prefix="/api")

app.include_router(dashboard.router, prefix="/api")

app.include_router(sale.router, prefix="/api")