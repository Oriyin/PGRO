import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
} from '@mui/material';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders');
            const data = await response.json();
            console.log(data); // Check the structure of data here
            setOrders(data); // Assuming data is a list of orders
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
        return <Typography>Loading...</Typography>; // Loading state
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Username</TableCell>
                        <TableCell>Total Amount</TableCell>
                        <TableCell>Order Date</TableCell>
                        <TableCell>Products</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Array.isArray(orders) && orders.length > 0 ? (
                        orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.username}</TableCell>
                                <TableCell>{order.total_amount.toFixed(2)}</TableCell>
                                <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                                <TableCell>
                                    {order.items.map((item, index) => (
                                        <div key={index}>
                                            {item.name} (x{item.quantity}) - ฿{(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    ))}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} style={{ textAlign: 'center' }}>
                                No orders found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default Orders;
