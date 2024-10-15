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
  Avatar
} from '@mui/material';
import AdminNavbar from '../components/AdminNavbar';

const colors = {
  lightPurple: '#D1C4E9',
  purple: '#7E57C2',
  darkPurple: '#5E35B1',
  lightBlue: '#B3E5FC',
  white: '#FFFFFF',
  grey: '#E0E0E0',
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');  // API to fetch order data
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
    <>
      <AdminNavbar />
      <Box sx={{ padding: '30px' }}>
        <Typography variant="h4" gutterBottom color={colors.purple} fontWeight="bold">
          All Orders
        </Typography>

        {/* Display orders in table format */}
        <TableContainer component={Paper} sx={{ backgroundColor: colors.lightPurple }}>
          <Table sx={{ minWidth: 650 }} aria-label="order table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: colors.darkPurple, fontWeight: 'bold' }}>Order ID</TableCell>
                <TableCell sx={{ color: colors.darkPurple, fontWeight: 'bold' }}>Username</TableCell>
                <TableCell sx={{ color: colors.darkPurple, fontWeight: 'bold' }}>Total Amount</TableCell>
                <TableCell sx={{ color: colors.darkPurple, fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ color: colors.darkPurple, fontWeight: 'bold' }}>Items</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: colors.lightBlue } }}>
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
                        <Typography variant="body2" color={colors.darkPurple}>
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
    </>
  );
};

export default OrderList;
