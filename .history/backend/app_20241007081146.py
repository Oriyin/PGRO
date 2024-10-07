from fastapi import FastAPI
from routes import users, admin, products, carts, dashboard
from database import connect_db, disconnect_db

app = FastAPI()

# Event handler for application startup
@app.on_event("startup")
async def startup_event():
    await connect_db()

# Event handler for application shutdown
@app.on_event("shutdown")
async def shutdown_event():
    await disconnect_db()

# Include router for Users
app.include_router(users.router, prefix="/api")

# Include router for Admin
app.include_router(admin.router, prefix="/api")

app.include_router(products.router, prefix="/api")

app.include_router(carts.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")