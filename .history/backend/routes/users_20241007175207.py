from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from database import *
import pytz

# ตั้งเขตเวลาไทย
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
   try:
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
   except Exception as e:
       raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

# Endpoint สำหรับเข้าสู่ระบบ
@router.post("/users/login")
async def login_user(user: UserLogin):
   try:
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
   except Exception as e:
       raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
