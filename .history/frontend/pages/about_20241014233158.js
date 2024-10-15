import React, { useState } from 'react';
import { Box, Button, Typography, Grid, TextField } from '@mui/material';
import Navbar from '../components/Navbar';

const AboutUs = () => {
    const [feedback, setFeedback] = useState(''); // เก็บค่าฟีดแบ็คจาก TextField
    const [feedbackSent, setFeedbackSent] = useState(false); // ตรวจสอบสถานะการส่งฟีดแบ็ค

    // ฟังก์ชันสำหรับส่งฟีดแบ็คไปยัง Backend
    const handleSubmitFeedback = async () => {
        try {
            const response = await fetch('http://localhost:8000/feedback/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ feedback_text: feedback }), 
});


            if (response.ok) {
                setFeedbackSent(true); // ตั้งค่าสถานะเมื่อส่งฟีดแบ็คสำเร็จ
                setFeedback(''); // เคลียร์ฟิลด์ฟีดแบ็ค
            } else {
                console.error('Failed to submit feedback');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

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
                        <img 
                            src="/aboutme.jpg" // เปลี่ยนเป็น path ของรูปภาพคุณ
                            alt="Your Image" 
                            style={{ 
                                width: '150px', 
                                height: '150px', 
                                borderRadius: '50%', 
                                objectFit: 'cover', 
                                marginBottom: '20px' 
                            }} 
                        />
                        <Typography variant="h5" gutterBottom style={{ color: '#1a237e', fontWeight: 'bold' }}>
                            This project made by 66011050!
                        </Typography>
                        <Typography variant="body1" color="textSecondary" style={{ fontSize: '20px', lineHeight: '1.6' }}>
                            Advanced Computer Programming Miniproject.
                        </Typography>
                        <Typography variant="body1" color="textSecondary" style={{ marginTop: '20px', fontSize: '18px', lineHeight: '1.6' }}>
                            RoboticsAI Engineering KMITL ._.
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
                            value={feedback} // ค่าฟีดแบ็คจาก useState
                            onChange={(e) => setFeedback(e.target.value)} // อัปเดตฟีดแบ็คเมื่อมีการเปลี่ยนแปลง
                        />
                        <Button 
                            variant="contained" 
                            color="primary" 
                            style={{ backgroundColor: '#1a237e', color: '#ffffff', fontWeight: 'bold' }}
                            onClick={handleSubmitFeedback} // เรียกใช้ฟังก์ชันเมื่อคลิกปุ่ม
                        >
                            Submit Feedback
                        </Button>
                        {feedbackSent && ( // แสดงข้อความเมื่อส่งฟีดแบ็คสำเร็จ
                            <Typography variant="body1" style={{ color: 'green', marginTop: '20px' }}>
                                Thank you for your feedback!
                            </Typography>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
};

export default AboutUs;
