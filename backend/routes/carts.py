from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import *  # Import your database functions here

router = APIRouter()

# Pydantic model for cart items
class CartItem(BaseModel):
    product_id: int  # ใช้ product_id แทน product_name
    quantity: int
    username: str

@router.post("/carts")
async def add_to_cart(cart_item: CartItem):
    try:
        # ตรวจสอบว่าผลิตภัณฑ์มีอยู่ในฐานข้อมูล
        product = await get_product_by_id(cart_item.product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        # ตรวจสอบว่าผู้ใช้มีสินค้านี้อยู่ในตะกร้าแล้วหรือไม่
        existing_item = await get_cart_by_product_id_and_username(cart_item.product_id, cart_item.username)
        if existing_item:
            # ถ้ามีอยู่แล้ว อัปเดตจำนวนสินค้า
            updated_item = await update_cart_quantity(cart_item.product_id, cart_item.quantity + existing_item['quantity'], cart_item.username)
            return {"message": "Cart item updated successfully!", "item": updated_item}
        else:
            # ถ้าไม่มี ให้เพิ่มสินค้าลงในตะกร้า
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
    items_with_details = []
    
    # Aggregate items by product_id
    for item in cart_items:
        product = await get_product_by_id(item.product_id)
        if product:
            items_with_details.append({
                "id": item.id,
                "product_name": product['name'],
                "quantity": item.quantity,
                "price": product['price'],
                "created_at": item.created_at,
                "product_image": product['image_url'],
            })

    return items_with_details

@router.delete("/carts/{cart_item_id}")
async def remove_from_cart(cart_item_id: int):
    deleted_item = await delete_cart_item(cart_item_id)
    if not deleted_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"message": "Cart item deleted", "item": deleted_item}
