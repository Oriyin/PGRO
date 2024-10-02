from fastapi import APIRouter
from database import *

router = APIRouter()

@router.get("/cart/{user_id}")
async def get_cart(user_id: int):
    cart_items = await database.get_cart_items(user_id)
    return cart_items

