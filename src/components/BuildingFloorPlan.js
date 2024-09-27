import React from 'react';
import { Box, Typography } from '@mui/material';

const BuildingFloorPlan = ({ floorData, handleUnitSelect, selectedUnit }) => {
  return (
    <Box sx={{ p: 2, height: '100%' }}>
      <Typography variant="h5" gutterBottom>Building Floor Plan</Typography>
      {/* Add your floor plan visualization here */}
      {/* You can use a library like react-svg-pan-zoom for interactive floor plans */}
      {/* Or implement your own custom visualization */}
    </Box>
  );
};

export default BuildingFloorPlan;
