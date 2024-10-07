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
        orders.order_id, 
        orders.created_at, 
        orders.total_amount, 
        users.username, 
        products.product_name
    FROM orders
    JOIN users ON orders.user_id = users.user_id
    JOIN order_items ON orders.order_id = order_items.order_id
    JOIN products ON order_items.product_id = products.product_id
    ORDER BY orders.created_at DESC
    LIMIT :limit
    """
    recent_orders = await database.fetch_all(query, values={"limit": limit})
    return recent_orders



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

