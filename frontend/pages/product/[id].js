import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '../../styles/storebg.module.css'; // Adjust the path if necessary
import { Box, Button, Typography, Card, CardContent, CardMedia } from '@mui/material';
import { useRouter } from 'next/router';

const ProductPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

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

    const handleAddToCart = () => {
        if (product) {
            console.log(`Added ${quantity} of ${product.name} to cart`);
            // Implement your add to cart functionality here
        }
    };

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
                        <input
                            type="number"
                            value={quantity}
                            min="1"
                            max={product.quantity} // Ensure user can't select more than available stock
                            onChange={(e) => setQuantity(Math.max(1, Math.min(Number(e.target.value), product.quantity)))}
                            style={{ width: '60px', margin: '10px 0' }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                            <Button 
                                variant="contained" 
                                color="primary" 
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
        </>
    );
};

export default ProductPage;
