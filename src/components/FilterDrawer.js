import React from 'react';
import { Drawer, Box, Typography, Button, Slider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const FilterDrawer = ({ open, onClose, activeFilters, onFilter, floorOptions, unitTypeOptions }) => {
  const handlePriceChange = (event, newValue) => {
    onFilter('priceRange', newValue);
  };

  const handleAreaChange = (event, newValue) => {
    onFilter('areaRange', newValue);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
    >
      <Box sx={{ width: 300, p: 3 }}>
        <Typography variant="h6" gutterBottom>Advanced Filters</Typography>
        
        <Typography gutterBottom>Price Range</Typography>
        <Slider
          value={activeFilters.priceRange || [0, 1000000]}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={1000000}
          step={10000}
        />
        
        <Typography gutterBottom>Area Range (sq ft)</Typography>
        <Slider
          value={activeFilters.areaRange || [0, 3000]}
          onChange={handleAreaChange}
          valueLabelDisplay="auto"
          min={0}
          max={3000}
          step={100}
        />
        
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Floor</InputLabel>
          <Select
            value={activeFilters.floor || ''}
            onChange={(e) => onFilter('floor', e.target.value)}
            label="Floor"
          >
            <MenuItem value="">All Floors</MenuItem>
            {floorOptions.map((floor) => (
              <MenuItem key={floor} value={floor}>Floor {floor}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Unit Type</InputLabel>
          <Select
            value={activeFilters.unitType || ''}
            onChange={(e) => onFilter('unitType', e.target.value)}
            label="Unit Type"
          >
            <MenuItem value="">All Types</MenuItem>
            {unitTypeOptions.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Button variant="contained" onClick={onClose} sx={{ mt: 2 }}>
          Apply Filters
        </Button>
      </Box>
    </Drawer>
  );
};

export default FilterDrawer;
