from fastapi import APIRouter, HTTPException
from database import *

router = APIRouter()

@router.get("/products")
async def read_products():
    products = await get_products()
    return products

@router.post("/products")
async def create_product(product: dict):
    new_product = await insert_product(
        name=product['name'],
        price=product['price'],
        quantity=product['quantity'],
        description=product['description'],
        image_url=product['image_url']
    )
    return new_product

@router.put("/products/{product_id}")
async def update_product_endpoint(product_id: int, product: dict):
    # ตรวจสอบให้แน่ใจว่า quantity ไม่น้อยกว่า 0
    quantity = max(product['quantity'], 0)

    updated_product = await update_product(
        product_id,
        name=product['name'],
        price=product['price'],
        quantity=quantity,  # อัปเดตให้เป็น 0 ถ้า quantity ติดลบ
        description=product['description'],
        image_url=product['image_url']
    )
    
    if not updated_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return updated_product


@router.delete("/products/{product_id}")
async def delete_product_endpoint(product_id: int):
    deleted_product = await delete_product(product_id)
    return {"message": "Product deleted", "product": deleted_product}

@router.get("/products/{product_id}")
async def read_product(product_id: int):
    product = await get_product_by_id(product_id)
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # แปลง product เป็น dict ที่สามารถแก้ไขได้
    product_dict = dict(product)
    
    # ตรวจสอบสถานะสินค้า
    if product_dict['quantity'] == 0:
        product_dict['status'] = "Out of Stock"
    else:
        product_dict['status'] = "In Stock"
    
    return product_dict
