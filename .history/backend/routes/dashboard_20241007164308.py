from fastapi import APIRouter, HTTPException
from database import database

router = APIRouter()
print("Sale router is included")

@router.get("/sales/total")
async def get_total_sales():
    query = "SELECT SUM(total_amount) as total_sales FROM orders"
    result = await database.fetch_one(query)
    return {"totalSales": result["total_sales"]}

@router.get("/sales/data")
async def get_sales_data():
    query = """
    SELECT DATE(created_at) as date, SUM(total_amount) as sales
    FROM orders
    GROUP BY DATE(created_at)
    ORDER BY date DESC
    LIMIT 30
    """
    results = await database.fetch_all(query)
    sales_data = [{"date": row["date"], "sales": row["sales"]} for row in results]
    return {"salesData": sales_data}

@router.get("/sales/total-orders")
async def get_total_orders():
    query = "SELECT COUNT(*) as total_orders FROM orders"
    result = await database.fetch_one(query)
    return {"totalOrders": result["total_orders"]}


@router.get("/admins/total")
async def get_total_admins():
    query = "SELECT COUNT(*) as total_admins FROM admins"
    result = await database.fetch_one(query)
    return {"totalAdmins": result["total_admins"]}

@router.get("/orders/recent")
async def get_recent_orders(limit: int = 5):
    query = """
    SELECT * FROM orders ORDER BY created_at DESC LIMIT :limit
    """
    recent_orders = await database.fetch_all(query, values={"limit": limit})
    return recent_orders

@router.get("/admins/recent-login")
async def get_recent_logged_in_admins(limit: int = 5):
    try:
        query = """
        SELECT * FROM admins ORDER BY last_login DESC LIMIT :limit
        """
        recent_admins = await database.fetch_all(query, values={"limit": limit})
        return recent_admins
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/users/recent-login")
async def get_recent_logged_in_users(limit: int = 5):
    try:
        query = """
        SELECT * FROM users ORDER BY last_login DESC LIMIT :limit
        """
        recent_users = await database.fetch_all(query, values={"limit": limit})
        return recent_users
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/products/low-stock")
async def get_low_stock_products(limit: int = 5):
    try:
        query = """
        SELECT * FROM products WHERE quantity < 5 ORDER BY quantity ASC LIMIT :limit
        """
        low_stock_products = await database.fetch_all(query, values={"limit": limit})
        return low_stock_products
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

