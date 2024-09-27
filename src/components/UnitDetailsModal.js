import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Box } from '@mui/material';

const UnitDetailsModal = ({ unit, open, onClose, onBook }) => {
  if (!unit) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Unit Details: {unit.unit_number}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography><strong>Floor:</strong> {unit.floor?.floor_number}</Typography>
          <Typography><strong>Bedrooms:</strong> {unit.number_of_bedrooms?.number_of_bedrooms}</Typography>
          <Typography><strong>Type:</strong> {unit.unit_type?.name}</Typography>
          <Typography><strong>Area:</strong> {unit.square_footage} sq ft</Typography>
          <Typography><strong>Price:</strong> ${unit.price}</Typography>
          <Typography><strong>Status:</strong> {unit.status}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        {unit.status === 'available' && (
          <Button onClick={() => onBook(unit)} color="primary" variant="contained">
            Book
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default UnitDetailsModal;
