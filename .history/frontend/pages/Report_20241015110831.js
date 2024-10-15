import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Grid
} from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import AdminNavbar from '../components/AdminNavbar';

const colors = {
  lightPurple: '#D1C4E9',
  purple: '#7E57C2',
  lightBlue: '#B3E5FC',
  blue: '#42A5F5',
  green: '#66BB6A',
  white: '#FFFFFF',
};

const Report = () => {
  const [salesData, setSalesData] = useState([]);
  const [weeklyReport, setWeeklyReport] = useState({ totalSales: 0, totalOrders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch('/api/sales/data');
        const data = await response.json();
        setSalesData(data.salesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sales data", error);
        setLoading(false);
      }
    };

    const fetchWeeklyReport = async () => {
      try {
        const response = await fetch('/api/weekly-report');
        const data = await response.json();
        setWeeklyReport(data);
      } catch (error) {
        console.error("Error fetching weekly report", error);
      }
    };

    fetchSalesData();
    fetchWeeklyReport();
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
      <Box sx={{ padding: '90px' }}>
        <Typography variant="h4" gutterBottom color={colors.purple} fontWeight="bold">
          Sales Report
        </Typography>
        <Grid container spacing={3}>
          {/* Enhanced Sales Line Chart */}
          <Grid item xs={12} lg={8}>
            <Paper elevation={3} sx={{ padding: '20px', backgroundColor: colors.lightBlue }}>
              <Typography variant="h6" gutterBottom color={colors.purple}>
                Sales Trend (Last 30 Days)
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={salesData}>
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

          {/* Gauge Charts: Weekly Performance */}
          <Grid item xs={12} lg={6}>
            <Paper elevation={3} sx={{ padding: '20px', backgroundColor: colors.lightPurple }}>
              <Typography variant="h6" gutterBottom color={colors.purple}>
                Weekly Sales Performance
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <Gauge
                  value={weeklyReport.totalSales}
                  max={500}  // The target for total sales
                  startAngle={0}
                  endAngle={360}
                  innerRadius="80%"
                  outerRadius="100%"
                  sx={{
                    height: '100%',
                    [`& .${gaugeClasses.valueText}`]: {
                      fontSize: '24px',
                      fontWeight: 'bold',
                      fill: colors.purple,  // Purple text for better visibility
                    },
                  }}
                />
                <Typography variant="body2" color={colors.purple} textAlign="center">
                  Target: ฿500 / Week
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Paper elevation={3} sx={{ padding: '20px', backgroundColor: colors.lightPurple }}>
              <Typography variant="h6" gutterBottom color={colors.purple}>
                Weekly Orders Performance
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <Gauge
                  value={weeklyReport.totalOrders}
                  max={15}  // The target for total orders
                  startAngle={0}
                  endAngle={360}
                  innerRadius="80%"
                  outerRadius="100%"
                  sx={{
                    height: '100%',
                    [`& .${gaugeClasses.valueText}`]: {
                      fontSize: '24px',
                      fontWeight: 'bold',
                      fill: colors.purple,  // Purple text for better visibility
                    },
                  }}
                />
                <Typography variant="body2" color={colors.purple} textAlign="center">
                  Target: 15 Orders / Week
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Report;
