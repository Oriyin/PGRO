from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import pytz  # To handle timezones
from database import *

router = APIRouter()

# Pydantic model for user creation
class UserCreate(BaseModel):
    username: str
    password_hash: str
    email: str

# Pydantic model for user update
class UserUpdate(BaseModel):
    username: Optional[str]
    password_hash: Optional[str]
    email: Optional[str]

# Pydantic model for user response
class User(BaseModel):
    user_id: int
    username: str
    email: str
    created_at: datetime
    last_login: Optional[datetime] = None

# Pydantic model for login
class UserLogin(BaseModel):
    email: str
    password_hash: str

# 1. Endpoint to get the latest logged-in users
@router.get("/users/recent-logins", response_model=List[User])
async def get_latest_logged_in_users(limit: int = 3):
    query = """
    SELECT user_id, username, email, created_at, last_login
    FROM users
    WHERE last_login IS NOT NULL
    ORDER BY last_login DESC
    LIMIT :limit
    """
    values = {"limit": limit}
    rows = await database.fetch_all(query=query, values=values)

    return [
        {
            "user_id": row["user_id"],
            "username": row["username"],
            "email": row["email"],
            "created_at": row["created_at"],
            "last_login": row["last_login"]
        }
        for row in rows
    ]

# 2. Endpoint to create a new user
@router.post("/users/create", response_model=User)
async def create_user(user: UserCreate):
    # Check if the username already exists
    existing_user = await get_user(user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Check if the email already exists (without password check)
    existing_email = await get_user_by_email_only(user.email)
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    # Set current time in Thailand's timezone for the created_at field
    tz = pytz.timezone('Asia/Bangkok')
    current_time = datetime.now(tz)
    current_time_naive = current_time.replace(tzinfo=None)  # Make it naive

    # Insert the user into the database with the current Thai time
    result = await insert_user(user.username, user.password_hash, user.email, current_time_naive)
    
    if result is None:
        raise HTTPException(status_code=400, detail="Error creating user")
    return result


# 3. Endpoint to get the total number of users
@router.get("/users/total")
async def get_total_users():
    query = "SELECT COUNT(*) as total_users FROM users"
    result = await database.fetch_one(query)
    return {"totalUsers": result["total_users"]}

# 4. Endpoint to get a user by user_id
@router.get("/users/{user_id}", response_model=User)
async def read_user(user_id: int):
    result = await get_user(user_id)
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return result

# Endpoint to update a user
@router.put("/users/{user_id}", response_model=User)
async def update_user_endpoint(user_id: int, user: UserUpdate):
    result = await update_user(user_id, user.username, user.password_hash, user.email)
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return result

# Endpoint to delete a user
@router.delete("/users/{user_id}")
async def delete_user_endpoint(user_id: int):
    result = await delete_user(user_id)
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted"}

# Endpoint for user login
@router.post("/users/login")
async def login_user(user: UserLogin):
    # Fetch user from the database with email and password
    db_user = await get_user_by_email(user.email, user.password_hash)

    if db_user is None:
        raise HTTPException(status_code=404, detail="Wrong email or password")

    # Update last_login timestamp when user logs in
    await update_last_login(db_user["user_id"])

    # If login is successful, return user info and a success message
    return {
        "message": "Login successful",
        "user_id": db_user["user_id"],
        "username": db_user["username"],
        "email": db_user["email"],
        "created_at": db_user["created_at"],
        "last_login": db_user["last_login"]
    }

# Function to update last login time with Thailand timezone
async def update_last_login(user_id: int):
    tz = pytz.timezone('Asia/Bangkok')  # Set timezone to Asia/Bangkok
    current_time = datetime.now(tz)

    # Convert timezone-aware datetime to a naive datetime (without timezone info)
    current_time_naive = current_time.replace(tzinfo=None)

    query = """
    UPDATE users
    SET last_login = :last_login
    WHERE user_id = :user_id
    """
    values = {"last_login": current_time_naive, "user_id": user_id}
    await database.execute(query=query, values=values)


# Helper function to check email during registration without password
async def get_user_by_email_only(email: str):
    query = "SELECT * FROM users WHERE email = :email"
    return await database.fetch_one(query=query, values={"email": email})
