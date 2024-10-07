import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CircularProgress,
  Paper,
  Avatar,
} from '@mui/material';
import { styled } from '@mui/system';

// Custom color palette
const colors = {
  lightPurple: '#D1C4E9',
  purple: '#7E57C2',
  lightBlue: '#B3E5FC',
  blue: '#42A5F5',
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
  const [recentAdminLogins, setRecentAdminLogins] = useState([]); // State for recent admin logins
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentAdminLogins = async () => {
      try {
        const response = await fetch('/api/admins/recent-logins?limit=3');
        const data = await response.json();
        setRecentAdminLogins(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recent admin logins:', error);
        setLoading(false);
      }
    };

    fetchRecentAdminLogins(); // Fetch recent admin logins when the component mounts
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
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>

        {/* Recent Admin Logins */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: '20px', backgroundColor: colors.lightPurple }}>
            <Typography variant="h6" gutterBottom color={colors.purple}>
              Recent Admin Logins
            </Typography>
            <Grid container spacing={2}>
              {recentAdminLogins.length > 0 ? recentAdminLogins.map((admin) => (
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
              )) : (
                <Typography>No recent admin logins found.</Typography>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
