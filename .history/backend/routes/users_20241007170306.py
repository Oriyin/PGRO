from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from database import database  # เชื่อมต่อฐานข้อมูลของคุณ

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

# ฟังก์ชันดึงข้อมูลผู้ใช้จากฐานข้อมูลโดยใช้ username
async def get_user_by_username(username: str):
    query = "SELECT * FROM users WHERE username = :username"
    return await database.fetch_one(query=query, values={"username": username})

# ฟังก์ชันดึงข้อมูลผู้ใช้จากฐานข้อมูลโดยใช้ email
async def get_user_by_email(email: str):
    query = "SELECT * FROM users WHERE email = :email"
    return await database.fetch_one(query=query, values={"email": email})

# ฟังก์ชันเพิ่มผู้ใช้ใหม่ลงในฐานข้อมูล
async def insert_user(username: str, password_hash: str, email: str):
    query = """
    INSERT INTO users (username, password_hash, email)
    VALUES (:username, :password_hash, :email)
    RETURNING user_id, username, email, created_at
    """
    values = {"username": username, "password_hash": password_hash, "email": email}
    return await database.fetch_one(query=query, values=values)

# ฟังก์ชันดึงข้อมูลผู้ใช้จากฐานข้อมูลโดยใช้ user_id
async def get_user(user_id: int):
    query = "SELECT * FROM users WHERE user_id = :user_id"
    return await database.fetch_one(query=query, values={"user_id": user_id})

# ฟังก์ชันอัปเดตข้อมูลผู้ใช้ในฐานข้อมูล
async def update_user(user_id: int, username: Optional[str], password_hash: Optional[str], email: Optional[str]):
    query = """
    UPDATE users
    SET username = COALESCE(:username, username), 
        password_hash = COALESCE(:password_hash, password_hash), 
        email = COALESCE(:email, email)
    WHERE user_id = :user_id
    RETURNING user_id, username, email, created_at
    """
    values = {"user_id": user_id, "username": username, "password_hash": password_hash, "email": email}
    return await database.fetch_one(query=query, values=values)

# ฟังก์ชันลบผู้ใช้จากฐานข้อมูล
async def delete_user(user_id: int):
    query = "DELETE FROM users WHERE user_id = :user_id RETURNING *"
    return await database.fetch_one(query=query, values={"user_id": user_id})

# Endpoint สำหรับสร้างผู้ใช้ใหม่และป้องกันการใช้ username หรือ email ซ้ำ
@router.post("/users/create", response_model=User)
async def create_user(user: UserCreate):
    # ตรวจสอบว่า username มีอยู่แล้วหรือไม่
    existing_user_username = await get_user_by_username(user.username)
    if existing_user_username:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # ตรวจสอบว่า email มีอยู่แล้วหรือไม่
    existing_user_email = await get_user_by_email(user.email)
    if existing_user_email:
        raise HTTPException(status_code=400, detail="Email already exists")

    # เพิ่มผู้ใช้ใหม่ลงในฐานข้อมูล
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
    # ดึงข้อมูลผู้ใช้จากฐานข้อมูลโดยใช้ email
    db_user = await get_user_by_email(user.email)
    
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    # ตรวจสอบว่ารหัสผ่านตรงกันหรือไม่
    if db_user['password_hash'] != user.password_hash:
        raise HTTPException(status_code=400, detail="Wrong password")

    # หากเข้าสู่ระบบสำเร็จ ให้ส่งคืนข้อมูลผู้ใช้
    return {
        "user_id": db_user["user_id"],
        "username": db_user["username"],
        "email": db_user["email"],
        "created_at": db_user["created_at"]
    }
