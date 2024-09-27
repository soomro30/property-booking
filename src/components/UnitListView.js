import React, { useState, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import UnitActionIcons from './UnitActionIcons';
import useUserEmail from './useUserEmail';
import { Button, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const UnitListView = ({ 
  filteredUnits, 
  handleLayoutClick, 
  handleUnitClick, 
  handleSort, 
  getStatusColor, 
  getContrastColor,
  onPaymentPlanClick,
  onReserveUnit,
  onBookUnit,
  canReserve,
  canBook,
  currentUserId,
  handleGenerateSalesOffer,
  bedrooms,
  user // Add user prop
}) => {
  const [gridApi, setGridApi] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRowData, setCurrentRowData] = useState(null);
  const userEmail = useUserEmail();

  // Filter units based on user role and email
  const visibleUnits = useMemo(() => {
    if (!user || !user.role) {
      return filteredUnits; // If user or user.role is not available, show all units
    }
    if (user.role === 'admin') {
      return filteredUnits;
    } else {
      return filteredUnits.filter(unit => 
        unit.status === 'Available' || 
        (unit.status === 'Reserved' && unit.reserved_by_email === userEmail)
      );
    }
  }, [filteredUnits, user, userEmail]);

  const statusCellRenderer = (params) => {
    let backgroundColor = getStatusColor(params.value);
    const color = getContrastColor(backgroundColor);

    // Change background color to yellow if the unit is blocked by the current user
    if (params.value === 'Blocked' && params.data.blocked_by_email === userEmail) {
      backgroundColor = '#FFFF00'; // Yellow
    }

    // Add case for 'Reserved' status
    if (params.value === 'Reserved') {
      backgroundColor = '#FFA500'; // Orange
    }

    return (
      <div style={{
        position: 'relative',
        backgroundColor,
        color,
        padding: '0px 0px',
        borderRadius: '3px',
        textAlign: 'center'
      }}>
        {params.value}
        {params.data.status === 'Blocked' && params.data.blocked_by_email && (
          <div style={{
            position: 'absolute',
            bottom: '-12px',
            left: '0',
            right: '0',
            fontSize: '0.48em',
            color: params.data.blocked_by_email === userEmail ? 'black' : 'white',
            fontWeight: 'bold',
        
            padding: '0px 0px',
            borderRadius: '2px',
            zIndex: 1,
           
          }}>
            {params.data.blocked_by_email}
          </div>
        )}
      </div>
    );
  };

  const handleActionClick = (event, params) => {
    setAnchorEl(event.currentTarget);
    setCurrentRowData(params.data);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
    setCurrentRowData(null);
  };

  const handleActionSelect = (action) => {
    if (currentRowData) {
      switch (action) {
        case 'reserve':
          onReserveUnit(currentRowData);
          break;
        case 'book':
          onBookUnit(currentRowData);
          break;
        case 'paymentPlan':
          onPaymentPlanClick(currentRowData);
          break;
        case 'generateSalesOffer':
          handleGenerateSalesOffer(currentRowData);
          break;
        default:
          break;
      }
    }
    handleActionClose();
  };

  const actionCellRenderer = (params) => {
    return (
      <div>
        <Button
          aria-controls="action-menu"
          aria-haspopup="true"
          onClick={(event) => handleActionClick(event, params)}
          style={{ minWidth: 'auto', padding: '4px' }}
        >
          <MoreVertIcon />
        </Button>
        <Menu
          id="action-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleActionClose}
        >
          {canReserve(currentRowData) && (
            <MenuItem onClick={() => handleActionSelect('reserve')}>Reserve</MenuItem>
          )}
          {canBook(currentRowData) && (
            <MenuItem onClick={() => handleActionSelect('book')}>Book</MenuItem>
          )}
          <MenuItem onClick={() => handleActionSelect('paymentPlan')}>Payment Plan</MenuItem>
          <MenuItem onClick={() => handleActionSelect('generateSalesOffer')}>Generate Sales Offer</MenuItem>
        </Menu>
      </div>
    );
  };

  const columnDefs = useMemo(() => [
    { field: 'unit_number', headerName: 'Unit', sortable: true, filter: true },
    { 
      field: 'unit_type', 
      headerName: 'Unit Type', 
      sortable: true, 
      filter: true,
      valueGetter: (params) => {
        return params.data.unit_type || 'N/A';
      }
    },
    { 
      field: 'number_of_bedrooms', 
      headerName: 'Bedrooms', 
      sortable: true, 
      filter: true,
      valueGetter: (params) => {
        const bedroomId = params.data.bedroom_id;
        if (bedroomId && bedrooms && bedrooms[bedroomId]) {
          return bedrooms[bedroomId].number_of_bedrooms;
        }
        return params.data.number_of_bedrooms || 'N/A';
      }
    },
    { field: 'status', headerName: 'Status', sortable: true, filter: true, cellRenderer: statusCellRenderer },
    { field: 'square_footage', headerName: 'Total Area SQM', sortable: true, filter: true },
    { 
      field: '30_70_sale_price', 
      headerName: '30/70', 
      sortable: true, 
      filter: true, 
      valueFormatter: (params) => params.value ? params.value.toLocaleString() : 'N/A' 
    },
    { field: '40_60_full_comp_price', headerName: '40/60', sortable: true, filter: true, valueFormatter: (params) => params.value ? params.value.toLocaleString() : 'N/A' },
    { field: 'post_2_year_payment_price', headerName: '2Y Price', sortable: true, filter: true, valueFormatter: (params) => params.value ? params.value.toLocaleString() : 'N/A' },
    { field: 'post_3_year_payment_price', headerName: '3Y Price', sortable: true, filter: true, valueFormatter: (params) => params.value ? params.value.toLocaleString() : 'N/A' },
    { field: 'post_4_year_payment_price', headerName: '4Y Price', sortable: true, filter: true, valueFormatter: (params) => params.value ? params.value.toLocaleString() : 'N/A' },
    { field: 'amenities', headerName: 'View', sortable: true, filter: true },
    {
      headerName: 'Actions',
      field: 'actions',
      sortable: false,
      filter: false,
      cellRenderer: (params) => (
        <UnitActionIcons
          unit={params.data}
          handleLayoutClick={handleLayoutClick}
          handlePaymentPlanClick={onPaymentPlanClick}
          handleReserveUnit={onReserveUnit}
          handleBookUnit={onBookUnit}
          handleGenerateSalesOffer={handleGenerateSalesOffer}
          canReserve={canReserve}
          canBook={canBook}
        />
      ),
      cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
    }
  ], [handleLayoutClick, onPaymentPlanClick, onReserveUnit, onBookUnit, handleGenerateSalesOffer, canReserve, canBook]);

  const defaultColDef = useMemo(() => ({
    flex: 1,
    minWidth: 100,
    resizable: true,
    floatingFilter: true
  }), []);

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  }, []);

  console.log("Rendering UnitListView with filteredUnits:", JSON.stringify(filteredUnits, null, 2));

  return (
    <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
      <AgGridReact
        columnDefs={columnDefs}
        rowData={filteredUnits} // Use filteredUnits directly
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
        rowSelection="multiple"
        enableRangeSelection={true}
        pagination={true}
        paginationPageSize={20}
        suppressRowClickSelection={true}
      />
    </div>
  );
};

export default UnitListView;
