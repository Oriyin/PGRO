from fastapi import APIRouter, HTTPException
from database import database
from datetime import datetime
from pydantic import BaseModel
from typing import List

router = APIRouter()

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

