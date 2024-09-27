import React, { useState } from 'react';
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FilterMenu = ({ options, value, onChange, label }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSelect = (option) => {
    onChange(option);
    handleClose();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="caption" sx={{ mb: 0.5 }}>{label}</Typography>
      <Button
        size="small"
        variant="outlined"
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
        disabled={!options || options.length === 0}
      >
        {value || 'All'}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleSelect(null)}>All</MenuItem>
        {options && options.map((option) => (
          <MenuItem 
            key={option.value} 
            onClick={() => handleSelect(option.value)}
            selected={value === option.value}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default FilterMenu;
