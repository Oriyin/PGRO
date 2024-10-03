import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '../../styles/storebg.module.css'; // Adjust the path if necessary
import { Box, Button, Typography, Card, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useRouter } from 'next/router';

const ProductPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch the product details based on the ID
    const fetchProduct = async () => {
        try {
            const response = await fetch(`/api/products/${id}`);
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
    };

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    // Open the dialog to add the product to the cart
    const handleAddToCart = () => {
        setOpen(true);
    };

    // Confirm adding the product to the cart
    const handleConfirmAddToCart = async () => {
        if (product) {
            const cartItem = {
                product_id: product.id,
                quantity: quantity,
                username: localStorage.getItem('username'), // Get username from local storage
            };

            console.log('Adding to cart:', cartItem);
            // Make a POST request to add the item to the cart
            try {
                const response = await fetch('/api/carts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(cartItem),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error adding to cart:', errorData.detail);
                    throw new Error('Failed to add product to cart');
                }

                const responseData = await response.json();
                console.log(responseData.message);
                setSuccessMessage(`Successfully added ${quantity} of ${product.name} to cart!`);

                // Reset quantity and close dialog
                setQuantity(1);
                setOpen(false);
                setError(null);
            } catch (error) {
                console.error('Error adding to cart:', error);
                setError('Failed to add to cart. Please try again.');
            }
        }
    };

    // Loading and product not found states
    if (loading) return <Typography>Loading...</Typography>;
    if (!product) return <Typography>Product not found.</Typography>;

    return (
        <>
            <Head>
                <title>{product.name}</title>
                <meta name="description" content={product.description || "Product details page."} />
            </Head>
            <Box
                className={styles.container}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: '#f5f5f5',
                }}
            >
                <Card sx={{ maxWidth: 400, padding: '20px', boxShadow: 3 }}>
                    <CardMedia
                        component="img"
                        height="200"
                        image={product.image_url}
                        alt={product.name}
                        sx={{ objectFit: 'contain' }}
                    />
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            {product.name}
                        </Typography>
                        <Typography variant="h6" color="textSecondary">
                            Price: ฿{product.price.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Stock: {product.quantity > 0 ? product.quantity : 'Unavailable'}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                            <Button 
                                variant="contained" 
                                style={{ backgroundColor: '#6a1b9a', color: '#fff' }} // Set the button color to purple
                                onClick={handleAddToCart}
                                disabled={product.quantity <= 0} // Disable button if out of stock
                            >
                                Add to Cart
                            </Button>
                            <Button variant="outlined" onClick={() => router.push('/productpage')}>
                                Back to Products
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            {/* Dialog for quantity selection */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add to Cart</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Enter quantity for {product.name}:
                    </Typography>
                    <TextField 
                        autoFocus 
                        margin="dense" 
                        label="Quantity" 
                        type="number" 
                        fullWidth 
                        value={quantity} 
                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                        inputProps={{ min: 1, max: product.quantity }} 
                    />
                    {error && <Typography color="error">{error}</Typography>}
                    {successMessage && <Typography color="primary">{successMessage}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">Cancel</Button>
                    <Button onClick={handleConfirmAddToCart} color="primary">Confirm</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ProductPage;
