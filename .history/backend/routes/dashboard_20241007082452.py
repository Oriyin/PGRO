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

# Endpoint for fetching recent orders
@router.get("/orders/recent")
async def get_recent_orders():
    query = """
    SELECT order_id, customer_name, total_amount, status, order_date
    FROM orders
    ORDER BY order_date DESC
    LIMIT 5
    """
    recent_orders = await database.fetch_all(query)
    return recent_orders
