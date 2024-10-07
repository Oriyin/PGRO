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
import { styled, alpha } from '@mui/system';
import { pink } from '@mui/material/colors';

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

const Dashboard = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [recentLogins, setRecentLogins] = useState([]);
  const [recentAdminLogins, setRecentAdminLogins] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for controlling visibility with Switch
  const [showSales, setShowSales] = useState(true);
  const [showCustomers, setShowCustomers] = useState(true);
  const [showOrders, setShowOrders] = useState(true);
  const [showAdmins, setShowAdmins] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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
        setRecentLogins(Array.isArray(data) ? data : []);
      };

      const fetchRecentAdminLogins = async () => {
        const response = await fetch('/api/admins/recent-logins?limit=3');
        const data = await response.json();
        setRecentAdminLogins(Array.isArray(data) ? data : []);
      };

      const fetchRecentOrders = async () => {
        const response = await fetch('/api/orders/latest?limit=5');
        const data = await response.json();
        setRecentOrders(Array.isArray(data) ? data : []);
      };

      await fetchTotalSales();
      await fetchTotalCustomers();
      await fetchTotalAdmins();
      await fetchTotalOrders();
      await fetchSalesData();
      await fetchRecentLogins();
      await fetchRecentAdminLogins();
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

      {/* Switches for toggling visibility */}
      <Box mb={3}>
        <Typography variant="h6" color={colors.purple}>Toggle Data Visibility</Typography>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="body1" color={colors.purple}>Show Sales Data</Typography>
          <PinkSwitch checked={showSales} onChange={() => setShowSales(!showSales)} />
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="body1" color={colors.purple}>Show Customers Data</Typography>
          <PinkSwitch checked={showCustomers} onChange={() => setShowCustomers(!showCustomers)} />
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="body1" color={colors.purple}>Show Orders Data</Typography>
          <PinkSwitch checked={showOrders} onChange={() => setShowOrders(!showOrders)} />
        </Box>
        <Box display="flex" alignItems="center">
          <Typography variant="body1" color={colors.purple}>Show Admins Data</Typography>
          <PinkSwitch checked={showAdmins} onChange={() => setShowAdmins(!showAdmins)} />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Conditional rendering based on Switches */}
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

        {showOrders && (
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
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;
