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
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { supabase } from '../../supabaseClient';

const Floors = () => {
  const [floors, setFloors] = useState([]);
  const [properties, setProperties] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingFloor, setEditingFloor] = useState(null);
  const [floorNumber, setFloorNumber] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [startFloor, setStartFloor] = useState(1);
  const [endFloor, setEndFloor] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchFloors();
    fetchProperties();
  }, []);

  const fetchFloors = async () => {
    const { data, error } = await supabase
      .from('floors')
      .select(`
        *,
        property:properties(name)
      `)
      .order('property_id', { ascending: true })
      .order('floor_number', { ascending: true });
    
    if (error) {
      console.error('Error fetching floors:', error);
      showSnackbar('Error fetching floors', 'error');
    } else {
      setFloors(data || []);
    }
  };

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
    setEditingFloor(null);
    setFloorNumber('');
    setPropertyId('');
    setStartFloor(1);
    setEndFloor(1);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingFloor(null);
  };

  const handleEdit = (floor) => {
    setEditingFloor(floor);
    setFloorNumber(floor.floor_number.toString());
    setPropertyId(floor.property_id.toString());
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingFloor) {
      const { error } = await supabase
        .from('floors')
        .update({
          floor_number: parseInt(floorNumber),
          property_id: parseInt(propertyId)
        })
        .eq('id', editingFloor.id);

      if (error) {
        console.error('Error updating floor:', error);
        showSnackbar('Error updating floor', 'error');
      } else {
        showSnackbar('Floor updated successfully', 'success');
        fetchFloors();
      }
    } else {
      const floorsToCreate = [];
      for (let i = parseInt(startFloor); i <= parseInt(endFloor); i++) {
        floorsToCreate.push({
          floor_number: i,
          property_id: parseInt(propertyId)
        });
      }

      const { error } = await supabase
        .from('floors')
        .insert(floorsToCreate);

      if (error) {
        console.error('Error creating floors:', error);
        showSnackbar('Error creating floors', 'error');
      } else {
        showSnackbar(`${floorsToCreate.length} floors created successfully`, 'success');
        fetchFloors();
      }
    }

    handleClose();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this floor?')) {
      const { error } = await supabase
        .from('floors')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting floor:', error);
        showSnackbar('Error deleting floor', 'error');
      } else {
        showSnackbar('Floor deleted successfully', 'success');
        fetchFloors();
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
      {/* <Typography variant="h4" gutterBottom>Floors Management</Typography> */}
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2, mt:2 }}>
        Add New Floors
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Floor Number</TableCell>
              <TableCell>Property Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {floors.map((floor) => (
              <TableRow key={floor.id}>
                <TableCell>{floor.floor_number}</TableCell>
                <TableCell>{floor.property.name}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(floor)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(floor.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingFloor ? 'Edit Floor' : 'Add New Floors'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Property</InputLabel>
            <Select
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
            >
              {properties.map((property) => (
                <MenuItem key={property.id} value={property.id}>{property.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {editingFloor ? (
            <TextField
              margin="dense"
              label="Floor Number"
              type="number"
              fullWidth
              value={floorNumber}
              onChange={(e) => setFloorNumber(e.target.value)}
            />
          ) : (
            <>
              <TextField
                margin="dense"
                label="Start Floor"
                type="number"
                fullWidth
                value={startFloor}
                onChange={(e) => setStartFloor(e.target.value)}
              />
              <TextField
                margin="dense"
                label="End Floor"
                type="number"
                fullWidth
                value={endFloor}
                onChange={(e) => setEndFloor(e.target.value)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{editingFloor ? 'Update' : 'Create'}</Button>
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

export default Floors;
