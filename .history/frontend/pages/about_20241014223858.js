import React from 'react';
import { Box, Button, Typography, Grid, TextField } from '@mui/material';
import Navbar from '../components/Navbar';

const AboutUs = () => {
    return (
        <div style={{ padding: '20px', backgroundColor: '#E0F7FA' }}>
            <Navbar />
            <Typography variant="h4" align="center" gutterBottom style={{ marginTop: '80px', color: '#4a148c' }}>
                About Us
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box border={1} borderColor="#004d40" borderRadius="8px" padding={2} bgcolor="#ffffff" boxShadow={3} textAlign="center">
                        <Typography variant="h6" gutterBottom>
                            This project make by Yin!
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            At our groceries, we are dedicated to offering the best selection of products to meet your needs.
                            Established in [Year], our mission is to provide high-quality products at competitive prices while delivering
                            exceptional customer service.
                        </Typography>
                        <Typography variant="body1" color="textSecondary" style={{ marginTop: '20px' }}>
                            We believe in the power of innovation and are committed to sustainability. Whether you're looking for trendy
                            items or everyday essentials, we are here to help you find the perfect product.
                        </Typography>
                    </Box>
                </Grid>

                {/* Contact Information */}
                <Grid item xs={12}>
                    <Box border={1} borderColor="#004d40" borderRadius="8px" padding={2} bgcolor="#ffffff" boxShadow={3} textAlign="center">
                        <Typography variant="h6" gutterBottom>
                            Contact Us
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1" color="textSecondary">
                                    <strong>Email:</strong> contact@yourstore.com
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    <strong>Phone:</strong> (123) 456-7890
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    <strong>Address:</strong> 1234 Your Street, Your City, Your Country
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1" color="textSecondary">
                                    <strong>Facebook:</strong> <a href="https://www.facebook.com/yourstore" target="_blank" rel="noopener noreferrer">facebook.com/yourstore</a>
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    <strong>Instagram:</strong> <a href="https://www.instagram.com/yourstore" target="_blank" rel="noopener noreferrer">@yourstore</a>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>

                {/* Feedback Section */}
                <Grid item xs={12}>
                    <Box border={1} borderColor="#004d40" borderRadius="8px" padding={2} bgcolor="#ffffff" boxShadow={3} textAlign="center">
                        <Typography variant="h6" gutterBottom>
                            We Value Your Feedback
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            Let us know if you have any questions or suggestions. We’re here to help!
                        </Typography>
                        <TextField 
                            label="Your Feedback" 
                            multiline 
                            rows={4} 
                            variant="outlined" 
                            fullWidth 
                            style={{ marginTop: '10px' }} 
                        />
                        <Button variant="contained" color="primary" style={{ marginTop: '10px' }}>
                            Submit Feedback
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
};

export default AboutUs;
