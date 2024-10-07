from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from database import database  # ตรวจสอบว่าการเชื่อมต่อฐานข้อมูลถูกตั้งค่าแล้ว

router = APIRouter()

# โมเดลสำหรับการสร้างแอดมิน
class AdminCreate(BaseModel):
    adminusername: str
    adminpassword: str
    adminemail: str

# โมเดลสำหรับการอัปเดตแอดมิน
class AdminUpdate(BaseModel):
    adminusername: Optional[str]
    adminpassword: Optional[str]
    adminemail: Optional[str]

# โมเดลสำหรับการตอบกลับแอดมิน
class Admin(BaseModel):
    admin_id: int
    adminusername: str
    adminemail: str
    admincreated_at: datetime
    last_login: Optional[datetime]  # เพิ่มฟิลด์ last_login

# โมเดลสำหรับการล็อกอิน
class AdminLogin(BaseModel):
    adminemail: str
    adminpassword: str

# ฟังก์ชันสำหรับเพิ่มแอดมินใหม่ลงในตาราง admins
async def insert_admin(adminusername: str, adminpassword: str, adminemail: str):
    query = """
    INSERT INTO admins (adminusername, adminpassword, adminemail)
    VALUES (:adminusername, :adminpassword, :adminemail)
    RETURNING admin_id, adminusername, adminemail, admincreated_at, last_login
    """
    values = {"adminusername": adminusername, "adminpassword": adminpassword, "adminemail": adminemail}
    return await database.fetch_one(query=query, values=values)

# ฟังก์ชันสำหรับดึงแอดมินตาม admin_id
async def get_admin(admin_id: int):
    query = "SELECT * FROM admins WHERE admin_id = :admin_id"
    return await database.fetch_one(query=query, values={"admin_id": admin_id})

# ฟังก์ชันสำหรับดึงแอดมินตาม adminusername
async def get_admin_by_username(adminusername: str):
    query = "SELECT * FROM admins WHERE adminusername = :adminusername"
    return await database.fetch_one(query=query, values={"adminusername": adminusername})

# ฟังก์ชันสำหรับดึงแอดมินตามอีเมล
async def get_admin_by_email(adminemail: str):
    query = "SELECT * FROM admins WHERE adminemail = :adminemail"
    return await database.fetch_one(query=query, values={"adminemail": adminemail})

# ฟังก์ชันสำหรับอัปเดตแอดมิน
async def update_admin(admin_id: int, adminusername: str, adminpassword: Optional[str], adminemail: Optional[str]):
    query = """
    UPDATE admins
    SET adminusername = :adminusername, 
        adminpassword = COALESCE(:adminpassword, adminpassword),
        adminemail = COALESCE(:adminemail, adminemail)
    WHERE admin_id = :admin_id
    RETURNING admin_id, adminusername, adminemail, admincreated_at, last_login
    """
    values = {
        "admin_id": admin_id,
        "adminusername": adminusername,
        "adminpassword": adminpassword,
        "adminemail": adminemail
    }
    return await database.fetch_one(query=query, values=values)

# ฟังก์ชันสำหรับลบแอดมิน
async def delete_admin(admin_id: int):
    query = "DELETE FROM admins WHERE admin_id = :admin_id RETURNING *"
    return await database.fetch_one(query=query, values={"admin_id": admin_id})

# ฟังก์ชันสำหรับอัปเดต last_login เมื่อแอดมินล็อกอิน
async def update_admin_last_login(adminemail: str):
    query = "UPDATE admins SET last_login = NOW() WHERE adminemail = :adminemail"
    await database.execute(query=query, values={"adminemail": adminemail})

@router.post("/admin/create", response_model=Admin)
async def create_admin(admin: AdminCreate):
    # ตรวจสอบว่าชื่อผู้ใช้มีอยู่แล้วหรือไม่
    existing_admin_username = await get_admin_by_username(admin.adminusername)
    if existing_admin_username:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # ตรวจสอบว่าอีเมลมีอยู่แล้วหรือไม่
    existing_admin_email = await get_admin_by_email(admin.adminemail)
    if existing_admin_email:
        raise HTTPException(status_code=400, detail="Email already exists")  # แจ้งว่าอีเมลมีอยู่แล้ว

    # เพิ่มแอดมินใหม่
    result = await insert_admin(admin.adminusername, admin.adminpassword, admin.adminemail)
    if result is None:
        raise HTTPException(status_code=400, detail="Error creating user")
    
    return result

# เอ็นด์พอยต์สำหรับดึงแอดมินตาม admin_id
@router.get("/admin/{admin_id}", response_model=Admin)
async def read_admin(admin_id: int):
    result = await get_admin(admin_id)
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return result

# เอ็นด์พอยต์สำหรับอัปเดตแอดมิน
@router.put("/admin/{admin_id}", response_model=Admin)
async def update_admin_endpoint(admin_id: int, admin: AdminUpdate):
    result = await update_admin(admin_id, admin.adminusername, admin.adminpassword, admin.adminemail)
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return result

# เอ็นด์พอยต์สำหรับลบแอดมิน
@router.delete("/admin/{admin_id}")
async def delete_admin_endpoint(admin_id: int):
    result = await delete_admin(admin_id)
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted"}

# เอ็นด์พอยต์สำหรับการล็อกอินแอดมิน
@router.post("/admin/login")
async def login_admin(admin: AdminLogin):
    db_admin = await get_admin_by_email(admin.adminemail)
    if db_admin is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    if db_admin['adminpassword'] != admin.adminpassword:
        raise HTTPException(status_code=400, detail="Wrong password")  # แจ้งว่ารหัสผ่านไม่ถูกต้อง

    # อัปเดตเวลา last_login
    await update_admin_last_login(admin.adminemail)

    # ดึงข้อมูลแอดมินที่อัปเดตแล้ว
    updated_admin = await get_admin_by_email(admin.adminemail)

    return {
        "admin_id": updated_admin["admin_id"],
        "adminusername": updated_admin["adminusername"],
        "adminemail": updated_admin["adminemail"],
        "admincreated_at": updated_admin["admincreated_at"],
        "last_login": updated_admin["last_login"]
    }

# เอ็นด์พอยต์สำหรับดึงแอดมินที่ล็อกอินล่าสุด
@router.get("/admins/recent-login")
async def get_recent_logged_in_admins(limit: int = 5):
    query = """
    SELECT admin_id, adminusername, adminemail, admincreated_at, last_login
    FROM admins
    WHERE last_login IS NOT NULL
    ORDER BY last_login DESC
    LIMIT :limit
    """
    recent_admins = await database.fetch_all(query=query, values={"limit": limit})
    return recent_admins

# เอ็นด์พอยต์สำหรับดึงจำนวนแอดมินทั้งหมด
@router.get("/admins/total")
async def get_total_admins():
    query = "SELECT COUNT(*) as total_admins FROM admins"
    result = await database.fetch_one(query)
    return {"totalAdmins": result["total_admins"]}
