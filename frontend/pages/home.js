import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import styles from '../styles/storebg.module.css';
import { Box, Typography, Button, Card, CardContent, CardMedia } from '@mui/material';

const Store = () => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRecommended, setShowRecommended] = useState(false);
  const recommendedSectionRef = useRef(null); // Create a ref for the recommended section

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
    setShowRecommended(true); // Set state to show products
    // Scroll to the recommended section using ref
    if (recommendedSectionRef.current) {
      window.scrollTo({
        top: recommendedSectionRef.current.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  const handleAddToCart = (product) => {
    // Implement add to cart functionality here
    console.log('Added to cart:', product);
  };

  const handleCloseRecommended = () => {
    setShowRecommended(false); // Close the recommended products section
  };

  const handleViewProduct = (product) => {
    // Redirect to the product details page
    window.location.href = `/product/${product.id}`; // Assuming product has an id field
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
            sx={{ margin: '0 10px', padding: '15px 30px', fontSize: '16px' }}
          >
            Shop Recommended Products
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={() => window.location.href = '/productpage'} 
            sx={{ margin: '0 10px', padding: '15px 30px', fontSize: '16px' }}
          >
            View All Products
          </Button>
        </Box>
      </Box>

      {/* Recommended Products Section */}
      {showRecommended && (
        <Box
          id="recommended-section"
          ref={recommendedSectionRef} // Assign the ref here
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
          <Button onClick={handleCloseRecommended} sx={{ position: 'absolute', top: '10px', right: '10px' }}>
            ✖️
          </Button>
          <Typography variant="h4" sx={{ marginBottom: '10px' }}>Recommended Products</Typography>
          <Box className={styles.recommendedProducts} sx={{ display: 'flex', overflowX: 'auto', justifyContent: 'center' }}>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : recommendedProducts.length > 0 ? (
              recommendedProducts.map((product, index) => (
                <Card key={index} sx={{ width: 300, margin: '0 10px', height: '300px' }}> {/* ปรับขนาดการ์ด */}
                  <CardMedia
                    component="img"
                    height="140"
                    image={product.image_url}
                    alt={product.name}
                    sx={{ objectFit: 'contain' }} // ทำให้ภาพไม่ยืด
                  />
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Typography variant="h6" noWrap sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</Typography> {/* แสดงข้อความในบรรทัดเดียว */}
                    <Typography>${product.price}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => handleAddToCart(product)} 
                        sx={{ marginRight: '10px' }}
                      >
                        Add to Cart
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="secondary" 
                        onClick={() => handleViewProduct(product)} // Call the view product function
                      >
                        View
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography>No recommended products available.</Typography>
            )}
          </Box>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={() => window.location.href = '/productpage'} 
            sx={{ marginTop: '20px', padding: '10px 20px' }}
          >
            View All Products
          </Button>
        </Box>
      )}
    </>
  );
};

export default Store;
