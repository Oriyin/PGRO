import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import styles from '../styles/storebg.module.css';
import { Box, Typography, Button, Card, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useRouter } from 'next/router';

const Store = () => {
  const router = useRouter();
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRecommended, setShowRecommended] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const recommendedSectionRef = useRef(null);

  // Function to fetch recommended products
  const fetchRecommendedProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, 3);
      setRecommendedProducts(shuffled);
    } catch (error) {
      console.error('Error fetching recommended products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendedProducts();
  }, []);

  const handleShopNow = () => {
    setShowRecommended(true);
    if (recommendedSectionRef.current) {
      window.scrollTo({
        top: recommendedSectionRef.current.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  const handleCloseRecommended = () => {
    setShowRecommended(false);
  };

  const handleViewProduct = (product) => {
    router.push(`/product/${product.id}`);
  };

  const handleAddToCart = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleConfirmAddToCart = async () => {
    if (selectedProduct) {
      const cartItem = {
        product_id: selectedProduct.id, // Use product ID
        quantity: quantity,
        username: localStorage.getItem('username'),
      };

      console.log('Adding to cart:', cartItem);

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
        setSuccessMessage(`Successfully added ${quantity} of ${selectedProduct.name} to cart!`);

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

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Store</title>
      </Head>

      <Navbar />

      <Box
        className={styles.container}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: 'url("/welcome-image.jpg") no-repeat center center',
          backgroundSize: 'cover',
          textAlign: 'center',
          color: '#fff',
        }}
      >
        <Typography variant="h2">Welcome to Our Store!</Typography>
        <Box sx={{ margin: '20px 0' }}>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={handleShopNow} 
            sx={{ 
              margin: '0 10px', 
              padding: '15px 30px', 
              fontSize: '16px',
              borderColor: '#9c27b0', // Purple border
              color: '#9c27b0', // Purple text
              '&:hover': {
                borderColor: '#7b1fa2', // Darker purple on hover
                color: '#fff', // White text on hover
                backgroundColor: '#9c27b0', // Purple background on hover
              }
            }}
          >
            Shop Recommended Products
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={() => router.push('/productpage')} 
            sx={{ 
              margin: '0 10px', 
              padding: '15px 30px', 
              fontSize: '16px',
              borderColor: '#9c27b0', // Purple border
              color: '#9c27b0', // Purple text
              '&:hover': {
                borderColor: '#7b1fa2', // Darker purple on hover
                color: '#fff', // White text on hover
                backgroundColor: '#9c27b0', // Purple background on hover
              }
            }}
          >
            View All Products
          </Button>
        </Box>
      </Box>

      {/* Recommended Products Section */}
      {showRecommended && (
        <Box
          id="recommended-section"
          ref={recommendedSectionRef}
          sx={{
            padding: '20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'absolute',
            bottom: 0,
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          }}
        >
          <Button onClick={handleCloseRecommended} sx={{ position: 'absolute', top: '10px', right: '10px', color: '#9c27b0' }}>
            ✖️
          </Button>
          <Typography variant="h4" sx={{ marginBottom: '10px', color: '#9c27b0' }}>Recommended Products</Typography>
          <Box className={styles.recommendedProducts} sx={{ display: 'flex', overflowX: 'auto', justifyContent: 'center' }}>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : recommendedProducts.length > 0 ? (
              recommendedProducts.map((product, index) => (
                <Card key={index} sx={{ width: 300, margin: '0 10px', height: '300px' }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={product.image_url}
                    alt={product.name}
                    sx={{ objectFit: 'contain' }}
                  />
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Typography variant="h6" noWrap sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#9c27b0' }}>{product.name}</Typography>
                    <Typography>฿{product.price.toFixed(2)}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                      <Button 
                        variant="contained" 
                        sx={{ 
                          backgroundColor: '#9c27b0', // Purple background
                          color: '#fff', // White text
                          '&:hover': {
                            backgroundColor: '#7b1fa2', // Darker purple on hover
                          }
                        }} 
                        onClick={() => handleAddToCart(product)} 
                      >
                        Add to Cart
                      </Button>
                      <Button 
                        variant="outlined" 
                        sx={{ 
                          borderColor: '#9c27b0', // Purple border
                          color: '#9c27b0', // Purple text
                          '&:hover': {
                            borderColor: '#7b1fa2', // Darker purple on hover
                            color: '#fff', // White text on hover
                            backgroundColor: '#9c27b0', // Purple background on hover
                          }
                        }} 
                        onClick={() => handleViewProduct(product)} 
                      >
                        View Product
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography>No recommended products available.</Typography>
            )}
          </Box>
        </Box>
      )}

      {/* Dialog for quantity selection */}
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
            onChange={(e) => setQuantity(Math.max(1, Math.min(99, e.target.value)))}
          />
          {error && <Typography color="error">{error}</Typography>}
          {successMessage && <Typography color="primary">{successMessage}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handleConfirmAddToCart} color="primary">Add to Cart</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Store;
