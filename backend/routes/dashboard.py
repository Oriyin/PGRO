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
    SELECT 
        o.order_id, 
        o.created_at, 
        o.total_amount, 
        o.username, 
        p.product_name, 
        oi.quantity
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    ORDER BY o.created_at DESC
    LIMIT :limit
    """
    try:
        recent_orders = await database.fetch_all(query=query, values={"limit": limit})
        return recent_orders
    except Exception as e:
        print(f"Error fetching recent orders: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


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

