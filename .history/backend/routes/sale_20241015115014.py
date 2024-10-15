from fastapi import APIRouter, HTTPException
from database import database
from datetime import datetime, timedelta
from pydantic import BaseModel
from typing import List
import json
router = APIRouter()

class Order(BaseModel):
    id: int
    username: str
    total_amount: float
    created_at: datetime
    items: List[dict]

@router.post("/checkout")
async def checkout(username: str):
    try:

        delete_cart_query = "DELETE FROM carts WHERE user_id = (SELECT user_id FROM users WHERE username = :username)"
        await database.execute(query=delete_cart_query, values={"username": username})

        update_product_query = """
        UPDATE products p
        SET quantity = quantity - c.quantity
        FROM carts c
        WHERE c.product_id = p.id
        AND c.user_id = (SELECT user_id FROM users WHERE username = :username)
        """
        await database.execute(query=update_product_query, values={"username": username})

        return {"message": "Checkout successful"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class Order(BaseModel):
    id: int
    username: str
    total_amount: float
    created_at: str
    items: List[dict]

@router.get("/orders", response_model=List[Order])
async def get_orders():
    """
    Get all orders with item details (name, quantity, price, and image_url).
    """
    # Query to get all orders
    query = """
    SELECT id, username, total_amount, created_at, items
    FROM orders
    ORDER BY created_at DESC
    """
    
    rows = await database.fetch_all(query=query)

    orders = []

    for row in rows:
        # Parse the items if it's stored as a JSON string
        items = json.loads(row["items"]) if isinstance(row["items"], str) else row["items"]
        detailed_items = []

        # Process each item in the order
        for item in items:
            product_id = item.get("product_id")
            quantity = item.get("quantity")

            # Skip items with invalid product_id
            if not product_id or product_id == 0:
                continue

            # Query to get the product name, price, and image_url from the products table
            product_query = "SELECT name, price, image_url FROM products WHERE id = :product_id"
            product_data = await database.fetch_one(product_query, values={"product_id": product_id})

            if not product_data:
                raise HTTPException(status_code=404, detail=f"Product with id {product_id} not found")

            detailed_items.append({
                "name": product_data["name"],
                "quantity": quantity,
                "price": product_data["price"],
                "image_url": product_data["image_url"],
                "total_price": product_data["price"] * quantity  # Calculate total price per item
            })

        # Add the order with detailed items to the result
        orders.append(Order(
            id=row["id"],
            username=row["username"],
            total_amount=row["total_amount"],
            created_at=row["created_at"],
            items=detailed_items
        ))

    # Return the list of orders
    return orders

@router.get("/weekly-report")
async def get_weekly_report():
    """
    Get weekly report including total sales and total orders for the past 7 days.
    """
    # Calculate the date for 7 days ago
    seven_days_ago = datetime.now() - timedelta(days=7)

    # Query to get total sales for the last 7 days
    sales_query = """
    SELECT SUM(total_amount) as total_sales
    FROM orders
    WHERE created_at >= :seven_days_ago
    """
    total_sales_result = await database.fetch_one(sales_query, values={"seven_days_ago": seven_days_ago})

    # Query to get total orders for the last 7 days
    orders_query = """
    SELECT COUNT(*) as total_orders
    FROM orders
    WHERE created_at >= :seven_days_ago
    """
    total_orders_result = await database.fetch_one(orders_query, values={"seven_days_ago": seven_days_ago})

    # Prepare the response with sales and orders
    weekly_report = {
        "totalSales": total_sales_result["total_sales"] or 0,  # default to 0 if no result
        "totalOrders": total_orders_result["total_orders"] or 0,  # default to 0 if no result
    }

    return weekly_report