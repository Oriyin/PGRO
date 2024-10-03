from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import *  # ตรวจสอบให้แน่ใจว่ามีการนำเข้า database ที่ถูกต้อง

router = APIRouter()

# Pydantic model for cart items
class CartItem(BaseModel):
    product_id: int  # เปลี่ยนจาก product_name เป็น product_id
    quantity: int
    username: str

@router.post("/carts")
async def add_to_cart(cart_item: CartItem):
    try:
        result = await insert_to_cart(
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
            username=cart_item.username
        )
        return {"message": "Item added to cart successfully!", "item": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/carts")
async def read_cart_items(username: str):
    cart_items = await get_cart_items_by_username(username)
    items_with_details = {}

    # Aggregate items by product_id
    for item in cart_items:
        product = await get_product_by_id(item['product_id'])
        if product:
            if item['product_id'] not in items_with_details:
                items_with_details[item['product_id']] = {
                    "id": item['id'],
                    "product_name": product['name'],
                    "quantity": item['quantity'],
                    "price": product['price'],
                    "created_at": item['created_at'],
                    "product_image": product['image_url'],  # แสดงภาพสินค้า
                }
            else:
                items_with_details[item['product_id']]['quantity'] += item['quantity']  # รวมจำนวน

    return list(items_with_details.values())

@router.delete("/carts/{cart_item_id}")
async def remove_from_cart(cart_item_id: int):
    deleted_item = await delete_cart_item(cart_item_id)
    if not deleted_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"message": "Cart item deleted", "item": deleted_item}

@router.put("/carts/{product_id}")
async def update_cart_item(product_id: int, quantity: int, username: str):
    cart_item = await get_cart_by_product_id_and_username(product_id, username)
    if not cart_item:
        raise HTTPException(status_code=404, detail="Item not found in cart")

    if quantity < 1:
        raise HTTPException(status_code=400, detail="Quantity must be at least 1")

    updated_item = await update_cart_quantity(product_id, quantity, username)
    return {"message": "Quantity updated successfully", "item": updated_item}
