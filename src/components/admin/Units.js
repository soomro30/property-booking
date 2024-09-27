import React, { useState, useEffect } from 'react';
import { Typography, Snackbar, Alert, ThemeProvider } from '@mui/material';
import { Button, CircularProgress } from '@mui/material';
import UnitForm from './UnitForm';
import UnitTable from './UnitTable';
import { fetchUnits, fetchRelatedData } from './UnitActions';
import { ImportExportButtons } from './UnitImportExport';
import { theme } from './styles';
import { supabase } from '../../supabaseClient';
import AddIcon from '@mui/icons-material/Add';
const Units = () => {
  const [units, setUnits] = useState([]);
  const [processedUnits, setProcessedUnits] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedData, setRelatedData] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // State for unit details
  const [unitNumber, setUnitNumber] = useState('');
  const [floorNumber, setFloorNumber] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [unitTypeName, setUnitTypeName] = useState('');
  const [numberOfBedrooms, setNumberOfBedrooms] = useState('');
  // ... add other unit detail states as needed ...

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [unitsData, relatedDataResult] = await Promise.all([fetchUnits(), fetchRelatedData()]);
      setUnits(unitsData);
      setRelatedData(relatedDataResult);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setEditingUnit(null);
  };

  const handleEdit = (unit) => {
    setEditingUnit(unit);
    setUnitNumber(unit.unit_number);
    setFloorNumber(unit.floor_number.toString());
    setPropertyName(unit.property_name);
    setUnitTypeName(unit.unit_type);
    setNumberOfBedrooms(unit.bedrooms.toString());
    // ... set other fields ...
    setOpen(true);
  };

  const handleDelete = async (id) => {
    // ... your existing delete logic ...
  };

  const deleteUnits = async (ids) => {
    try {
      const { error } = await supabase
        .from('units')
        .delete()
        .in('id', ids);

      if (error) {
        throw new Error(error.message);
      }

      showSnackbar(`Successfully deleted ${ids.length} units`, 'success');
      // Refresh the units list after deletion
      fetchUnits();
    } catch (error) {
      showSnackbar(`Error deleting units: ${error.message}`, 'error');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingUnit(null);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSave = async () => {
    // ... logic to save edited unit ...
    handleClose();
  };

  console.log("Units component - selectedRows:", selectedRows); // Debugging log

  return (
    <ThemeProvider theme={theme}>
      <div style={{ backgroundColor: 'white', color: '#000000', padding: '20px' }}>
       
          <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpen}
        sx={{ mb: 2, ml: 0,  }}
        disabled={isLoading}
      >
      Add a new unit
      </Button>
        <ImportExportButtons showSnackbar={showSnackbar} refreshUnits={() => fetchUnits().then(setUnits)} />
        <UnitTable 
          units={units} 
          relatedData={relatedData} 
          isLoading={isLoading} 
          setEditingUnit={setEditingUnit} 
          showSnackbar={showSnackbar}
          selectedRows={selectedRows}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          setSelectedRows={setSelectedRows}
          deleteUnits={deleteUnits}  // Pass the deleteUnits function as a prop
        />
        <UnitForm 
          open={open} 
          handleClose={handleClose} 
          editingUnit={editingUnit} 
          showSnackbar={showSnackbar}
          refreshUnits={() => fetchUnits().then(setUnits)}
        />
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
};

export default Units;