import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Button,
    Typography,
    Grid,
} from '@mui/material';
import styles from '../styles/storebg.module.css'; // นำเข้าสติล
import Navbar from '../components/Navbar';

const MyCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalAmount, setTotalAmount] = useState(0);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
            fetchCartItems(storedUsername); // Fetch cart items right away
        } else {
            setError('Username not found. Please log in again.');
            setLoading(false);
        }
    }, []);

    const fetchCartItems = async (username) => {
        try {
            const response = await fetch(`/api/carts?username=${username}`);
            if (!response.ok) throw new Error('Failed to fetch cart items');
            const data = await response.json();
            setCartItems(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        calculateTotal();
    }, [cartItems]);

    const calculateTotal = () => {
        const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setTotalAmount(total);
    };

    const handleEditQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return; // Prevent negative quantities

        try {
            const response = await fetch(`/api/carts/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    product_id: productId,
                    quantity: newQuantity, 
                    username 
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const updatedItem = await response.json();
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.product_id === productId ? { ...item, quantity: updatedItem.quantity } : item
                )
            );
        } catch (error) {
            setError('Error updating quantity: ' + error.message);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            const response = await fetch(`/api/carts/${productId}?username=${username}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            setCartItems((prevItems) => prevItems.filter((item) => item.product_id !== productId));
        } catch (error) {
            setError('Error removing item: ' + error.message);
        }
    };

    const handleCheckout = async () => {
        const items = cartItems.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
        }));

        const orderData = {
            username: username,
            items: items,
            total_amount: totalAmount,
        };

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error('Failed to process checkout: ' + errorText);
            }

            // Clear the cart after successful checkout
            setCartItems([]);
            alert('Checkout successful!');
        } catch (error) {
            setError('Checkout failed: ' + error.message);
        }
    };

    return (
        <Box className={styles.container} sx={{ padding: '20px', height: '100vh', backgroundColor: '#E0F7FA' }}>
            <Navbar />
            <Typography variant="h4" align="center" gutterBottom style={{ marginTop: '80px', color: '#4a148c' }}>
                Shopping Cart
            </Typography>
            <Typography variant="h5" align="center" gutterBottom style={{ color: '#4a148c' }}>
                Owner: {username || 'Guest'}
            </Typography>
            <Box sx={{ overflowY: 'auto', flexGrow: 1, padding: '20px', marginTop: '20px' }}>
                {loading ? (
                    <Typography variant="h6" align="center">Loading...</Typography>
                ) : error ? (
                    <Typography variant="h6" align="center" color="error">{error}</Typography>
                ) : cartItems.length === 0 ? (
                    <Typography variant="h6" align="center">Your cart is empty.</Typography>
                ) : (
                    <Grid container spacing={2} justifyContent="center">
                        {cartItems.map((item) => (
                            <Grid item xs={12} sm={6} md={3} key={item.product_id}>
                                <Card sx={{ width: '250px', height: '350px', padding: '10px', borderRadius: '8px', boxShadow: 1 }}>
                                    <CardContent>
                                        <img src={item.product_image} alt={item.product_name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                                        <Typography variant="h6">{item.product_name}</Typography>
                                        <Typography variant="body2">Quantity: {item.quantity}</Typography>
                                        <Typography variant="body2">Price: ฿{(item.price * item.quantity).toFixed(2)}</Typography>
                                        <Box display="flex" justifyContent="space-between" mt={2}>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button 
                                                    variant="contained" 
                                                    onClick={() => handleEditQuantity(item.product_id, item.quantity + 1)} 
                                                    disabled={item.quantity >= item.stock}
                                                    sx={{ backgroundColor: '#9c27b0', color: 'white' }} // สีม่วง
                                                >
                                                    +
                                                </Button>
                                                <Button 
                                                    variant="contained" 
                                                    onClick={() => handleEditQuantity(item.product_id, item.quantity - 1)} 
                                                    disabled={item.quantity <= 1}
                                                    sx={{ backgroundColor: '#9c27b0', color: 'white' }} // สีม่วง
                                                >
                                                    - 
                                                </Button>
                                            </Box>
                                            <Button 
                                                variant="outlined" 
                                                color="error" 
                                                onClick={() => handleRemoveItem(item.product_id)}
                                                sx={{ marginLeft: 2 }} // เพิ่มระยะห่างจากปุ่ม "-"
                                            >
                                                Remove
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))} 
                    </Grid>
                )}
            </Box>
            {cartItems.length > 0 && (
                <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Typography variant="h5" style={{ marginRight: '20px', color: '#003366' }}>
                        Total Amount: ฿{totalAmount.toFixed(2)} {/* Changed to display Baht */}
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleCheckout}
                        sx={{ marginLeft: 2 }} // Add margin for spacing
                    >
                        Checkout
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default MyCart;
