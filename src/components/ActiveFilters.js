import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const FilterBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const ActiveFilters = ({ filters, filterOptions }) => {
  const activeFilters = [];

  if (filters.floor) activeFilters.push(`Floor: ${filters.floor}`);
  if (filters.bedrooms) activeFilters.push(`Bedrooms: ${filters.bedrooms}`);
  if (filters.unitType) activeFilters.push(`Type: ${filters.unitType}`);
  if (filters.status) activeFilters.push(`Status: ${filters.status}`);
  if (filters.priceRange[0] > 0 || filters.priceRange[1] < filterOptions.maxPrice) {
    activeFilters.push(`Price: $${filters.priceRange[0]} - $${filters.priceRange[1]}`);
  }
  if (filters.areaRange[0] > 0 || filters.areaRange[1] < filterOptions.maxArea) {
    activeFilters.push(`Area: ${filters.areaRange[0]} - ${filters.areaRange[1]} sq ft`);
  }

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <FilterBox>
      <Typography variant="subtitle1" gutterBottom>Active Filters:</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {activeFilters.map((filter, index) => (
          <Chip key={index} label={filter} color="primary" variant="outlined" />
        ))}
      </Box>
    </FilterBox>
  );
};

export default ActiveFilters;
