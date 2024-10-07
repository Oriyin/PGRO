from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from database import *
import pytz

# ตั้งเขตเวลาเป็นไทย
THAI_TZ = pytz.timezone('Asia/Bangkok')

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
   password_hash: str
   email: str
   created_at: datetime

# Pydantic model สำหรับการเข้าสู่ระบบ
class UserLogin(BaseModel):
   email: str
   password_hash: str

# ฟังก์ชันแปลงเวลา UTC เป็นเวลาไทย
def utc_to_thai_time(utc_time):
    return utc_time.astimezone(THAI_TZ)

# Endpoint สำหรับสร้างผู้ใช้ใหม่
@router.post("/users/create", response_model=User)
async def create_user(user: UserCreate):
   # ตรวจสอบว่า username มีอยู่แล้วหรือไม่
   existing_user = await get_user(user.username)
   if existing_user:
       raise HTTPException(status_code=400, detail="Username already exists")
   
   # ตรวจสอบว่า email มีอยู่แล้วหรือไม่
   existing_email = await get_user_by_email_only(user.email)
   if existing_email:
       raise HTTPException(status_code=400, detail="Email already exists")
   
   result = await insert_user(user.username, user.password_hash, user.email)
   if result is None:
       raise HTTPException(status_code=400, detail="Error creating user")
   
   # แปลงเวลาเป็นเขตเวลาไทยก่อนส่งผลลัพธ์กลับ
   if result["created_at"]:
       result["created_at"] = utc_to_thai_time(result["created_at"])
   
   return result

# Endpoint สำหรับดึงข้อมูลจำนวนผู้ใช้ทั้งหมด
@router.get("/users/total")
async def get_total_users():
    query = "SELECT COUNT(*) as total_users FROM users"
    result = await database.fetch_one(query)
    return {"totalUsers": result["total_users"]}

# Endpoint สำหรับดึงข้อมูลผู้ใช้ที่ล็อกอินล่าสุด
@router.get("/users/recent-login")
async def get_recent_login_users(limit: int = 5):
    query = """
    SELECT user_id, username, last_login
    FROM users
    WHERE last_login IS NOT NULL
    ORDER BY last_login DESC
    LIMIT :limit
    """
    results = await database.fetch_all(query=query, values={"limit": limit})
    
    return [{"user_id": row["user_id"], "username": row["username"], "last_login": row["last_login"]} for row in results]


# Endpoint สำหรับอัปเดตข้อมูลผู้ใช้
@router.put("/users/{user_id}", response_model=User)
async def update_user_endpoint(user_id: int, user: UserUpdate):
   result = await update_user(user_id, user.username, user.password_hash, user.email)
   if result is None:
       raise HTTPException(status_code=404, detail="User not found")
   
   # แปลงเวลาเป็นเขตเวลาไทยก่อนส่งผลลัพธ์กลับ
   if result["created_at"]:
       result["created_at"] = utc_to_thai_time(result["created_at"])
   
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
   # ดึงข้อมูลผู้ใช้จากฐานข้อมูล
   db_user = await get_user_by_email_and_password(user.email, user.password_hash)
  
   if db_user is None:
       raise HTTPException(status_code=404, detail="Wrong email or password")

   # อัปเดตเวลาล็อกอินล่าสุด
   await update_last_login(db_user["user_id"])

   # แปลงเวลาเป็นเขตเวลาไทยก่อนส่งผลลัพธ์กลับ
   if db_user["created_at"]:
       db_user["created_at"] = utc_to_thai_time(db_user["created_at"])
   
   return {
       "user_id": db_user["user_id"],
       "username": db_user["username"],
       "email": db_user["email"],
       "created_at": db_user["created_at"]
   }
