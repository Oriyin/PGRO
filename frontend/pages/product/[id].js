// pages/product/[id].js

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, Button, TextField } from '@mui/material';

const ProductDetail = () => {
  const router = useRouter();
  const { id } = router.query; // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1); // State for quantity

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const response = await fetch(`/api/products/${id}`); // Change path to match your API
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
    // Implement your add to cart functionality here
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
        onChange={(e) => setQuantity(Number(e.target.value) || 1)} // Ensure quantity is a number
        sx={{ width: '60px', margin: '20px' }}
        inputProps={{ min: 1 }} // Prevent negative quantities
      />
      <Button variant="contained" color="primary" onClick={handleAddToCart}>
        Add to Cart
      </Button>
    </Box>
  );
};

export default ProductDetail;
