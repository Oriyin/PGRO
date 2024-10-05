from fastapi import APIRouter, HTTPException
from database import database

router = APIRouter()

@router.get("/sales-report")
async def get_sales_report():
    try:
        query = """
        SELECT p.name AS product_name, SUM(c.quantity) AS total_sales
        FROM orders o
        JOIN carts c ON o.username = c.username
        JOIN products p ON c.product_id = p.id
        GROUP BY p.id
        ORDER BY total_sales DESC
        """
        sales_report = await database.fetch_all(query=query)
        return [{"product_name": row["product_name"], "total_sales": row["total_sales"]} for row in sales_report]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
