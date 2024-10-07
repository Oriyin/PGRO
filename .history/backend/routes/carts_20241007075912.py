from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from database import *  # Ensure your database functions are correctly imported

router = APIRouter()

class CartItem(BaseModel):
    product_id: int
    quantity: int
    username: str

## for adding products to cart
@router.post("/carts")
async def add_to_cart(cart_item: CartItem):
    try:
        # Fetch the product by ID
        product = await get_product_by_id(cart_item.product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        # Check if the item already exists in the user's cart
        existing_item = await get_cart_by_product_id_and_username(cart_item.product_id, cart_item.username)
        if existing_item:
            # Update quantity if the item already exists in the cart
            updated_item = await update_cart_quantity(
                cart_item.product_id, 
                cart_item.quantity + existing_item['quantity'], 
                cart_item.username
            )
            return {"message": "Cart item updated successfully!", "item": updated_item}
        else:
            # Insert the new item into the cart
            result = await insert_to_cart(
                product_id=cart_item.product_id,
                quantity=cart_item.quantity,
                username=cart_item.username
            )
            return {"message": "Item added to cart successfully!", "item": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

## for call and show list of product in user cart
@router.get("/carts")
async def read_cart_items(username: str):
    cart_items = await get_cart_items_by_username(username)
    items_with_details = {}

    for item in cart_items:
        product = await get_product_by_id(item.product_id)
        if product:
            if item.product_id in items_with_details:
                items_with_details[item.product_id]['quantity'] += item.quantity
            else:
                items_with_details[item.product_id] = {
                    "id": item.id,
                    "product_name": product['name'],
                    "quantity": item.quantity,
                    "price": product['price'],
                    "created_at": item.created_at,
                    "product_image": product['image_url'],
                }

    return list(items_with_details.values())

## remove at cart.js page
@router.delete("/carts/{product_id}")
async def remove_cart_item(product_id: int, request: Request):
    username = request.query_params.get("username")
    if not username:
        raise HTTPException(status_code=422, detail="Username is required")

    deleted_item = await delete_cart_item(product_id, username)
    if not deleted_item:
        raise HTTPException(status_code=404, detail="Item not found in cart")

    return {"message": "Item removed from cart successfully!"}  # ส่งค่ากลับเมื่อมีการลบสำเร็จ

