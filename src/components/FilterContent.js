import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, Slider } from '@mui/material';

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const FilterContent = ({ filters, filterOptions, handleFilterChange, applyFilters, handleClearFilters }) => (
  <StyledBox sx={{ width: 280, p: 2 }}>
    <Typography variant="h6" gutterBottom>Filters</Typography>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
      <Button 
        variant="outlined" 
        onClick={handleClearFilters} 
        size="small"
        sx={{ width: '45%' }}
      >
        Clear
      </Button>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={applyFilters} 
        size="small"
        sx={{ width: '45%' }}
      >
        Apply
      </Button>
    </Box>
    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
      <InputLabel>Floor</InputLabel>
      <Select
        value={filters.floor}
        onChange={(e) => handleFilterChange('floor', e.target.value)}
      >
        <MenuItem value="">All</MenuItem>
        {filterOptions.floors.map((floor) => (
          <MenuItem key={floor} value={floor}>{floor}</MenuItem>
        ))}
      </Select>
    </FormControl>
    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
      <InputLabel>Bedrooms</InputLabel>
      <Select
        value={filters.bedrooms}
        onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
      >
        <MenuItem value="">All</MenuItem>
        {filterOptions.bedrooms.map((bedroom) => (
          <MenuItem key={bedroom} value={bedroom}>{bedroom}</MenuItem>
        ))}
      </Select>
    </FormControl>
    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
      <InputLabel>Unit Type</InputLabel>
      <Select
        value={filters.unitType}
        onChange={(e) => handleFilterChange('unitType', e.target.value)}
      >
        <MenuItem value="">All</MenuItem>
        {filterOptions.unitTypes.map((type) => (
          <MenuItem key={type} value={type}>{type}</MenuItem>
        ))}
      </Select>
    </FormControl>
    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
      <InputLabel>Status</InputLabel>
      <Select
        value={filters.status}
        onChange={(e) => handleFilterChange('status', e.target.value)}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="available">Available</MenuItem>
        <MenuItem value="reserved">Reserved</MenuItem>
        <MenuItem value="sold">Sold</MenuItem>
      </Select>
    </FormControl>
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" gutterBottom>Price Range</Typography>
      <Slider
        value={filters.priceRange}
        onChange={(e, newValue) => handleFilterChange('priceRange', newValue)}
        valueLabelDisplay="auto"
        min={0}
        max={filterOptions.maxPrice}
        step={1000}
      />
      <Typography variant="caption">{`$${filters.priceRange[0]} - $${filters.priceRange[1]}`}</Typography>
    </Box>
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" gutterBottom>Area Range (sq ft)</Typography>
      <Slider
        value={filters.areaRange}
        onChange={(e, newValue) => handleFilterChange('areaRange', newValue)}
        valueLabelDisplay="auto"
        min={0}
        max={filterOptions.maxArea}
        step={50}
      />
      <Typography variant="caption">{`${filters.areaRange[0]} - ${filters.areaRange[1]} sq ft`}</Typography>
    </Box>
  </StyledBox>
);

export default FilterContent;
