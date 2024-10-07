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

@router.get("/sales/latest-orders")
async def get_latest_orders(limit: int = 10):
    try:
        query = f"""
        SELECT * FROM orders
        ORDER BY created_at DESC
        LIMIT {limit}
        """
        results = await database.fetch_all(query)

        if not results:
            raise HTTPException(status_code=404, detail="No orders found")
        
        latest_orders = [{"id": row["id"], "username": row["username"], "total_amount": row["total_amount"], "created_at": row["created_at"], "items": row.get("items")} for row in results]
        return {"latestOrders": latest_orders}
    
    except Exception as e:
        print(f"Error fetching latest orders: {str(e)}")  # Log the error
        raise HTTPException(status_code=500, detail="Internal Server Error")
