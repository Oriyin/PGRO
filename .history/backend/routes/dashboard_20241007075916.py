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

@router.get("/users/total")
async def get_total_users():
    query = "SELECT COUNT(*) as total_users FROM users"
    result = await database.fetch_one(query)
    return {"totalUsers": result["total_users"]}

@router.get("/admins/total")
async def get_total_admins():
    query = "SELECT COUNT(*) as total_admins FROM admins"
    result = await database.fetch_one(query)
    return {"totalAdmins": result["total_admins"]}

@router.post("/checkout")
async def checkout(order: dict):
    try:
        # รับข้อมูลจาก body request
        username = order.get("username")
        items = order.get("items")
        total_amount = order.get("total_amount")

        if not username or not items:
            raise HTTPException(status_code=400, detail="Invalid order data")

        # สร้างคำสั่งซื้อใหม่ในตาราง orders
        result = await create_order(username=username, total_amount=total_amount, items=items)
        
        # ลบสินค้าทั้งหมดในตะกร้าหลังจากเช็คเอาท์
        await clear_cart(username)
        return {"message": "Checkout successful!", "order_id": result["id"]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
