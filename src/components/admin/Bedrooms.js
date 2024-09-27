import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { supabase } from '../../supabaseClient';

const Bedrooms = () => {
  const [bedrooms, setBedrooms] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingBedroom, setEditingBedroom] = useState(null);
  const [numberOfBedrooms, setNumberOfBedrooms] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchBedrooms();
  }, []);

  const fetchBedrooms = async () => {
    const { data, error } = await supabase
      .from('bedrooms')
      .select('*')
      .order('number_of_bedrooms', { ascending: true });
    
    if (error) {
      console.error('Error fetching bedrooms:', error);
      showSnackbar('Error fetching bedrooms', 'error');
    } else {
      setBedrooms(data || []);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setEditingBedroom(null);
    setNumberOfBedrooms('');
  };

  const handleClose = () => {
    setOpen(false);
    setEditingBedroom(null);
  };

  const handleEdit = (bedroom) => {
    setEditingBedroom(bedroom);
    setNumberOfBedrooms(bedroom.number_of_bedrooms.toString());
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bedroom = {
      number_of_bedrooms: parseInt(numberOfBedrooms)
    };

    if (editingBedroom) {
      const { error } = await supabase
        .from('bedrooms')
        .update(bedroom)
        .eq('id', editingBedroom.id);

      if (error) {
        console.error('Error updating bedroom:', error);
        showSnackbar('Error updating bedroom', 'error');
      } else {
        showSnackbar('Bedroom updated successfully', 'success');
        fetchBedrooms();
      }
    } else {
      const { error } = await supabase
        .from('bedrooms')
        .insert([bedroom]);

      if (error) {
        console.error('Error creating bedroom:', error);
        showSnackbar('Error creating bedroom', 'error');
      } else {
        showSnackbar('Bedroom created successfully', 'success');
        fetchBedrooms();
      }
    }

    handleClose();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bedroom option?')) {
      const { error } = await supabase
        .from('bedrooms')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting bedroom:', error);
        showSnackbar('Error deleting bedroom', 'error');
      } else {
        showSnackbar('Bedroom deleted successfully', 'success');
        fetchBedrooms();
      }
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div>
      {/* <Typography variant="h4" gutterBottom>Bedrooms Management</Typography> */}
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2, mt:2 }}>
        Add New Bedroom Option
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Number of Bedrooms</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bedrooms.map((bedroom) => (
              <TableRow key={bedroom.id}>
                <TableCell>{bedroom.number_of_bedrooms}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(bedroom)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(bedroom.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingBedroom ? 'Edit Bedroom Option' : 'Add New Bedroom Option'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Number of Bedrooms"
            type="number"
            fullWidth
            value={numberOfBedrooms}
            onChange={(e) => setNumberOfBedrooms(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{editingBedroom ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Bedrooms;