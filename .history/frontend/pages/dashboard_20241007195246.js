import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Paper,
  Avatar,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { styled } from '@mui/system';

// Custom color palette
const colors = {
  lightPurple: '#D1C4E9',
  purple: '#7E57C2',
  lightBlue: '#B3E5FC',
  blue: '#42A5F5',
  green: '#66BB6A',
  white: '#FFFFFF',
};

// Styled components
const StyledCard = styled(Card)({
  backgroundColor: colors.lightPurple,
  color: colors.purple,
  borderRadius: '16px',
  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
});

const StyledAvatar = styled(Avatar)({
  backgroundColor: colors.purple,
  width: '50px',
  height: '50px',
  marginRight: '10px',
});

const Dashboard = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [recentLogins, setRecentLogins] = useState([]); // State for recent customer logins
  const [recentAdminLogins, setRecentAdminLogins] = useState([]); // State for recent admin logins
  const [recentOrders, setRecentOrders] = useState([]); // State for recent orders
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalSales = async () => {
      const response = await fetch('/api/sales/total');
      const data = await response.json();
      setTotalSales(data.totalSales);
    };

    const fetchTotalCustomers = async () => {
      const response = await fetch('/api/users/total');
      const data = await response.json();
      setTotalCustomers(data.totalUsers);
    };

    const fetchTotalAdmins = async () => {
      const response = await fetch('/api/admins/total');
      const data = await response.json();
      setTotalAdmins(data.totalAdmins);
    };

    const fetchTotalOrders = async () => {
      const response = await fetch('/api/sales/total-orders');
      const data = await response.json();
      setTotalOrders(data.totalOrders);
    };

    const fetchSalesData = async () => {
      const response = await fetch('/api/sales/data');
      const data = await response.json();
      setSalesData(data.salesData);
    };

    const fetchRecentLogins = async () => {
      const response = await fetch('/api/users/recent-logins?limit=3');
      const data = await response.json();
      setRecentLogins(Array.isArray(data) ? data : []); // Ensure it's an array
    };

    const fetchRecentAdminLogins = async () => {
      const response = await fetch('/api/admins/recent-logins?limit=3');
      const data = await response.json();
      setRecentAdminLogins(Array.isArray(data) ? data : []); // Ensure it's an array
    };

    const fetchRecentOrders = async () => {
      const response = await fetch('/api/sales/latest-orders?limit=5'); // Update this line to fetch recent orders
      const data = await response.json();
      setRecentOrders(Array.isArray(data.latestOrders) ? data.latestOrders : []); // Ensure it's an array
    };

    const fetchData = async () => {
      await fetchTotalSales();
      await fetchTotalCustomers();
      await fetchTotalAdmins();
      await fetchTotalOrders();
      await fetchSalesData();
      await fetchRecentLogins(); // Fetch recent customer logins
      await fetchRecentAdminLogins(); // Fetch recent admin logins
      await fetchRecentOrders(); // Fetch recent orders
      setLoading(false);
    };

    fetchData();
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
      <Typography variant="h4" gutterBottom color={colors.purple} fontWeight="bold">
        Sales Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Card: Total Sales */}
        <Grid item xs={12} md={3}>
          <StyledCard>
            <CardContent>
              <Box display="flex" alignItems="center">
                <StyledAvatar>💰</StyledAvatar>
                <Typography variant="h6">Total Sales</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                ฿{totalSales.toFixed(2)}
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Card: Total Customers */}
        <Grid item xs={12} md={3}>
          <StyledCard>
            <CardContent>
              <Box display="flex" alignItems="center">
                <StyledAvatar>👥</StyledAvatar>
                <Typography variant="h6">Total Customers</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {totalCustomers}
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Card: Total Admins */}
        <Grid item xs={12} md={3}>
          <StyledCard>
            <CardContent>
              <Box display="flex" alignItems="center">
                <StyledAvatar>🛠️</StyledAvatar>
                <Typography variant="h6">Total Admins</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {totalAdmins}
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Card: Total Orders */}
        <Grid item xs={12} md={3}>
          <StyledCard>
            <CardContent>
              <Box display="flex" alignItems="center">
                <StyledAvatar>🛒</StyledAvatar>
                <Typography variant="h6">Total Orders</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {totalOrders}
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: '20px', backgroundColor: colors.lightPurple }}>
            <Typography variant="h6" gutterBottom color={colors.purple}>
              Recent Orders
            </Typography>
            <Grid container spacing={2}>
              {recentOrders.map((order) => (
                <Grid item xs={12} md={4} key={order.id}>
                  <Card sx={{ backgroundColor: colors.lightBlue, padding: '20px' }}>
                    <Typography variant="h6" color={colors.purple}>
                      Order ID: {order.id}
                    </Typography>
                    <Typography variant="body1" color={colors.purple}>
                      Customer: {order.username} | Total: ฿{order.total_amount.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color={colors.purple}>
                      Created at: {new Date(order.created_at).toLocaleString('th-TH', {
                        timeZone: 'Asia/Bangkok',
                      })}
                    </Typography>
                    <Typography variant="body2" color={colors.purple}>
                      Items: {JSON.stringify(order.items)}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Other components for sales data, charts, etc. */}

      </Grid>
    </Box>
  );
};

export default Dashboard;
