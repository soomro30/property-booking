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
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
}));

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching properties:', error);
      showSnackbar('Error fetching properties', 'error');
    } else {
      setProperties(data || []);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setEditingProperty(null);
    setName('');
    setAddress('');
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProperty(null);
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setName(property.name);
    setAddress(property.address);
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const property = { name, address };

    if (editingProperty) {
      const { error } = await supabase
        .from('properties')
        .update(property)
        .eq('id', editingProperty.id);

      if (error) {
        console.error('Error updating property:', error);
        showSnackbar('Error updating property', 'error');
      } else {
        setProperties(properties.map(p => p.id === editingProperty.id ? { ...p, ...property } : p));
        showSnackbar('Property updated successfully', 'success');
      }
    } else {
      const { error } = await supabase
        .from('properties')
        .insert([property]);

      if (error) {
        console.error('Error creating property:', error);
        showSnackbar('Error creating property', 'error');
      } else {
        showSnackbar('Property created successfully', 'success');
        fetchProperties(); // Refresh the list after adding a new property
      }
    }

    handleClose();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting property:', error);
        showSnackbar('Error deleting property', 'error');
      } else {
        setProperties(properties.filter(property => property.id !== id));
        showSnackbar('Property deleted successfully', 'success');
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
      {/* <Typography variant="h4" gutterBottom>Properties Management</Typography> */}
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2, mt:2 }}>
        Add New Property
      </Button>
      <TableContainer component={StyledPaper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell>{property.name}</TableCell>
                <TableCell>{property.address}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(property)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(property.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingProperty ? 'Edit Property' : 'Add New Property'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Address"
            type="text"
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{editingProperty ? 'Update' : 'Create'}</Button>
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

export default Properties;