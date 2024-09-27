import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { CircularProgress, Typography, Chip, IconButton, Button, Box } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getStatusColor } from './styles';

const UnitTable = ({ units, relatedData, isLoading, setEditingUnit, showSnackbar, selectedRows, setSelectedRows, handleEdit, handleDelete, deleteUnits }) => {
  const processedUnits = useMemo(() => {
    if (!Array.isArray(units)) {
      console.error('Units is not an array:', units);
      return [];
    }

    return units.map(unit => {
      if (typeof unit !== 'object' || unit === null) {
        console.error('Invalid unit:', unit);
        return null;
      }

      return {
        ...unit,
        floor_number: relatedData?.floors?.[unit.floor_id]?.floor_number ?? 'N/A',
        property_name: relatedData?.properties?.[unit.property_id]?.name ?? 'N/A',
        unit_type: relatedData?.unitTypes?.[unit.unit_type_id]?.name ?? 'N/A',
        bedrooms: unit.bedrooms ?? relatedData?.bedrooms?.[unit.bedroom_id]?.number_of_bedrooms ?? 'N/A',
      };
    }).filter(Boolean);
  }, [units, relatedData]);

  const columnDefs = [
    { field: 'unit_number', headerName: 'Unit #', width: 100, pinned: 'left' },
    { field: 'floor_number', headerName: 'Floor', width: 100 },
    { field: 'property_name', headerName: 'Property', width: 150 },
    { field: 'unit_type', headerName: 'Type', width: 120 },
    { field: 'bedrooms', headerName: 'Beds', width: 100 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      cellRenderer: (params) => (
        <Chip 
          label={params.value || 'N/A'}
          size="small" 
          sx={{
            ...getStatusColor(params.value),
            fontWeight: 'bold',
            textTransform: 'capitalize'
          }}
        />
      )
    },
    { field: 'square_footage', headerName: 'Sq.Ft', width: 120, type: 'numericColumn' },
    { field: 'bathrooms', headerName: 'Baths', width: 100, type: 'numericColumn' },
    { field: 'plot_id_adm', headerName: 'Plot ID ADM', width: 150 },
    { field: 'virtual_account_no', headerName: 'Virtual Acc No', width: 180 },
    { field: 'bua', headerName: 'BUA', width: 100, type: 'numericColumn' },
    { field: 'sellable_area', headerName: 'Sellable Area', width: 150, type: 'numericColumn' },
    { field: 'release', headerName: 'Release', width: 120 },
    { field: 'amenities', headerName: 'Amenities', width: 200 },
    { field: 'post_2_year_payment_price', headerName: '2Y Price', width: 150, type: 'numericColumn' },
    { field: 'post_3_year_payment_price', headerName: '3Y Price', width: 150, type: 'numericColumn' },
    { field: 'post_4_year_payment_price', headerName: '4Y Price', width: 150, type: 'numericColumn' },
    { field: 'customer_virtual_iban_number', headerName: 'Customer IBAN', width: 200 },
    {
      headerName: 'Actions',
      width: 120,
      pinned: 'right',
      cellRenderer: (params) => (
        <>
          <IconButton
            size="small"
            onClick={() => handleEdit(params.data)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.data.id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </>
      ),
    },
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  const onSelectionChanged = (event) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    setSelectedRows(selectedData);
  };

  const handleMultiDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedRows.length} units?`)) {
      try {
        await deleteUnits(selectedRows.map(row => row.id));
        showSnackbar(`Successfully deleted ${selectedRows.length} units`, 'success');
        setSelectedRows([]);
      } catch (error) {
        showSnackbar(`Error deleting units: ${error.message}`, 'error');
      }
    }
  };

  const handleSingleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this unit?')) {
      try {
        await deleteUnits([id]);
        showSnackbar('Successfully deleted the unit', 'success');
      } catch (error) {
        showSnackbar(`Error deleting unit: ${error.message}`, 'error');
      }
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  return processedUnits.length > 0 ? (
    <div style={{ height: '80vh', width: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        {selectedRows.length > 0 && (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DeleteIcon />}
            onClick={handleMultiDelete}
            sx={{ ml: 2 }}
          >
            Delete Selected ({selectedRows.length})
          </Button>
        )}
      </Box>
      <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
        <AgGridReact
          rowData={processedUnits}
          columnDefs={columnDefs.map(col => 
            col.headerName === 'Actions' 
              ? {...col, cellRenderer: (params) => (
                  <>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(params.data)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleSingleDelete(params.data.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
              : col
          )}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={20}
          rowSelection="multiple"
          onSelectionChanged={onSelectionChanged}
          suppressRowClickSelection={true}
          animateRows={true}
          domLayout='autoHeight'
          headerHeight={40}
          rowHeight={35}
        />
      </div>
    </div>
  ) : (
    <Typography>No units available</Typography>
  );
};

export default UnitTable;