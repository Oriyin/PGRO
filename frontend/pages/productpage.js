<<<<<<< Updated upstream
=======
import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Grid, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';

const Store = () => {
    const [products, setProducts] = useState([]);
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const fetchProducts = async () => {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAddToCart = (product) => {
        setSelectedProduct(product);
        setOpen(true);
    };

    const handleConfirmAddToCart = () => {
        if (selectedProduct) {
            console.log(`Added ${quantity} of ${selectedProduct.name} to cart`);
            // Add logic here to actually add the product to the cart.
            setQuantity(1);
            setOpen(false);
            setSelectedProduct(null);
        }
    };

    const handleViewProduct = (id) => {
        router.push(`/product/${id}`);
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#E0F7FA' }}>
            <Navbar />
            <Typography variant="h4" align="center" gutterBottom style={{ marginTop: '80px', color: '#4a148c' }}>
                All Products
            </Typography>
            <Grid container spacing={3}>
                {products.length === 0 ? (
                    <Typography variant="h6" align="center">No products available.</Typography>
                ) : (
                    products.map((product) => (
                        <Grid item xs={12} sm={6} md={3} key={product.id}>
                            <Box border={1} borderColor="#004d40" borderRadius="8px" padding={2} textAlign="center" bgcolor="#ffffff" boxShadow={3}>
                                <img 
                                    src={product.image_url} 
                                    alt={product.name} 
                                    style={{ 
                                        width: '60%', 
                                        height: '200px', 
                                        objectFit: 'cover', 
                                        marginBottom: '10px' 
                                    }} 
                                />
                                <Typography variant="h6">{product.name}</Typography>
                                <Typography variant="body1" color="textSecondary">
                                    {`Price: ฿${product.price.toFixed(2)}`}
                                </Typography>
                                <Button variant="outlined" color="secondary" onClick={() => handleAddToCart(product)} style={{ marginTop: '10px', marginRight: '10px' }}>
                                    Add to cart
                                </Button>
                                <Button variant="outlined" color="secondary" onClick={() => handleViewProduct(product.id)} style={{ marginTop: '10px' }}>
                                    View Product
                                </Button>
                            </Box>
                        </Grid>
                    ))
                )}
            </Grid>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add to Cart</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Enter quantity for {selectedProduct?.name}:
                    </Typography>
                    <TextField 
                        autoFocus 
                        margin="dense" 
                        label="Quantity" 
                        type="number" 
                        fullWidth 
                        value={quantity} 
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        inputProps={{ min: 1 }} 
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">Cancel</Button>
                    <Button onClick={handleConfirmAddToCart} color="primary">Confirm</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Store;
>>>>>>> Stashed changes
