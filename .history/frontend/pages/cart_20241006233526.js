import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, Card, CardMedia, CardContent } from '@mui/material';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

const Cart = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = async () => {
    const userId = 1; // Replace with actual user ID from your auth system
    try {
      const response = await fetch(`/api/cart/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <>
      <Navbar />
      <Box sx={{ padding: '20px' }}>
        <Typography variant="h4" gutterBottom>Your Shopping Cart</Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : cartItems.length === 0 ? (
          <Typography>Your cart is empty.</Typography>
        ) : (
          <Grid container spacing={2}>
            {cartItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.image_url}
                    alt={item.name}
                  />
                  <CardContent>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="body2">Price: ฿{item.price}</Typography>
                    <Typography variant="body2">Quantity: {item.quantity}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        <Typography variant="h5" sx={{ marginTop: '20px' }}>
          Total: ฿{calculateTotal()}
        </Typography>
        <Button variant="contained" color="primary" onClick={() => {/* Handle checkout logic */}}>
          Checkout
        </Button>
      </Box>
    </>
  );
};

export default Cart;
