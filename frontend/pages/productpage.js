// pages/product/[id].js

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, Button, TextField } from '@mui/material';

const ProductDetail = () => {
  const router = useRouter();
  const { id } = router.query; // รับ id จาก URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1); // สถานะสำหรับจำนวนสินค้า

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const response = await fetch(`/api/products/${id}`); // เปลี่ยนพาธให้ตรงกับ API ของคุณ
          if (!response.ok) {
            throw new Error('Failed to fetch product');
          }
          const data = await response.json();
          setProduct(data);
        } catch (error) {
          console.error('Error fetching product:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    console.log('Added to cart:', { ...product, quantity });
    // เพิ่มฟังก์ชันการเพิ่มสินค้าลงในรถเข็นที่นี่
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!product) return <Typography>Product not found.</Typography>;

  return (
    <Box sx={{ padding: '20px', textAlign: 'center' }}>
      <img src={product.image_url} alt={product.name} style={{ width: '300px', height: 'auto' }} />
      <Typography variant="h4" sx={{ margin: '20px 0' }}>{product.name}</Typography>
      <Typography variant="body1" sx={{ marginBottom: '20px' }}>{product.description}</Typography>
      <Typography variant="h6">${product.price}</Typography>

      <TextField
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        sx={{ width: '60px', margin: '20px' }}
        inputProps={{ min: 1 }}
      />
      <Button variant="contained" color="primary" onClick={handleAddToCart}>
        Add to Cart
      </Button>
    </Box>
  );
};

export default ProductDetail;
