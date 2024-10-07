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
  Switch,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { pink } from '@mui/material/colors';
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

// Custom switch for pink color
const PinkSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: pink[600],
    '&:hover': {
      backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: pink[600],
  },
}));

const label = { inputProps: { 'aria-label': 'Dashboard Visibility Toggle' } };

const Dashboard = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for toggling sections visibility
  const [showOrders, setShowOrders] = useState(true);
  const [showSales, setShowSales] = useState(true);
  const [showCustomers, setShowCustomers] = useState(true);
  const [showAdmins, setShowAdmins] = useState(true);

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

    const fetchRecentOrders = async () => {
      const response = await fetch('/api/orders/latest?limit=5');
      const data = await response.json();
      setRecentOrders(Array.isArray(data) ? data : []);
    };

    const fetchData = async () => {
      await fetchTotalSales();
      await fetchTotalCustomers();
      await fetchTotalAdmins();
      await fetchTotalOrders();
      await fetchSalesData();
      await fetchRecentOrders();
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

      {/* Switches to toggle visibility */}
      <Box sx={{ marginBottom: '20px' }}>
        <Typography variant="h6">Toggle Sections</Typography>
        <Box>
          <Switch {...label} checked={showOrders} onChange={() => setShowOrders(!showOrders)} />
          <Typography display="inline">Show Orders</Typography>
        </Box>
        <Box>
          <Switch {...label} checked={showSales} onChange={() => setShowSales(!showSales)} />
          <Typography display="inline">Show Sales</Typography>
        </Box>
        <Box>
          <Switch {...label} checked={showCustomers} onChange={() => setShowCustomers(!showCustomers)} />
          <Typography display="inline">Show Customers</Typography>
        </Box>
        <Box>
          <PinkSwitch {...label} checked={showAdmins} onChange={() => setShowAdmins(!showAdmins)} />
          <Typography display="inline">Show Admins</Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Conditionally render Total Sales */}
        {showSales && (
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
        )}

        {/* Conditionally render Total Customers */}
        {showCustomers && (
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
        )}

        {/* Conditionally render Total Admins */}
        {showAdmins && (
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
        )}

        {/* Conditionally render Recent Orders */}
        {showOrders && (
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
                        Items:
                      </Typography>
                      <ul>
                        {order.items.map((item, index) => (
                          <li key={index}>
                            <Typography variant="body2" color={colors.purple}>
                              {item.name} (x{item.quantity}) - ฿{item.total_price.toFixed(2)}
                            </Typography>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;
