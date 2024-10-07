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
import Navbar from '../components/Navbar';

const MyCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalAmount, setTotalAmount] = useState(0);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState(null); // Initialize username state

    useEffect(() => {
        // This code runs only on the client side
        if (typeof window !== 'undefined') {
            const storedUsername = localStorage.getItem('username');
            if (storedUsername) {
                setUsername(storedUsername);
            } else {
                setError('Username not found. Please log in again.');
                setLoading(false);
            }
        }
    }, []); // Empty dependency array ensures this runs once after the component mounts

    useEffect(() => {
        if (username) {
            fetchCartItems();
        }
    }, [username]); // Fetch cart items when username is set

    const fetchCartItems = async () => {
        if (!username) return; // Don't fetch if no username
        
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

    const calculateTotal = (items) => {
        const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
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
                body: JSON.stringify({ quantity: newQuantity, username }),
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }
            
            const updatedItem = await response.json();
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.product_id === productId ? { ...item, quantity: updatedItem.item.quantity } : item
                )
            );
        } catch (error) {
            setError('Error updating quantity: ' + error.message);
        }
    };

    const handleRemoveItem = async (productId) => {
        console.log('Attempting to remove item with product ID:', productId);
        console.log('Current username:', username); // Debug line
    
        if (!productId || !username) return; // Prevent removal if no product ID or username
    
        try {
            const response = await fetch(`/api/carts/${productId}?username=${username}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            console.log('Response status:', response.status); // ตรวจสอบสถานะคำขอ
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText); // ดูข้อความผิดพลาด
                throw new Error(errorText);
            }
    
            // Update state to remove the item from the UI
            setCartItems((prevItems) => prevItems.filter((item) => item.product_id !== productId));
        } catch (error) {
            setError('Error removing item: ' + error.message);
            console.error(error);
        }
    };
    
    
    useEffect(() => {
        calculateTotal(cartItems);
    }, [cartItems]);

    return (
        <Box className={styles.container} sx={{ padding: '20px', height: '100vh', backgroundColor: '#f5f5f5' }}>
            <Navbar />
            <Box sx={{ overflowY: 'auto', flexGrow: 1, padding: '20px', marginTop: '80px' }}>
                <Card sx={{ width: '100%', maxWidth: '1200px', borderRadius: '8px', boxShadow: 3, margin: '0 auto' }}>
                    <CardHeader
                        title={`My Cart for ${username || 'Guest'}`}
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
                                    <Grid item xs={12} sm={6} md={3} key={item.product_id}>
                                        <Card sx={{ padding: '10px', textAlign: 'center', borderRadius: '8px', boxShadow: 1 }}>
                                            <CardContent>
                                                <img src={item.product_image} alt={item.product_name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                                                <Typography variant="h6">{item.product_name}</Typography>
                                                <Typography variant="body2">Quantity: {item.quantity}</Typography>
                                                <Typography variant="body2">Price: ${(item.price * item.quantity).toFixed(2)}</Typography>
                                                <Box display="flex" justifyContent="space-between" mt={1}>
                                                    <Button 
                                                        variant="contained" 
                                                        onClick={() => handleEditQuantity(item.product_id, item.quantity + 1)} 
                                                        disabled={item.quantity >= item.stock}
                                                    >
                                                        +
                                                    </Button>
                                                    <Button 
                                                        variant="contained" 
                                                        onClick={() => handleEditQuantity(item.product_id, item.quantity - 1)} 
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        -
                                                    </Button>
                                                    <Button 
                                                        variant="outlined" 
                                                        color="error" 
                                                        onClick={() => handleRemoveItem(item.product_id)}
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
        </Box>
    );
};

export default MyCart;
