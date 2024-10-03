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
    const [cartItems, setCartItems] = useState([]); // State for cart items
    const [loading, setLoading] = useState(true); // Loading state
    const [totalAmount, setTotalAmount] = useState(0); // Total amount
    const [error, setError] = useState(null); // Error message
    const username = localStorage.getItem('username'); // Get username from local storage

    const fetchCartItems = async () => {
        try {
            const response = await fetch(`/api/carts?username=${username}`);
            if (!response.ok) {
                throw new Error('Failed to fetch cart items');
            }
            const data = await response.json();
            setCartItems(data); // Set cart items to state
        } catch (error) {
            setError(error.message); // Set error message
        } finally {
            setLoading(false); // Set loading to false after fetch
        }
    };

    const calculateTotal = (items) => {
        const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setTotalAmount(total); // Calculate and set total amount
    };

    const handleEditQuantity = async (productId, newQuantity) => {
        console.log("Product ID:", productId); // Debugging line
        console.log("New Quantity:", newQuantity); // Debugging line

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
                throw new Error('Failed to update cart item quantity');
            }
    
            // Update state with new quantity
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.product_id === productId ? { ...item, quantity: newQuantity } : item
                )
            );
        } catch (error) {
            setError('Error updating quantity: ' + error.message); // Set error message
        }
    };

    const handleRemoveItem = async (productId) => {
        if (!productId) return; // Prevent removal if no product ID
    
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
    
            // Update state to remove the item from the UI
            setCartItems((prevItems) => prevItems.filter((item) => item.product_id !== productId));
        } catch (error) {
            setError('Error removing item: ' + error.message); // Set error message
            console.error(error);
        }
    };

    useEffect(() => {
        if (username) {
            fetchCartItems(); // Fetch cart items if username is available
        } else {
            setError('Username not found. Please log in again.'); // Error if no username
            setLoading(false);
        }
    }, [username]);

    useEffect(() => {
        calculateTotal(cartItems); // Calculate total whenever cart items change
    }, [cartItems]);

    return (
        <Box className={styles.container} sx={{ padding: '20px', height: '100vh', backgroundColor: '#f5f5f5' }}>
            <Navbar />
            <Box sx={{ overflowY: 'auto', flexGrow: 1, padding: '20px', marginTop: '80px' }}>
                <Card sx={{ width: '100%', maxWidth: '1200px', borderRadius: '8px', boxShadow: 3, margin: '0 auto' }}>
                    <CardHeader
                        title={`My Cart for ${username}`} // Header with username
                        titleTypographyProps={{ variant: 'h4', align: 'center', color: '#003366' }}
                        sx={{ backgroundColor: '#e0f7fa' }}
                    />
                    <CardContent>
                        {loading ? (
                            <Typography variant="h6" align="center">Loading...</Typography> // Loading state
                        ) : error ? (
                            <Typography variant="h6" align="center" color="error">{error}</Typography> // Error state
                        ) : cartItems.length === 0 ? (
                            <Typography variant="h6" align="center">Your cart is empty.</Typography> // Empty cart state
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
                                                    <Button variant="contained" onClick={() => handleEditQuantity(item.product_id, item.quantity + 1)} disabled={item.quantity >= item.stock}>+</Button>
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
                            Total Amount: ${totalAmount.toFixed(2)} {/* Display total amount */}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default MyCart;
