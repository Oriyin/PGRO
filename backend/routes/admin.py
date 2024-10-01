from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from database import *  # Ensure your database functions are correctly implemented

router = APIRouter()

# Pydantic model for admin creation
class AdminCreate(BaseModel):
    adminusername: str
    adminpassword: str
    adminemail: str

# Pydantic model for admin update
class AdminUpdate(BaseModel):
    adminusername: Optional[str]
    adminpassword: Optional[str]
    adminemail: Optional[str]

# Pydantic model for admin response
class Admin(BaseModel):
    adminuser_id: int
    adminusername: str
    adminpassword: str  # Update field name to match the model
    adminemail: str
    admincreated_at: datetime

# Pydantic model for login
class AdminLogin(BaseModel):
    adminemail: str
    adminpassword: str

# Endpoint to create a new admin user
@router.post("/admin/create", response_model=Admin)
async def create_admin(admin: AdminCreate):
    # Check if the username already exists
    existing_admin = await get_admin(admin.adminusername)  # Change to admin.adminusername
    if existing_admin:
        raise HTTPException(status_code=400, detail="Username already exists")

    result = await insert_admin(admin.adminusername, admin.adminpassword, admin.adminemail)  # Update field name
    if result is None:
        raise HTTPException(status_code=400, detail="Error creating user")
    return result

# Endpoint to get an admin user by user_id
@router.get("/admin/{admin_id}", response_model=Admin)  # Changed to Admin
async def read_admin(admin_id: int):
    result = await get_admin(admin_id)
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return result

# Endpoint to update an admin user
@router.put("/admin/{admin_id}", response_model=Admin)  # Changed to Admin
async def update_admin_endpoint(admin_id: int, admin: AdminUpdate):  # Changed parameter name
    result = await update_admin(admin_id, admin.adminusername, admin.adminpassword, admin.adminemail)  # Use the correct field names
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return result

# Endpoint to delete an admin user
@router.delete("/admin/{admin_id}")
async def delete_admin_endpoint(admin_id: int):
    result = await delete_admin(admin_id)
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted"}

# Endpoint for admin login
@router.post("/admin/login")
async def login_admin(admin: AdminLogin):  # Changed to AdminLogin
    # Fetch user from the database
    db_admin = await get_admin_by_email(admin.adminemail, admin.adminpassword)  # Use admin.adminpassword
    if db_admin is None:
        raise HTTPException(status_code=404, detail="User not found")


    return {
        "user_id": db_admin.adminuser_id,  
        "username": db_admin.adminusername,
        "email": db_admin.adminemail,
        "created_at": db_admin.admincreated_at
    }
