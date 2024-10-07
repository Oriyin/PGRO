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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemText,
  Button,
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
  lightPurple: '#D1C4E9', // สีม่วงอ่อน
  purple: '#7E57C2', // สีม่วงเข้ม
  lightBlue: '#B3E5FC', // สีฟ้าอ่อน
  blue: '#42A5F5',
  green: '#66BB6A',
  white: '#FFFFFF', // สีขาว
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
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
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

    const fetchRecentOrders = async () => {
      const response = await fetch('/api/orders/recent');
      const data = await response.json();
      setRecentOrders(data);
    };

    const fetchLowStockItems = async () => {
      const response = await fetch('/api/products/low-stock');
      const data = await response.json();
      setLowStockItems(data);
    };

    const fetchData = async () => {
      await fetchTotalSales();
      await fetchTotalCustomers();
      await fetchTotalAdmins();
      await fetchTotalOrders();
      await fetchSalesData();
      await fetchRecentOrders();
      await fetchLowStockItems();
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

        {/* Enhanced Sales Line Chart */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={3} sx={{ padding: '20px', backgroundColor: colors.lightBlue }}>
            <Typography variant="h6" gutterBottom color={colors.purple}>
              Sales Trend (Last 30 Days)
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={salesData}>
                {/* Gradient for Line Chart */}
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.purple} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={colors.purple} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="date" stroke={colors.purple} />
                <YAxis stroke={colors.purple} />
                <Tooltip
                  contentStyle={{ backgroundColor: colors.white, borderColor: colors.purple }}
                  labelStyle={{ color: colors.purple }}
                />
                <Legend verticalAlign="top" align="right" height={36} />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke={colors.purple}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorUv)"
                  dot={{ stroke: colors.purple, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 8, fill: colors.purple }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Bar Chart: Sales by Quarter */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={3} sx={{ padding: '20px', backgroundColor: colors.lightPurple }}>
            <Typography variant="h6" gutterBottom color={colors.purple}>
              Quarterly Sales
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill={colors.blue} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: '20px', backgroundColor: colors.lightPurple }}>
            <Typography variant="h6" gutterBottom color={colors.purple}>
              Recent Orders
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date Ordered</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.order_id}>
                    <TableCell>{order.order_id}</TableCell>
                    <TableCell>{order.customer_name}</TableCell>
                    <TableCell>฿{order.total_amount.toFixed(2)}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        {/* Low Stock Alerts */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: '20px', backgroundColor: colors.lightPurple }}>
            <Typography variant="h6" gutterBottom color={colors.purple}>
              Low Stock Alerts
            </Typography>
            <List>
              {lowStockItems.map((item) => (
                <ListItem key={item.product_id}>
                  <ListItemText primary={item.name} secondary={`Stock: ${item.stock}`} />
                  <Button variant="contained" color="primary">Restock</Button>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
