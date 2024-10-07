from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import pytz  # To handle timezones
from database import database  # Ensure your database connection is set up

router = APIRouter()

# Model for Admin creation
class AdminCreate(BaseModel):
    adminusername: str
    adminpassword: str
    adminemail: str

# Model for Admin login
class AdminLogin(BaseModel):
    adminemail: str
    adminpassword: str

# Model for Admin response
class Admin(BaseModel):
    admin_id: int
    adminusername: str
    adminemail: str
    admincreated_at: datetime
    last_login: Optional[datetime]

# Function to insert a new admin into the admins table
async def insert_admin(adminusername: str, adminpassword: str, adminemail: str, created_at: datetime):
    query = """
    INSERT INTO admins (adminusername, adminpassword, adminemail, admincreated_at)
    VALUES (:adminusername, :adminpassword, :adminemail, :created_at)
    RETURNING admin_id, adminusername, adminemail, admincreated_at, last_login
    """
    values = {
        "adminusername": adminusername,
        "adminpassword": adminpassword,
        "adminemail": adminemail,
        "created_at": created_at
    }
    return await database.fetch_one(query=query, values=values)

# Function to update last login time (in Thai timezone)
async def update_admin_last_login(adminemail: str):
    tz = pytz.timezone('Asia/Bangkok')  # Set to Thai timezone
    current_time = datetime.now(tz).replace(tzinfo=None)  # Make naive
    query = "UPDATE admins SET last_login = :last_login WHERE adminemail = :adminemail"
    await database.execute(query=query, values={"last_login": current_time, "adminemail": adminemail})

# Endpoint for creating a new admin
@router.post("/admin/create", response_model=Admin)
async def create_admin(admin: AdminCreate):
    # Check if the username or email already exists
    existing_admin_username = await get_admin_by_username(admin.adminusername)
    existing_admin_email = await get_admin_by_email(admin.adminemail)
    if existing_admin_username:
        raise HTTPException(status_code=400, detail="Username already exists")
    if existing_admin_email:
        raise HTTPException(status_code=400, detail="Email already exists")

    # Set current time in Thailand's timezone for the created_at field
    tz = pytz.timezone('Asia/Bangkok')
    current_time = datetime.now(tz).replace(tzinfo=None)

    # Insert the admin into the database with the current Thai time
    result = await insert_admin(admin.adminusername, admin.adminpassword, admin.adminemail, current_time)

    if result is None:
        raise HTTPException(status_code=400, detail="Error creating admin")
    
    return result

# Endpoint for admin login
@router.post("/admin/login")
async def login_admin(admin: AdminLogin):
    db_admin = await get_admin_by_email(admin.adminemail)
    if db_admin is None:
        raise HTTPException(status_code=404, detail="Admin not found")

    if db_admin['adminpassword'] != admin.adminpassword:
        raise HTTPException(status_code=400, detail="Wrong password")  # Notify wrong password

    # Update last_login timestamp when admin logs in
    await update_admin_last_login(admin.adminemail)

    # Fetch updated admin info
    updated_admin = await get_admin_by_email(admin.adminemail)

    return {
        "message": "Admin login successful",
        "admin_id": updated_admin["admin_id"],
        "adminusername": updated_admin["adminusername"],
        "adminemail": updated_admin["adminemail"],
        "admincreated_at": updated_admin["admincreated_at"],
        "last_login": updated_admin["last_login"]
    }

# Function to get the 3 most recent admin logins
@router.get("/admins/recent-logins", response_model=List[Admin])
async def get_recent_logged_in_admins(limit: int = 3):
    query = """
    SELECT admin_id, adminusername, adminemail, admincreated_at, last_login
    FROM admins
    WHERE last_login IS NOT NULL
    ORDER BY last_login DESC
    LIMIT :limit
    """
    recent_admins = await database.fetch_all(query=query, values={"limit": limit})

    return [
        {
            "admin_id": admin["admin_id"],
            "adminusername": admin["adminusername"],
            "adminemail": admin["adminemail"],
            "admincreated_at": admin["admincreated_at"],
            "last_login": admin["last_login"]
        }
        for admin in recent_admins
    ]

# Helper function to get admin by email
async def get_admin_by_email(adminemail: str):
    query = "SELECT * FROM admins WHERE adminemail = :adminemail"
    return await database.fetch_one(query=query, values={"adminemail": adminemail})

# Helper function to get admin by username
async def get_admin_by_username(adminusername: str):
    query = "SELECT * FROM admins WHERE adminusername = :adminusername"
    return await database.fetch_one(query=query, values={"adminusername": adminusername})

