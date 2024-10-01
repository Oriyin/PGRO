from databases import Database


POSTGRES_USER = "Yin"
POSTGRES_PASSWORD = "66011050"
POSTGRES_DB = "PGRO"
POSTGRES_HOST = "db"


DATABASE_URL = f'postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}/{POSTGRES_DB}'


database = Database(DATABASE_URL)


async def connect_db():
   await database.connect()
   print("Database connected")


async def disconnect_db():
   await database.disconnect()
   print("Database disconnected")


# Function to insert a new user into the users table
async def insert_user(username: str, password_hash: str, email: str):
   query = """
   INSERT INTO users (username, password_hash, email)
   VALUES (:username, :password_hash, :email)
   RETURNING user_id, username, password_hash, email, created_at
   """
   values = {"username": username, "password_hash": password_hash, "email": email}
   return await database.fetch_one(query=query, values=values)


# Function to select a user by user_id from the users table
async def get_user(username: str):
   query = "SELECT * FROM users WHERE username = :username"
   return await database.fetch_one(query=query, values={"username": username})


# Function to select a user by email from the users table
async def get_user_by_email(email: str,password_hash:str):
   query = "SELECT * FROM users WHERE email = :email and password_hash = :password_hash"
   return await database.fetch_one(query=query, values={"email": email,"password_hash": password_hash})


# Function to update a user in the users table
async def update_user(user_id: int, username: str, password_hash: str, email: str):
   query = """
   UPDATE users
   SET username = :username, password_hash = :password_hash, email = :email
   WHERE user_id = :user_id
   RETURNING user_id, username, password_hash, email, created_at
   """
   values = {"user_id": user_id, "username": username, "password_hash": password_hash, "email": email}
   return await database.fetch_one(query=query, values=values)


# Function to delete a user from the users table
async def delete_user(user_id: int):
   query = "DELETE FROM users WHERE user_id = :user_id RETURNING *"
   return await database.fetch_one(query=query, values={"user_id": user_id})





# Function to insert a new user into the admins table
async def insert_admin(adminusername: str, adminpassword: str, adminemail: str):
    # ถ้าต้องการเก็บรหัสผ่านในรูปแบบที่ไม่เข้ารหัส ให้ละเว้นการเข้ารหัส
    query = """
    INSERT INTO admins (adminusername, adminpassword, adminemail)
    VALUES (:adminusername, :adminpassword, :adminemail)
    RETURNING admin_id, adminusername, adminpassword, adminemail, admincreated_at
    """
    values = {"adminusername": adminusername, "adminpassword": adminpassword, "adminemail": adminemail}
    return await database.fetch_one(query=query, values=values)

# Function to select an admin by adminusername
async def get_admin(adminusername: str):
    query = "SELECT * FROM admins WHERE adminusername = :adminusername"
    return await database.fetch_one(query=query, values={"adminusername": adminusername})

# Function to select an admin by email and password
async def get_admin_by_email(adminemail: str, adminpassword: str):
    query = "SELECT * FROM admins WHERE adminemail = :adminemail AND adminpassword = :adminpassword"
    return await database.fetch_one(query=query, values={"adminemail": adminemail, "adminpassword": adminpassword})

# Function to update an admin
async def update_admin(admin_id: int, adminusername: str, adminpassword: str, adminemail: str):
    query = """
    UPDATE admins
    SET adminusername = :adminusername, adminpassword = :adminpassword, adminemail = :adminemail
    WHERE admin_id = :admin_id
    RETURNING admin_id, adminusername, adminpassword, adminemail, admincreated_at
    """
    values = {"admin_id": admin_id, "adminusername": adminusername, "adminpassword": adminpassword, "adminemail": adminemail}
    return await database.fetch_one(query=query, values=values)

# Function to delete an admin
async def delete_admin(admin_id: int):
    query = "DELETE FROM admins WHERE admin_id = :admin_id RETURNING *"
    return await database.fetch_one(query=query, values={"admin_id": admin_id})
