import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
} from '@mui/material';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    <Box sx={{ padding: '30px', backgroundColor: '#f7f9fc', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ color: '#003366', fontWeight: 'bold' }}>
        All Orders
      </Typography>

      <TableContainer component={Paper} elevation={3} sx={{ marginTop: '20px' }}>
        <Table sx={{ minWidth: 650 }} aria-label="order table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Order ID</strong></TableCell>
              <TableCell><strong>Username</strong></TableCell>
              <TableCell><strong>Total Amount</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Items</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.username}</TableCell>
                <TableCell>฿{order.total_amount}</TableCell>
                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  {order.items.map((item, index) => (
                    <Box key={index} display="flex" alignItems="center" sx={{ marginBottom: '8px' }}>
                      <Avatar 
                        src={item.image_url} 
                        alt={item.name} 
                        sx={{ width: 40, height: 40, marginRight: '10px' }} 
                      />
                      <Typography variant="body2" sx={{ color: '#003366' }}>
                        {item.name} x {item.quantity} @ ฿{item.price} (Total: ฿{item.total_price})
                      </Typography>
                    </Box>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrderList;
