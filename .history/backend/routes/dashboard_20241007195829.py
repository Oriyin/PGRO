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

@router.get("/orders/latest")
async def get_latest_orders(limit: int = 10):
    """
    Get the latest orders.
    By default, it will return the 10 most recent orders. You can adjust the 'limit' parameter as needed.
    """
    query = f"""
    SELECT id, username, total_amount, created_at, items
    FROM orders
    ORDER BY created_at DESC
    LIMIT :limit
    """
    results = await database.fetch_all(query, values={"limit": limit})
    
    orders = [
        {
            "id": row["id"],
            "username": row["username"],
            "total_amount": row["total_amount"],
            "created_at": row["created_at"],
            "items": row["items"]
        }
        for row in results
    ]
    
    return {"latestOrders": orders}