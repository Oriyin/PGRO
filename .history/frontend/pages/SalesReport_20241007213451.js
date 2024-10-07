import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
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
};

const ReportPage = () => {
  const [salesData, setSalesData] = useState([]);
  const [quarterlySalesData, setQuarterlySalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      const response = await fetch('/api/sales/data');
      const data = await response.json();
      setSalesData(data.salesData);
    };

    const fetchQuarterlySalesData = async () => {
      const response = await fetch('/api/sales/quarterly-data'); // Update with your endpoint for quarterly sales
      const data = await response.json();
      setQuarterlySalesData(data.quarterlySalesData);
    };

    const fetchData = async () => {
      await fetchSalesData();
      await fetchQuarterlySalesData();
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

      {/* Sales Trend */}
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

      {/* Quarterly Sales */}
      <Paper elevation={3} sx={{ padding: '20px', marginTop: '20px', backgroundColor: colors.lightPurple }}>
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
    </Box>
  );
};

export default ReportPage;
