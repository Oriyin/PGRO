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
import { styled } from '@mui/system';
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
const StyledCard = styled(Card)( {
  backgroundColor: colors.lightPurple,
  color: colors.purple,
  borderRadius: '16px',
  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
});

const StyledAvatar = styled(Avatar)( {
  backgroundColor: colors.purple,
  width: '50px',
  height: '50px',
  marginRight: '10px',
});

const PinkSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: pink[600],
    '&:hover': {
      backgroundColor: pink[600],
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

  // State to control visibility of each section
  const [showSales, setShowSales] = useState(true);
  const [showCustomers, setShowCustomers] = useState(true);
  const [showAdmins, setShowAdmins] = useState(true);
  const [showOrders, setShowOrders] = useState(true);
  const [showRecentLogins, setShowRecentLogins] = useState(true);
  const [showRecentAdminLogins, setShowRecentAdminLogins] = useState(true);
  const [showRecentOrders, setShowRecentOrders] = useState(true);

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
      <Grid container spacing={3}>
        {/* Card: Total Sales */}
        <Grid item xs={12} md={3}>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" color={colors.purple}>Total Sales</Typography>
            <PinkSwitch checked={showSales} onChange={() => setShowSales(!showSales)} />
          </Box>
          {showSales && (
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
          )}
        </Grid>

        {/* Card: Total Customers */}
        <Grid item xs={12} md={3}>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" color={colors.purple}>Total Customers</Typography>
            <PinkSwitch checked={showCustomers} onChange={() => setShowCustomers(!showCustomers)} />
          </Box>
          {showCustomers && (
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
          )}
        </Grid>

        {/* Card: Total Admins */}
        <Grid item xs={12} md={3}>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" color={colors.purple}>Total Admins</Typography>
            <PinkSwitch checked={showAdmins} onChange={() => setShowAdmins(!showAdmins)} />
          </Box>
          {showAdmins && (
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
          )}
        </Grid>

        {/* Card: Total Orders */}
        <Grid item xs={12} md={3}>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" color={colors.purple}>Total Orders</Typography>
            <PinkSwitch checked={showOrders} onChange={() => setShowOrders(!showOrders)} />
          </Box>
          {showOrders && (
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
          )}
        </Grid>

        {/* Recent Customer Logins */}
        <Grid item xs={12}>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" color={colors.purple}>Recent Customer Logins</Typography>
            <PinkSwitch checked={showRecentLogins} onChange={() => setShowRecentLogins(!showRecentLogins)} />
          </Box>
          {showRecentLogins && (
            <Paper elevation={3} sx={{ padding: '20px', backgroundColor: colors.lightPurple }}>
              <Grid container spacing={2}>
                {recentLogins.map((user) => (
                  <Grid item xs={12} md={4} key={user.user_id}>
                    <Card sx={{ backgroundColor: colors.lightBlue, padding: '20px' }}>
                      <Typography variant="h6" color={colors.purple}>
                        {user.username}
                      </Typography>
                      <Typography variant="body1" color={colors.purple}>
                        {user.email}
                      </Typography>
                      <Typography variant="body2" color={colors.purple}>
                        Last login: {new Date(user.last_login).toLocaleString('th-TH', {
                          timeZone: 'Asia/Bangkok',
                        })}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}
        </Grid>

        {/* Recent Admin Logins */}
        <Grid item xs={12}>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" color={colors.purple}>Recent Admin Logins</Typography>
            <PinkSwitch checked={showRecentAdminLogins} onChange={() => setShowRecentAdminLogins(!showRecentAdminLogins)} />
          </Box>
          {showRecentAdminLogins && (
            <Paper elevation={3} sx={{ padding: '20px', backgroundColor: colors.lightPurple }}>
              <Grid container spacing={2}>
                {recentAdminLogins.map((admin) => (
                  <Grid item xs={12} md={4} key={admin.admin_id}>
                    <Card sx={{ backgroundColor: colors.lightBlue, padding: '20px' }}>
                      <Typography variant="h6" color={colors.purple}>
                        {admin.adminusername}
                      </Typography>
                      <Typography variant="body1" color={colors.purple}>
                        {admin.adminemail}
                      </Typography>
                      <Typography variant="body2" color={colors.purple}>
                        Last login: {new Date(admin.last_login).toLocaleString('th-TH', {
                          timeZone: 'Asia/Bangkok',
                        })}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12}>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" color={colors.purple}>Recent Orders</Typography>
            <PinkSwitch checked={showRecentOrders} onChange={() => setShowRecentOrders(!showRecentOrders)} />
          </Box>
          {showRecentOrders && (
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
                        Customer: {order.username} | Total: ฿{Number(order.total_amount).toFixed(2)}
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
                              {item.name} (x{item.quantity}) - ฿{Number(item.total_price).toFixed(2)}
                            </Typography>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
