from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from database import *  # เชื่อมต่อฐานข้อมูลของคุณ

router = APIRouter()

# Pydantic model สำหรับการสร้างผู้ใช้ใหม่
class UserCreate(BaseModel):
    username: str
    password_hash: str
    email: str

# Pydantic model สำหรับการอัปเดตผู้ใช้
class UserUpdate(BaseModel):
    username: Optional[str]
    password_hash: Optional[str]
    email: Optional[str]

# Pydantic model สำหรับการแสดงข้อมูลผู้ใช้
class User(BaseModel):
    user_id: int
    username: str
    email: str
    created_at: datetime

# Pydantic model สำหรับการเข้าสู่ระบบ
class UserLogin(BaseModel):
    email: str
    password_hash: str

# Endpoint สำหรับสร้างผู้ใช้ใหม่
@router.post("/users/create", response_model=User)
async def create_user(user: UserCreate):
    existing_user = await get_user(user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    result = await insert_user(user.username, user.password_hash, user.email)
    if result is None:
        raise HTTPException(status_code=400, detail="Error creating user")
    return result

# Endpoint สำหรับดึงข้อมูลจำนวนผู้ใช้ทั้งหมด
@router.get("/users/total")
async def get_total_users():
    query = "SELECT COUNT(*) as total_users FROM users"
    result = await database.fetch_one(query)
    return {"totalUsers": result["total_users"]}

# Endpoint สำหรับดึงข้อมูลผู้ใช้ตาม user_id
@router.get("/users/{user_id}", response_model=User)
async def read_user(user_id: int):
    result = await get_user(user_id)
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return result

# Endpoint สำหรับอัปเดตข้อมูลผู้ใช้
@router.put("/users/{user_id}", response_model=User)
async def update_user_endpoint(user_id: int, user: UserUpdate):
    result = await update_user(user_id, user.username, user.password_hash, user.email)
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return result

# Endpoint สำหรับลบผู้ใช้
@router.delete("/users/{user_id}")
async def delete_user_endpoint(user_id: int):
    result = await delete_user(user_id)
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted"}

# Endpoint สำหรับเข้าสู่ระบบ
@router.post("/users/login")
async def login_user(user: UserLogin):
    db_user = await get_user_by_email(user.email, user.password_hash)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Wrong password")

    # อัปเดต timestamp ของการเข้าสู่ระบบ
    await update_last_login(db_user['user_id'])

    return {
        "user_id": db_user["user_id"],
        "username": db_user["username"],
        "email": db_user["email"],
        "created_at": db_user["created_at"]
    }

# Endpoint สำหรับดึงข้อมูลผู้ใช้ที่ล็อกอินล่าสุด
@router.get("/users/recent-login")
async def get_recent_logins(limit: int = 5):
    recent_logins = await get_recent_logins_from_db(limit)
    return recent_logins
