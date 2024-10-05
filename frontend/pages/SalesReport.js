import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Paper,
    Grid
} from '@mui/material';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from '@mui/x-charts';
import styles from '../styles/storebg.module.css';

const SalesReport = () => {
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSalesData();
    }, []);

    const fetchSalesData = async () => {
        try {
            const response = await fetch('/api/sales-report');
            if (!response.ok) {
                throw new Error('Failed to fetch sales data');
            }
            const data = await response.json();
            setSalesData(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    

    const chartData = salesData.map(item => ({
        name: item.product_name,
        totalSales: item.total_sales,
    }));

    return (
        <Box className={styles.container} sx={{ padding: '20px', height: '100vh', backgroundColor: '#E0F7FA' }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ marginTop: '20px', color: '#4a148c' }}>
                รายงานการขาย
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography color="error" align="center">{error}</Typography>
            ) : (
                <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ padding: '20px' }}>
                            <Typography variant="h6" align="center">Today Order</Typography>
                            <PieChart width={300} height={300}>
                                <Pie data={chartData} dataKey="totalSales" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#4a148c" />
                            </PieChart>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ padding: '20px' }}>
                            <Typography variant="h6" align="center">Weekly Order</Typography>
                            <PieChart width={300} height={300}>
                                <Pie data={chartData} dataKey="totalSales" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#e57373" />
                            </PieChart>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper elevation={3} sx={{ padding: '20px' }}>
                            <Typography variant="h6" align="center">Product Sales</Typography>
                            <BarChart width={600} height={300} data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="totalSales" fill="#4a148c" />
                            </BarChart>
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default SalesReport;
