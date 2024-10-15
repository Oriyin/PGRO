import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Grid,
  Avatar
} from '@mui/material';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');  // เรียก API ใหม่ที่แสดงผลทุกออเดอร์
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
    <Box sx={{ padding: '30px' }}>
      <Typography variant="h4" gutterBottom>
        All Orders
      </Typography>

      <Grid container spacing={3}>
        {orders.map(order => (
          <Grid item xs={12} key={order.id}>
            <Paper elevation={3} sx={{ padding: '20px', marginBottom: '20px' }}>
              <Typography variant="h6" gutterBottom>
                Order #{order.id} by {order.username}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Total Amount: ฿{order.total_amount}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Ordered on: {new Date(order.created_at).toLocaleDateString()}
              </Typography>

              <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                {order.items.map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper elevation={1} sx={{ padding: '10px', display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={item.image_url} 
                        alt={item.name} 
                        sx={{ width: 60, height: 60, marginRight: '10px' }} 
                      />
                      <Box>
                        <Typography variant="subtitle1">{item.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Quantity: {item.quantity}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Price: ฿{item.price} (Total: ฿{item.total_price})
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default OrderList;
