import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  ResponsiveContainer,
  Switch,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
};

const PinkSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#FF4081',
    '&:hover': {
      backgroundColor: '#FF4081',
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#FF4081',
  },
}));

const ReportPage = () => {
  const [salesData, setSalesData] = useState([]);
  const [quarterlySalesData, setQuarterlySalesData] = useState([]);
  const [newRegistrationsData, setNewRegistrationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSalesTrend, setShowSalesTrend] = useState(true);
  const [showQuarterlySales, setShowQuarterlySales] = useState(true);
  const [showNewRegistrations, setShowNewRegistrations] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      const response = await fetch('/api/sales/data');
      const data = await response.json();
      setSalesData(data.salesData);
    };

    const fetchQuarterlySalesData = async () => {
      const response = await fetch('/api/sales/quarterly-data');
      const data = await response.json();
      setQuarterlySalesData(data.quarterlySalesData);
    };

    const fetchNewRegistrationsData = async () => {
      const response = await fetch('/api/users/new-registration');
      const data = await response.json();
      setNewRegistrationsData(data);
    };

    const fetchData = async () => {
      await fetchSalesData();
      await fetchQuarterlySalesData();
      await fetchNewRegistrationsData();
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
        Report
      </Typography>

      {/* Toggle Switches */}
      <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h6" color={colors.purple}>Show Sales Trend</Typography>
        <PinkSwitch checked={showSalesTrend} onChange={() => setShowSalesTrend(!showSalesTrend)} />
      </Box>
      
      {/* Sales Trend */}
      {showSalesTrend && (
        <Paper elevation={3} sx={{ padding: '20px', backgroundColor: colors.lightBlue }}>
          <Typography variant="h6" gutterBottom color={colors.purple}>
            Sales Trend (Last 30 Days)
          </Typography>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke={colors.purple} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      )}

      {/* Toggle Switches for Quarterly Sales */}
      <Box display="flex" justifyContent="space-between" sx={{ mb: 2, mt: 3 }}>
        <Typography variant="h6" color={colors.purple}>Show Quarterly Sales</Typography>
        <PinkSwitch checked={showQuarterlySales} onChange={() => setShowQuarterlySales(!showQuarterlySales)} />
      </Box>

      {/* Quarterly Sales */}
      {showQuarterlySales && (
        <Paper elevation={3} sx={{ padding: '20px', backgroundColor: colors.lightPurple }}>
          <Typography variant="h6" gutterBottom color={colors.purple}>
            Quarterly Sales
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={quarterlySalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill={colors.blue} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      )}

      {/* Toggle Switches for New Registrations */}
      <Box display="flex" justifyContent="space-between" sx={{ mb: 2, mt: 3 }}>
        <Typography variant="h6" color={colors.purple}>Show New Registrations</Typography>
        <PinkSwitch checked={showNewRegistrations} onChange={() => setShowNewRegistrations(!showNewRegistrations)} />
      </Box>

      {/* New Registrations */}
      {showNewRegistrations && (
        <Paper elevation={3} sx={{ padding: '20px', backgroundColor: colors.lightBlue }}>
          <Typography variant="h6" gutterBottom color={colors.purple}>
            New User Registrations (Daily)
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={newRegistrationsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="registration_date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="new_users" fill={colors.purple} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      )}
    </Box>
  );
};

export default ReportPage;
