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

const colors = {
  lightPurple: '#D1C4E9',
  purple: '#7E57C2',
  white: '#FFFFFF',
  grey: '#F5F5F5',
  darkGrey: '#424242',
  lightBlue: '#E3F2FD',
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');  // API ที่ดึงข้อมูลออเดอร์ทั้งหมด
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
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor={colors.lightBlue}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '30px', backgroundColor: colors.lightBlue, minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ color: colors.purple, fontWeight: 'bold' }}>
        All Orders
      </Typography>

      {/* แสดงข้อมูลในรูปแบบตาราง */}
      <TableContainer component={Paper} sx={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', borderRadius: '12px' }}>
        <Table sx={{ minWidth: 650, backgroundColor: colors.white }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: colors.purple }}>
              <TableCell sx={{ color: colors.white, fontWeight: 'bold' }}>Order ID</TableCell>
              <TableCell sx={{ color: colors.white, fontWeight: 'bold' }}>Username</TableCell>
              <TableCell sx={{ color: colors.white, fontWeight: 'bold' }}>Total Amount</TableCell>
              <TableCell sx={{ color: colors.white, fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ color: colors.white, fontWeight: 'bold' }}>Items</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow 
                key={order.id}
                sx={{
                  '&:nth-of-type(odd)': { backgroundColor: colors.lightPurple },
                  '&:hover': { backgroundColor: colors.grey, cursor: 'pointer' }
                }}
              >
                <TableCell sx={{ color: colors.darkGrey }}>{order.id}</TableCell>
                <TableCell sx={{ color: colors.darkGrey }}>{order.username}</TableCell>
                <TableCell sx={{ color: colors.darkGrey }}>฿{order.total_amount.toFixed(2)}</TableCell>
                <TableCell sx={{ color: colors.darkGrey }}>
                  {new Date(order.created_at).toLocaleDateString('th-TH')}
                </TableCell>
                <TableCell>
                  {order.items.map((item, index) => (
                    <Box key={index} display="flex" alignItems="center" sx={{ marginBottom: '8px' }}>
                      <Avatar 
                        src={item.image_url} 
                        alt={item.name} 
                        sx={{ width: 40, height: 40, marginRight: '10px', border: `2px solid ${colors.purple}` }} 
                      />
                      <Typography variant="body2" sx={{ color: colors.darkGrey }}>
                        {item.name} x {item.quantity} @ ฿{item.price.toFixed(2)} (Total: ฿{item.total_price.toFixed(2)})
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
