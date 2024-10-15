from fastapi import APIRouter, HTTPException
from database import database
from datetime import datetime
from pydantic import BaseModel
from typing import List

router = APIRouter()
print("Sale router is included")

class OrderItem(BaseModel):
    product_id: int
    name: str
    quantity: int
    total_price: float

class Order(BaseModel):
    id: int
    username: str
    total_amount: float
    created_at: datetime
    items: List[OrderItem]  # Assuming items is a list of product details

@router.post("/checkout")
async def checkout(username: str):
    try:
        # Query to delete items from the cart
        delete_cart_query = "DELETE FROM carts WHERE user_id = (SELECT user_id FROM users WHERE username = :username)"
        await database.execute(query=delete_cart_query, values={"username": username})

        # Query to update product quantities based on cart
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

@router.get("/orders", response_model=List[Order])
async def get_orders():
    try:
        query = "SELECT * FROM orders"  # Adjust this query based on your database schema
        results = await database.fetch_all(query=query)

        # Transform results to the desired output format
        orders = [
            {
                "id": row["id"],
                "username": row["username"],
                "total_amount": row["total_amount"],
                "created_at": row["created_at"],
                "items": row["items"],  # Adjust based on how you structure the order items
            }
            for row in results
        ]
        return orders
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
