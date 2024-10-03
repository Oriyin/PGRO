import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Button,
    Typography,
    Grid,
} from '@mui/material';
import styles from '../styles/storebg.module.css';

const MyCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalAmount, setTotalAmount] = useState(0);
    const [error, setError] = useState(null);
    const username = localStorage.getItem('username');

    // Fetch cart items from the backend
    const fetchCartItems = async () => {
        try {
            const response = await fetch(`/api/carts?username=${username}`);
            if (!response.ok) {
                throw new Error('Failed to fetch cart items');
            }
            const data = await response.json();
            setCartItems(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Calculate the total amount
    const calculateTotal = (items) => {
        const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setTotalAmount(total);
    };

    const handleEditQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            // Send request to update item quantity in the database
            const response = await fetch(`/api/carts/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: newQuantity, username }),
            });

            if (!response.ok) {
                throw new Error('Failed to update cart item quantity');
            }

            // Update the quantity in the UI
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.product_id === productId ? { ...item, quantity: newQuantity } : item
                )
            );
        } catch (error) {
            setError('Error updating quantity: ' + error.message);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            // Send request to remove item from cart in the database
            const response = await fetch(`/api/carts/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            });

            if (!response.ok) {
                throw new Error('Failed to remove item from cart');
            }

            // Remove item from the UI
            setCartItems((prevItems) => prevItems.filter((item) => item.product_id !== productId));
        } catch (error) {
            setError('Error removing item: ' + error.message);
        }
    };

    useEffect(() => {
        if (username) {
            fetchCartItems();
        } else {
            setError('Username not found. Please log in again.');
            setLoading(false);
        }
    }, [username]);

    // Recalculate the total amount every time cartItems change
    useEffect(() => {
        calculateTotal(cartItems);
    }, [cartItems]);

    return (
        <Box className={styles.container} sx={{ padding: '20px', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
            <Card sx={{ width: '100%', maxWidth: '100%', borderRadius: '8px', boxShadow: 3, height: '90vh', overflowY: 'auto' }}>
                <CardHeader
                    title={`My Cart for ${username}`}
                    titleTypographyProps={{ variant: 'h4', align: 'center', color: '#003366' }}
                    sx={{ backgroundColor: '#e0f7fa' }}
                />
                <CardContent>
                    {loading ? (
                        <Typography variant="h6" align="center">Loading...</Typography>
                    ) : error ? (
                        <Typography variant="h6" align="center" color="error">{error}</Typography>
                    ) : cartItems.length === 0 ? (
                        <Typography variant="h6" align="center">Your cart is empty.</Typography>
                    ) : (
                        <Grid container spacing={2} justifyContent="center">
                            {cartItems.map((item) => (
                                <Grid item xs={12} sm={6} md={4} key={item.product_id}>
                                    <Card sx={{ padding: '10px', textAlign: 'center', borderRadius: '8px', boxShadow: 1 }}>
                                        <CardContent>
                                            <img src={item.product_image} alt={item.product_name} style={{ width: '50%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                                            <Typography variant="h6">{item.product_name}</Typography>
                                            <Typography variant="body2">Quantity: {item.quantity}</Typography>
                                            <Typography variant="body2">Price: ${(item.price * item.quantity).toFixed(2)}</Typography>
                                            <Box display="flex" justifyContent="space-between" mt={1}>
                                                <Button variant="contained" onClick={() => handleEditQuantity(item.product_id, item.quantity + 1)}>+</Button>
                                                <Button variant="contained" onClick={() => handleEditQuantity(item.product_id, item.quantity - 1)} disabled={item.quantity <= 1}>-</Button>
                                                <Button variant="outlined" color="error" onClick={() => handleRemoveItem(item.product_id)}>Remove</Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </CardContent>
            </Card>
            {cartItems.length > 0 && (
                <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Typography variant="h5" style={{ marginRight: '20px', color: '#003366' }}>
                        Total Amount: ${totalAmount.toFixed(2)}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default MyCart;
