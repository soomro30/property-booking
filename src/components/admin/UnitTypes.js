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
  Input
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { supabase } from '../../supabaseClient';
import Compressor from 'compressorjs';

const UnitTypes = () => {
  const [unitTypes, setUnitTypes] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingUnitType, setEditingUnitType] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchUnitTypes();
  }, []);

  const fetchUnitTypes = async () => {
    const { data, error } = await supabase
      .from('unit_types')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching unit types:', error);
      showSnackbar('Error fetching unit types', 'error');
    } else {
      setUnitTypes(data || []);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setEditingUnitType(null);
    setName('');
    setDescription('');
    setFile(null);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingUnitType(null);
  };

  const handleEdit = (unitType) => {
    setEditingUnitType(unitType);
    setName(unitType.name);
    setDescription(unitType.description || '');
    setFile(null);
    setOpen(true);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile.type.startsWith('image/')) {
      new Compressor(selectedFile, {
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 600,
        success(result) {
          setFile(result);
        },
        error(err) {
          console.error('Error compressing image:', err);
          showSnackbar('Error compressing image', 'error');
        },
      });
    } else if (selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      showSnackbar('Please upload an image or PDF file', 'error');
    }
  };

  const uploadFile = async (file) => {
    // Check file size
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size exceeds 5MB limit');
    }

    // Create a safe file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

    // Determine the correct content type
    const contentType = file.type === 'application/pdf' ? 'application/pdf' : 'image/jpeg';

    try {
      const { data, error } = await supabase.storage
        .from('unit-type-files')
        .upload(fileName, file, {
          contentType: contentType,
          upsert: true
        });

      if (error) {
        console.error('Error uploading file:', error);
        throw error;
      }

      return data.path;
    } catch (error) {
      if (error.statusCode === '404' && error.message === 'Bucket not found') {
        console.error('The specified bucket does not exist. Please create it in your Supabase project.');
        throw new Error('Storage bucket not found. Please contact the administrator.');
      }
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let filePath = editingUnitType?.file_path;

    try {
      if (file) {
        filePath = await uploadFile(file);
      }

      const unitType = { name, description, file_path: filePath };

      if (editingUnitType) {
        const { error } = await supabase
          .from('unit_types')
          .update(unitType)
          .eq('id', editingUnitType.id);

        if (error) throw error;
        showSnackbar('Unit type updated successfully', 'success');
      } else {
        const { error } = await supabase
          .from('unit_types')
          .insert([unitType]);

        if (error) throw error;
        showSnackbar('Unit type created successfully', 'success');
      }

      fetchUnitTypes();
      handleClose();
    } catch (error) {
      console.error('Error submitting unit type:', error);
      showSnackbar('Error submitting unit type', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this unit type?')) {
      const { error } = await supabase
        .from('unit_types')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting unit type:', error);
        showSnackbar('Error deleting unit type', 'error');
      } else {
        showSnackbar('Unit type deleted successfully', 'success');
        fetchUnitTypes();
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

  const renderFilePreview = (filePath) => {
    if (!filePath) return null;

    console.log('File path:', filePath);

    try {
      const { data, error } = supabase.storage
        .from('unit-type-files')
        .getPublicUrl(filePath);

      if (error) {
        console.error('Error getting public URL:', error);
        return <span>Error loading file</span>;
      }

      console.log('Public URL:', data.publicUrl);

      const fileUrl = data.publicUrl;
      const fileExtension = filePath.split('.').pop().toLowerCase();

      if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
        return <img src={fileUrl} alt="Unit Type" style={{ width: '100px', height: 'auto' }} />;
      } else if (fileExtension === 'pdf') {
        return <a href={fileUrl} target="_blank" rel="noopener noreferrer">View PDF</a>;
      }
    } catch (error) {
      console.error('Error in renderFilePreview:', error);
      return <span>Error loading file</span>;
    }

    return null;
  };

  return (
    <div>
      {/* <Typography variant="h4" gutterBottom>Unit Types Management</Typography> */}
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2, mt: 2 }}>
        Add New Unit Type
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>File</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {unitTypes.map((unitType) => (
              <TableRow key={unitType.id}>
                <TableCell>{unitType.name}</TableCell>
                <TableCell>{unitType.description}</TableCell>
                <TableCell>{renderFilePreview(unitType.file_path)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(unitType)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(unitType.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingUnitType ? 'Edit Unit Type' : 'Add New Unit Type'}</DialogTitle>
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
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            type="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="file-upload"
            accept="image/*,application/pdf"
          />
          <label htmlFor="file-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUploadIcon />}
              sx={{ mt: 2 }}
            >
              Upload File (Image or PDF)
            </Button>
          </label>
          {file && <Typography variant="body2" sx={{ mt: 1 }}>File selected: {file.name}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{editingUnitType ? 'Update' : 'Create'}</Button>
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

export default UnitTypes;