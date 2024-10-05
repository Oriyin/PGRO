import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Button,
    Typography,
    Grid,
} from '@mui/material';
import styles from '../styles/storebg.module.css'; // นำเข้าสไตล์
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
            setCartItems(data); // อัปเดต state ด้วยข้อมูลใหม่
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
        const total = cartItems.reduce((acc, item) => {
            const price = item.price || 0;
            const quantity = item.quantity || 0;
            return acc + (price * quantity);
        }, 0);
        setTotalAmount(total);
    };

    const handleEditQuantity = async (productId, newQuantity) => {
        // ตรวจสอบว่า newQuantity เป็นจำนวนเต็มและไม่น้อยกว่า 1
        if (!Number.isInteger(newQuantity) || newQuantity < 1) {
            setError('Quantity must be a valid integer and at least 1');
            return;
        }

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

            // อัปเดตสินค้าในตะกร้าใหม่หลังจากการตอบสนองสำเร็จ
            fetchCartItems(username); // เรียกใช้เพื่อโหลดข้อมูลใหม่จากฐานข้อมูล
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

            // อัปเดตสินค้าในตะกร้าใหม่หลังจากลบสินค้าแล้ว
            fetchCartItems(username);
        } catch (error) {
            setError('Error removing item: ' + error.message);
        }
    };

    const handleCheckout = async () => {
        const items = cartItems.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            username: username,  // เพิ่ม username เข้าไปในแต่ละสินค้า
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
                    <Grid container spacing={25} justifyContent="center">
                        {cartItems.map((item) => (
                            <Grid item xs={12} sm={6} md={3.5} key={item.product_id}>
                                <Card sx={{ width: '250px', height: '350px', padding: '10px', borderRadius: '8px', boxShadow: 1 }}>
                                    <CardContent>
                                        <img src={item.product_image} alt={item.product_name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                                        <Typography variant="h6">{item.product_name}</Typography>
                                        <Typography variant="body2">
                                            Quantity: {Number.isInteger(item.quantity) ? item.quantity : 0}  {/* ถ้า quantity ไม่เป็นตัวเลข ให้แสดง 0 */}
                                        </Typography>
                                        <Typography variant="body2">
                                            Price: ฿{(Number.isFinite(item.price) && Number.isInteger(item.quantity) ? (item.price * item.quantity).toFixed(2) : '0.00')} {/* ถ้า price หรือ quantity ไม่ถูกต้องให้แสดง 0 */}
                                        </Typography>
                                        <Box display="flex" justifyContent="space-between" mt={2}>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button 
                                                    variant="contained" 
                                                    onClick={() => handleEditQuantity(item.product_id, item.quantity + 1)} 
                                                    sx={{ backgroundColor: '#9c27b0', color: 'white' }} 
                                                >
                                                    +
                                                </Button>
                                                <Button 
                                                    variant="contained" 
                                                    onClick={() => handleEditQuantity(item.product_id, item.quantity > 1 ? item.quantity - 1 : 1)} 
                                                    sx={{ backgroundColor: '#9c27b0', color: 'white' }} 
                                                >
                                                    - 
                                                </Button>
                                            </Box>
                                            <Button 
                                                variant="outlined" 
                                                color="error" 
                                                onClick={() => handleRemoveItem(item.product_id)}
                                                sx={{ marginLeft: 2 }}
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
