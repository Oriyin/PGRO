from fastapi import APIRouter, HTTPException
from database import database
import json
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



router = APIRouter()

@router.get("/orders/latest", response_model=list[dict])
async def get_latest_orders(limit: int = 3):
    """
    Get the latest orders with item details (name, quantity, price).
    By default, it will return the 3 most recent orders.
    """
    # Query to get the latest orders
    query = """
    SELECT id, username, total_amount, created_at, items
    FROM orders
    ORDER BY created_at DESC
    LIMIT :limit
    """
    values = {"limit": limit}
    rows = await database.fetch_all(query=query, values=values)

    orders = []

    # Loop through the orders and process items to include product details
    for row in rows:
        # Parse the items if it's stored as a JSON string
        items = json.loads(row["items"]) if isinstance(row["items"], str) else row["items"]
        detailed_items = []

        # Process each item in the order
        for item in items:
            product_id = item["product_id"]
            quantity = item["quantity"]

            # Query to get the product name and price from the products table
            product_query = "SELECT name, price FROM products WHERE id = :product_id"
            product_data = await database.fetch_one(product_query, values={"product_id": product_id})

            if not product_data:
                raise HTTPException(status_code=404, detail=f"Product with id {product_id} not found")

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