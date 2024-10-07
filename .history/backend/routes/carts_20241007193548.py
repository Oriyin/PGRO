from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from database import *  # Ensure your database functions are correctly imported
from datetime import datetime
import pytz  # To handle timezones
from database import *
router = APIRouter()

class CartItem(BaseModel):
    product_id: int
    quantity: int
    username: str

# New model for the Order
class Order(BaseModel):
    username: str
    items: list[CartItem]
    total_amount: float

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
    items_with_details = []

    for item in cart_items:
        product = await get_product_by_id(item.product_id)  # ต้องแน่ใจว่ามีการดึง product_id
        if product:
            items_with_details.append({
                "product_id": item.product_id,  # ตรวจสอบให้แน่ใจว่าได้เพิ่ม product_id
                "id": item.id,
                "product_name": product['name'],
                "quantity": item.quantity,
                "price": product['price'],
                "created_at": item.created_at,
                "product_image": product['image_url'],
            })

    return items_with_details


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

@router.put("/carts/{product_id}")
async def update_cart_item(product_id: int, cart_item: CartItem):
    username = cart_item.username
    quantity = cart_item.quantity
    
    # ตรวจสอบว่าค่า quantity ต้องไม่น้อยกว่า 1
    if quantity < 1:
        raise HTTPException(status_code=400, detail="Quantity must be at least 1")

    # อัพเดตสินค้าในตะกร้า
    updated_item = await update_cart_quantity(product_id, quantity, username)
    
    if not updated_item:
        raise HTTPException(status_code=404, detail="Item not found in cart")

    return {"message": "Cart item updated successfully!", "item": updated_item}


## New endpoint for checking out
@router.post("/checkout")
async def checkout(order: Order):
    # Validate the order and process it
    if not order.username or not order.items:
        raise HTTPException(status_code=400, detail="Invalid order data")

    # Prepare the items as a JSON string
    items_json = json.dumps([{"product_id": item.product_id, "quantity": item.quantity} for item in order.items])

    # Get the current time in Thailand's timezone
    tz = pytz.timezone('Asia/Bangkok')
    current_time = datetime.now(tz)

    # Create the order, inserting items as JSON
    query = """
    INSERT INTO orders (username, total_amount, items, created_at)
    VALUES (:username, :total_amount, :items, :created_at)
    RETURNING id
    """
    total_amount = order.total_amount
    order_id = await database.execute(query, values={
        "username": order.username, 
        "total_amount": total_amount,
        "items": items_json,  # Insert items as a JSON string
        "created_at": current_time  # Save the current time in Thailand timezone
    })

    # Update product quantities and remove items from the cart
    for item in order.items:
        product_id = item.product_id
        quantity = item.quantity

        # Update the product stock
        product_query = """
        UPDATE products
        SET quantity = quantity - :quantity
        WHERE id = :product_id
        """
        await database.execute(product_query, values={"product_id": product_id, "quantity": quantity})

        # Remove the item from the user's cart
        await delete_cart_item(product_id, order.username)

    return {"message": "Order placed successfully!", "order_id": order_id}