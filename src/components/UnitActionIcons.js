import React, { useState, useEffect } from 'react';
import { Box, IconButton, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import UnitDetailsPopup from './UnitDetailsPopup';
import { supabase } from '../supabaseClient';

const UnitActionIcons = ({ 
  unit, 
  handleLayoutClick, 
  handlePaymentPlanClick, 
  handleReserveUnit, 
  handleBookUnit,
  handleGenerateSalesOffer,
  canReserve,
  canBook,
  userEmail
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openReserveDialog, setOpenReserveDialog] = useState(false);
  const [openDetailsPopup, setOpenDetailsPopup] = useState(false);
  const [reservationTimer, setReservationTimer] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    if (unit.status === 'Reserved' && unit.reserved_by_email === userEmail) {
      const reservationTime = new Date(unit.reservation_time).getTime();
      const currentTime = new Date().getTime();
      const timeLeft = Math.max(0, 600000 - (currentTime - reservationTime));

      setRemainingTime(timeLeft);

      const timerId = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timerId);
            handleReservationExpired();
            return 0;
          }
          return prevTime - 1000;
        });
      }, 1000);

      setReservationTimer(timerId);

      return () => clearInterval(timerId);
    }
  }, [unit, userEmail]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleReserveClick = () => {
    handleMenuClose();
    setOpenReserveDialog(true);
  };

  const handleReserveConfirm = () => {
    if (handleReserveUnit) {
      handleReserveUnit(unit);
    } else {
      console.error('handleReserveUnit function is not available');
    }
    setOpenReserveDialog(false);
  };

  const handleDetailsClick = () => {
    handleMenuClose();
    setOpenDetailsPopup(true);
  };

  const handleDetailsClose = () => {
    setOpenDetailsPopup(false);
  };

  const handleReserveCancel = () => {
    setOpenReserveDialog(false);
  };

  const handleReservationExpired = async () => {
    try {
      const { data, error } = await supabase
        .from('units')
        .update({ status: 'Available', reserved_by_email: null, reservation_time: null })
        .eq('id', unit.id);

      if (error) throw error;

      console.log(`Unit ${unit.unit_number} reservation expired`);
    } catch (error) {
      console.error('Error updating unit status:', error);
    }
  };

  return (
    <Box>
      <IconButton size="small" onClick={handleMenuOpen}>
        <MoreVertIcon />
      </IconButton>
      {unit.status === 'Reserved' && unit.reserved_by_email === userEmail && (
        <Typography variant="caption" style={{ color: remainingTime < 60000 ? 'red' : 'inherit', animation: 'blink 1s linear infinite' }}>
          {Math.floor(remainingTime / 60000)}:{((remainingTime % 60000) / 1000).toFixed(0).padStart(2, '0')}
        </Typography>
      )}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={(e) => {
          handleMenuClose();
          handleLayoutClick(e, unit);
        }}>
          View unit layout
        </MenuItem>
        <MenuItem onClick={(e) => {
          handleMenuClose();
          handlePaymentPlanClick(e, unit);
        }}>
          Payment Plan
        </MenuItem>
        {(unit.status === 'Available' && canReserve) && (
          <MenuItem onClick={handleReserveClick}>
            Reserve Unit
          </MenuItem>
        )}
        {(unit.status === 'Reserved' && (unit.reserved_by_email === userEmail || canBook)) && (
          <MenuItem onClick={() => {
            handleMenuClose();
            if (typeof handleBookUnit === 'function') {
              handleBookUnit(unit);
            } else {
              console.error('handleBookUnit is not a function or is undefined');
              // You might want to add a fallback behavior here
              // For example, show an alert to the user
              alert('Booking functionality is currently unavailable. Please try again later.');
            }
          }}>
            Book Unit
          </MenuItem>
        )}
        <MenuItem onClick={handleDetailsClick}>
          Unit Details
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          handleGenerateSalesOffer(unit);
        }}>
          Generate Sales Offer
        </MenuItem>
      </Menu>

      <Dialog
        open={openReserveDialog}
        onClose={handleReserveCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Reserve Unit"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to proceed with reserving this unit? (Yes/No)
            If clicked "Yes", the unit will be reserved for you.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReserveCancel} color="primary">
            No
          </Button>
          <Button onClick={handleReserveConfirm} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <UnitDetailsPopup
        unit={unit}
        open={openDetailsPopup}
        anchorEl={anchorEl}
        onClose={handleDetailsClose}
      />
    </Box>
  );
};

export default UnitActionIcons;
