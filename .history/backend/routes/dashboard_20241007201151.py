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
    Get the latest orders with item details (name, quantity, price).
    By default, it will return the 10 most recent orders.
    """
    # Query to get the latest orders
    query = f"""
    SELECT o.id, o.username, o.total_amount, o.created_at, o.items
    FROM orders o
    ORDER BY o.created_at DESC
    LIMIT :limit
    """
    results = await database.fetch_all(query, values={"limit": limit})

    orders = []

    # Loop through the orders and process items to include product details
    for row in results:
        items = row["items"]  # List of items in the order
        detailed_items = []

        # Process each item in the order
        for item in items:
            product_id = item["product_id"]
            quantity = item["quantity"]

            # Query to get the product name and price from products table
            product_query = "SELECT name, price FROM products WHERE id = :product_id"
            product_data = await database.fetch_one(product_query, values={"product_id": product_id})

            if product_data:
                detailed_items.append({
                    "name": product_data["name"],
                    "quantity": quantity,
                    "price": product_data["price"],
                    "total_price": product_data["price"] * quantity  # Calculate total price per item
                })

        # Add the order with detailed items to the result
        orders.append({
            "id": row["id"],
            "username": row["username"],
            "total_amount": row["total_amount"],
            "created_at": row["created_at"],
            "items": detailed_items  # Replace items with detailed items
        })

    return {"latestOrders": orders}
