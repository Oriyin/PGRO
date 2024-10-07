from databases import Database

# Database connection parameters
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

# -------- User Functions -------- #
async def insert_user(username: str, password_hash: str, email: str):
    query = """
    INSERT INTO users (username, password_hash, email)
    VALUES (:username, :password_hash, :email)
    RETURNING user_id, username, password_hash, email, created_at
    """
    values = {"username": username, "password_hash": password_hash, "email": email}
    return await database.fetch_one(query=query, values=values)

async def get_user(username: str):
    query = "SELECT * FROM users WHERE username = :username"
    return await database.fetch_one(query=query, values={"username": username})

async def get_user_by_email(email: str, password_hash: str):
    query = "SELECT * FROM users WHERE email = :email AND password_hash = :password_hash"
    return await database.fetch_one(query=query, values={"email": email, "password_hash": password_hash})

async def update_user(user_id: int, username: str, password_hash: str, email: str):
    query = """
    UPDATE users
    SET username = :username, password_hash = :password_hash, email = :email
    WHERE user_id = :user_id
    RETURNING user_id, username, password_hash, email, created_at
    """
    values = {"user_id": user_id, "username": username, "password_hash": password_hash, "email": email}
    return await database.fetch_one(query=query, values=values)

async def delete_user(user_id: int):
    query = "DELETE FROM users WHERE user_id = :user_id RETURNING *"
    return await database.fetch_one(query=query, values={"user_id": user_id})

# -------- Admin Functions -------- #
async def insert_admin(adminusername: str, adminpassword: str, adminemail: str):
    query = """
    INSERT INTO admins (adminusername, adminpassword, adminemail)
    VALUES (:adminusername, :adminpassword, :adminemail)
    RETURNING admin_id, adminusername, adminpassword, adminemail, admincreated_at
    """
    values = {"adminusername": adminusername, "adminpassword": adminpassword, "adminemail": adminemail}
    return await database.fetch_one(query=query, values=values)

async def get_admin(adminusername: str):
    query = "SELECT * FROM admins WHERE adminusername = :adminusername"
    return await database.fetch_one(query=query, values={"adminusername": adminusername})

async def get_admin_by_email(adminemail: str, adminpassword: str):
    query = "SELECT * FROM admins WHERE adminemail = :adminemail AND adminpassword = :adminpassword"
    return await database.fetch_one(query=query, values={"adminemail": adminemail, "adminpassword": adminpassword})

async def update_admin(admin_id: int, adminusername: str, adminpassword: str, adminemail: str):
    query = """
    UPDATE admins
    SET adminusername = :adminusername, adminpassword = :adminpassword, adminemail = :adminemail
    WHERE admin_id = :admin_id
    RETURNING admin_id, adminusername, adminpassword, adminemail, admincreated_at
    """
    values = {"admin_id": admin_id, "adminusername": adminusername, "adminpassword": adminpassword, "adminemail": adminemail}
    return await database.fetch_one(query=query, values=values)

async def delete_admin(admin_id: int):
    query = "DELETE FROM admins WHERE admin_id = :admin_id RETURNING *"
    return await database.fetch_one(query=query, values={"admin_id": admin_id})

# -------- Product Functions -------- #
async def get_products():
    query = "SELECT * FROM products"
    rows = await database.fetch_all(query=query)
    return [
        {
            "id": row["id"],
            "name": row["name"],
            "price": row["price"],
            "quantity": row["quantity"],
            "description": row["description"],
            "image_url": row["image_url"]
        }
        for row in rows
    ]

async def insert_product(name: str, price: float, quantity: int, description: str, image_url: str):
    query = """
    INSERT INTO products (name, price, quantity, description, image_url)
    VALUES (:name, :price, :quantity, :description, :image_url)
    RETURNING id, name, price, quantity, description, image_url
    """
    values = {
        "name": name,
        "price": price,
        "quantity": quantity,
        "description": description,
        "image_url": image_url
    }
    return await database.fetch_one(query=query, values=values)

async def delete_product(product_id: int):
    query = "DELETE FROM products WHERE id = :product_id RETURNING *"
    return await database.fetch_one(query=query, values={"product_id": product_id})

async def update_product(product_id: int, name: str, price: float, quantity: int, description: str, image_url: str):
    query = """
    UPDATE products
    SET name = :name, price = :price, quantity = :quantity, description = :description, image_url = :image_url
    WHERE id = :product_id
    RETURNING id, name, price, quantity, description, image_url
    """
    values = {
        "product_id": product_id,
        "name": name,
        "price": price,
        "quantity": quantity,
        "description": description,
        "image_url": image_url
    }
    return await database.fetch_one(query=query, values=values)

async def get_product_by_id(product_id: int):
    query = "SELECT * FROM products WHERE id = :product_id"
    return await database.fetch_one(query=query, values={"product_id": product_id})

# -------- Cart Functions -------- #
async def insert_to_cart(product_id: int, quantity: int, username: str):
    query = """
    INSERT INTO carts (product_id, quantity, username)
    VALUES (:product_id, :quantity, :username)
    RETURNING id, product_id, quantity, created_at
    """
    values = {
        "product_id": product_id,
        "quantity": quantity,
        "username": username
    }
    return await database.fetch_one(query=query, values=values)

async def get_cart_items_by_username(username: str):
    query = "SELECT * FROM carts WHERE username = :username"
    rows = await database.fetch_all(query=query, values={"username": username})
    return rows

async def get_cart_by_product_id_and_username(product_id: int, username: str):
    query = """
    SELECT * FROM carts 
    WHERE product_id = :product_id AND username = :username
    """
    return await database.fetch_one(query=query, values={"product_id": product_id, "username": username})

async def update_cart_quantity(product_id: int, quantity: int, username: str):
    print(f"Updating product_id: {product_id}, quantity: {quantity}, username: {username}")  # Debug line
    query = """
    UPDATE carts 
    SET quantity = :quantity 
    WHERE product_id = :product_id AND username = :username
    RETURNING id, product_id, quantity, username, created_at
    """
    values = {"product_id": product_id, "quantity": quantity, "username": username}
    return await database.fetch_one(query=query, values=values)

async def delete_cart_item(product_id: int, username: str):
    query = "DELETE FROM carts WHERE product_id = :product_id AND username = :username RETURNING *"
    values = {"product_id": product_id, "username": username}
    return await database.fetch_one(query=query, values=values)

# -------- Order Functions -------- #
async def create_order(username: str, total_amount: float):
    query = """
    INSERT INTO orders (username, total_amount)
    VALUES (:username, :total_amount)
    RETURNING id
    """
    values = {"username": username, "total_amount": total_amount}
    return await database.fetch_one(query=query, values=values)

async def update_product_quantity(product_id: int, quantity: int):
    query = """
    UPDATE products
    SET quantity = quantity - :quantity
    WHERE id = :product_id
    """
    values = {"product_id": product_id, "quantity": quantity}
    await database.execute(query=query, values=values)

async def clear_cart_for_user(username: str):
    query = "DELETE FROM carts WHERE username = :username"
    await database.execute(query=query, values={"username": username})