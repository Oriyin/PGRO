import React from 'react';
import { Box, Button, Typography, Grid, TextField } from '@mui/material';
import Navbar from '../components/Navbar';

const AboutUs = () => {
    return (
        <div style={{ padding: '20px', backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
            <Navbar />
            <Typography variant="h4" align="center" gutterBottom style={{ marginTop: '80px', color: '#4a148c', fontWeight: 'bold' }}>
                About Us
            </Typography>
            <Grid container spacing={3} justifyContent="center">
                {/* About Section */}
                <Grid item xs={12} md={8}>
                    <Box 
                        border={1} 
                        borderColor="#4a148c" 
                        borderRadius="16px" 
                        padding={4} 
                        bgcolor="#ffffff" 
                        boxShadow={4} 
                        textAlign="center"
                    >
                        <Typography variant="h5" gutterBottom style={{ color: '#1a237e', fontWeight: 'bold' }}>
                            This project made by 66011050!
                        </Typography>
                        <Typography variant="body1" color="textSecondary" style={{ fontSize: '18px', lineHeight: '1.6' }}>
                            At our groceries, we are dedicated to offering the best selection of products to meet your needs.
                            Established in 2024, our mission is to provide high-quality products at competitive prices while delivering
                            exceptional customer service.
                        </Typography>
                        <Typography variant="body1" color="textSecondary" style={{ marginTop: '20px', fontSize: '18px', lineHeight: '1.6' }}>
                            Advanced Computer Programing
                        </Typography>
                    </Box>
                </Grid>

                {/* Contact Information */}
                <Grid item xs={12} md={8}>
                    <Box 
                        border={1} 
                        borderColor="#4a148c" 
                        borderRadius="16px" 
                        padding={4} 
                        bgcolor="#ffffff" 
                        boxShadow={4} 
                        textAlign="center" 
                        marginTop="20px"
                    >
                        <Typography variant="h5" gutterBottom style={{ color: '#1a237e', fontWeight: 'bold' }}>
                            Contact Us
                        </Typography>
                        <Grid container spacing={3} justifyContent="center">
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1" color="textSecondary" style={{ fontSize: '16px' }}>
                                    <strong>Email:</strong> 66011050@kmitl.ac.th
                                </Typography>
                                <Typography variant="body1" color="textSecondary" style={{ fontSize: '16px' }}>
                                    <strong>Phone:</strong> 123-456-789
                                </Typography>
                                <Typography variant="body1" color="textSecondary" style={{ fontSize: '16px' }}>
                                    <strong>Address:</strong> KMITL
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1" color="textSecondary" style={{ fontSize: '16px' }}>
                                    <strong>Facebook:</strong> <a href="https://www.facebook.com/KMITL.RoboticsAI/" target="_blank" rel="noopener noreferrer" style={{ color: '#1a237e' }}>facebook.com/RAI</a>
                                </Typography>
                                <Typography variant="body1" color="textSecondary" style={{ fontSize: '16px' }}>
                                    <strong>Instagram:</strong> <a href="https://www.instagram.com/raikmitl.official/" target="_blank" rel="noopener noreferrer" style={{ color: '#1a237e' }}>@raiKMITL</a>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>

                {/* Feedback Section */}
                <Grid item xs={12} md={8}>
                    <Box 
                        border={1} 
                        borderColor="#4a148c" 
                        borderRadius="16px" 
                        padding={4} 
                        bgcolor="#ffffff" 
                        boxShadow={4} 
                        textAlign="center" 
                        marginTop="20px"
                    >
                        <Typography variant="h5" gutterBottom style={{ color: '#1a237e', fontWeight: 'bold' }}>
                            We Value Your Feedback
                        </Typography>
                        <Typography variant="body1" color="textSecondary" style={{ fontSize: '16px', marginBottom: '20px' }}>
                            Let us know if you have any questions or suggestions. We’re here to help!
                        </Typography>
                        <TextField 
                            label="Your Feedback" 
                            multiline 
                            rows={4} 
                            variant="outlined" 
                            fullWidth 
                            style={{ marginBottom: '20px' }} 
                        />
                        <Button 
                            variant="contained" 
                            color="primary" 
                            style={{ backgroundColor: '#1a237e', color: '#ffffff', fontWeight: 'bold' }}
                        >
                            Submit Feedback
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
};

export default AboutUs;
