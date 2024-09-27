import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimerIcon from '@mui/icons-material/Timer';
import SellIcon from '@mui/icons-material/Sell';

const QuickStats = ({ units }) => {
  const totalUnits = units.length;
  const availableUnits = units.filter(unit => unit.status === 'available').length;
  const reservedUnits = units.filter(unit => unit.status === 'reserved').length;
  const soldUnits = units.filter(unit => unit.status === 'sold').length;

  const StatItem = ({ icon, label, value, color }) => (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {React.cloneElement(icon, { sx: { fontSize: 36, color: color, mr: 1 } })}
      <Box>
        <Typography variant="h6" fontWeight="bold" color={color}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <StatItem icon={<HomeIcon />} label="Total" value={totalUnits} color="primary.main" />
      </Grid>
      <Grid item xs={3}>
        <StatItem icon={<CheckCircleIcon />} label="Available" value={availableUnits} color="success.main" />
      </Grid>
      <Grid item xs={3}>
        <StatItem icon={<TimerIcon />} label="Reserved" value={reservedUnits} color="warning.main" />
      </Grid>
      <Grid item xs={3}>
        <StatItem icon={<SellIcon />} label="Sold" value={soldUnits} color="error.main" />
      </Grid>
    </Grid>
  );
};

export default QuickStats;
