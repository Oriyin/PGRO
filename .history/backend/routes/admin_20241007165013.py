from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from database import database  # Ensure your database connection is set up

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
    admin_id: int
    adminusername: str
    adminemail: str
    admincreated_at: datetime

# Pydantic model for login
class AdminLogin(BaseModel):
    adminemail: str
    adminpassword: str

async def insert_admin(adminusername: str, adminpassword: str, adminemail: str):
    query = """
    INSERT INTO admins (adminusername, adminpassword, adminemail)
    VALUES (:adminusername, :adminpassword, :adminemail)
    RETURNING admin_id, adminusername, adminemail, admincreated_at
    """
    values = {"adminusername": adminusername, "adminpassword": adminpassword, "adminemail": adminemail}
    return await database.fetch_one(query=query, values=values)

async def get_admin(admin_id: int):
    query = "SELECT * FROM admins WHERE admin_id = :admin_id"
    return await database.fetch_one(query=query, values={"admin_id": admin_id})

async def get_admin_by_username(adminusername: str):
    query = "SELECT * FROM admins WHERE adminusername = :adminusername"
    return await database.fetch_one(query=query, values={"adminusername": adminusername})

async def get_admin_by_email(adminemail: str):
    query = "SELECT * FROM admins WHERE adminemail = :adminemail"
    return await database.fetch_one(query=query, values={"adminemail": adminemail})

async def update_admin(admin_id: int, adminusername: str, adminpassword: Optional[str], adminemail: Optional[str]):
    query = """
    UPDATE admins
    SET adminusername = COALESCE(:adminusername, adminusername), 
        adminpassword = COALESCE(:adminpassword, adminpassword), 
        adminemail = COALESCE(:adminemail, adminemail)
    WHERE admin_id = :admin_id
    RETURNING admin_id, adminusername, adminemail, admincreated_at
    """
    values = {"admin_id": admin_id, "adminusername": adminusername, "adminpassword": adminpassword, "adminemail": adminemail}
    return await database.fetch_one(query=query, values=values)

async def delete_admin(admin_id: int):
    query = "DELETE FROM admins WHERE admin_id = :admin_id RETURNING *"
    return await database.fetch_one(query=query, values={"admin_id": admin_id})

@router.post("/admin/create", response_model=Admin)
async def create_admin(admin: AdminCreate):
    existing_admin_username = await get_admin_by_username(admin.adminusername)
    if existing_admin_username:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    existing_admin_email = await get_admin_by_email(admin.adminemail)
    if existing_admin_email:
        raise HTTPException(status_code=400, detail="Email already exists")

    result = await insert_admin(admin.adminusername, admin.adminpassword, admin.adminemail)
    if result is None:
        raise HTTPException(status_code=400, detail="Error creating admin")
    
    return result

@router.get("/admin/{admin_id}", response_model=Admin)
async def read_admin(admin_id: int):
    result = await get_admin(admin_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Admin not found")
    return result

@router.put("/admin/{admin_id}", response_model=Admin)
async def update_admin_endpoint(admin_id: int, admin: AdminUpdate):
    result = await update_admin(admin_id, admin.adminusername, admin.adminpassword, admin.adminemail)
    if result is None:
        raise HTTPException(status_code=404, detail="Admin not found")
    return result

@router.delete("/admin/{admin_id}")
async def delete_admin_endpoint(admin_id: int):
