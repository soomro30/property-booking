import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const UnitDetails = ({ unit, onBook }) => {
  return (
    <Box>
      <Typography variant="h6">Unit Details</Typography>
      <Typography>Unit Number: {unit.unit_number}</Typography>
      <Typography>Floor: {unit.floor?.floor_number}</Typography>
      <Typography>Bedrooms: {unit.number_of_bedrooms?.number_of_bedrooms}</Typography>
      <Typography>Type: {unit.unit_type?.name}</Typography>
      <Typography>Area: {unit.square_footage} sq ft</Typography>
      <Typography>Price: ${unit.price}</Typography>
      <Typography>Status: {unit.status}</Typography>
      {onBook && (
        <Button variant="contained" color="primary" onClick={() => onBook(unit)}>
          Book
        </Button>
      )}
    </Box>
  );
};

export default UnitDetails;