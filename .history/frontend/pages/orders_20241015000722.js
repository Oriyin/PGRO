import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Typography,
    CircularProgress,
} from '@mui/material'; // Ensure this import is correct

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders');
            const data = await response.json();
            setOrders(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Orders
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Total Amount</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Items</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.username}</TableCell>
                                <TableCell>฿{order.total_amount.toFixed(2)}</TableCell>
                                <TableCell>{new Date(order.created_at).toLocaleString('th-TH')}</TableCell>
                                <TableCell>
                                    {order.items ? (
                                        <ul>
                                            {JSON.parse(order.items).map((item, index) => (
                                                <li key={index}>
                                                    Product ID: {item.product_id} | Quantity: {item.quantity}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        "No items"
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Orders;
