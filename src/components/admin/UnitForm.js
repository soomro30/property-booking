import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { supabase } from '../../supabaseClient';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogTitle-root': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(2),
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1, 2),
    backgroundColor: theme.palette.grey[100],
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  minWidth: 100,
  fontWeight: 'bold',
}));

const UnitForm = ({ open, handleClose, editingUnit, showSnackbar, refreshUnits }) => {
  const [formData, setFormData] = useState({
    unit_number: '',
    floor_number: '',
    property_name: '',
    unit_type: '',
    bedrooms: '',
    status: '',
    square_footage: '',
    bathrooms: '',
    "30_70_sale_price": '',
    "40_60_full_comp_price": '',
    plot_id_adm: '',
    virtual_account_no: '',
    bua: '',
    sellable_area: '',
    release: '',
    amenities: '',
    post_2_year_payment_price: '',
    post_3_year_payment_price: '',
    post_4_year_payment_price: '',
    customer_virtual_iban_number: '',
  });

  const [relatedData, setRelatedData] = useState({
    floors: [],
    properties: [],
    unitTypes: [],
    bedrooms: [],
  });

  const STATUS_OPTIONS = ['Available', 'Sold', 'Booked', 'Blocked'];

  useEffect(() => {
    if (editingUnit) {
      setFormData(editingUnit);
    } else {
      setFormData({
        unit_number: '',
        floor_number: '',
        property_name: '',
        unit_type: '',
        bedrooms: '',
        status: '',
        square_footage: '',
        bathrooms: '',
        "30_70_sale_price": '',
        "40_60_full_comp_price": '',
        plot_id_adm: '',
        virtual_account_no: '',
        bua: '',
        sellable_area: '',
        release: '',
        amenities: '',
        post_2_year_payment_price: '',
        post_3_year_payment_price: '',
        post_4_year_payment_price: '',
        customer_virtual_iban_number: '',
      });
    }
    fetchRelatedData();
  }, [editingUnit]);

  const fetchRelatedData = async () => {
    const fetchData = async (table) => {
      const { data, error } = await supabase.from(table).select('*');
      if (error) {
        console.error(`Error fetching ${table}:`, error);
        showSnackbar(`Error fetching ${table}: ${error.message}`, 'error');
      }
      return data || [];
    };

    const [floors, properties, unitTypes, bedrooms] = await Promise.all([
      fetchData('floors'),
      fetchData('properties'),
      fetchData('unit_types'),
      fetchData('bedrooms')
    ]);

    setRelatedData({ floors, properties, unitTypes, bedrooms });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        unit_number: formData.unit_number,
        floor_id: relatedData.floors.find(f => f.floor_number.toString() === formData.floor_number)?.id,
        property_id: relatedData.properties.find(p => p.name === formData.property_name)?.id,
        unit_type_id: relatedData.unitTypes.find(ut => ut.name === formData.unit_type)?.id,
        bedroom_id: relatedData.bedrooms.find(b => b.number_of_bedrooms.toString() === formData.bedrooms)?.id,
        status: formData.status,
        square_footage: formData.square_footage,
        bathrooms: formData.bathrooms,
        "30_70_sale_price": formData["30_70_sale_price"],
        "40_60_full_comp_price": formData["40_60_full_comp_price"],
        plot_id_adm: formData.plot_id_adm,
        virtual_account_no: formData.virtual_account_no,
        bua: formData.bua,
        sellable_area: formData.sellable_area,
        release: formData.release,
        amenities: formData.amenities,
        post_2_year_payment_price: formData.post_2_year_payment_price,
        post_3_year_payment_price: formData.post_3_year_payment_price,
        post_4_year_payment_price: formData.post_4_year_payment_price,
        customer_virtual_iban_number: formData.customer_virtual_iban_number,
      };

      if (editingUnit) {
        const { error } = await supabase
          .from('units')
          .update(dataToSubmit)
          .eq('id', editingUnit.id);

        if (error) throw error;
        showSnackbar('Unit updated successfully', 'success');
      } else {
        const { error } = await supabase
          .from('units')
          .insert([dataToSubmit]);

        if (error) throw error;
        showSnackbar('Unit created successfully', 'success');
      }
      refreshUnits();
      handleClose();
    } catch (error) {
      showSnackbar(`Error: ${error.message}`, 'error');
    }
  };

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">
          {editingUnit ? 'Edit Unit' : 'Add New Unit'}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              name="unit_number"
              label="Unit Number"
              fullWidth
              value={formData.unit_number}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Floor</InputLabel>
              <Select
                name="floor_number"
                value={formData.floor_number}
                onChange={handleChange}
              >
                {relatedData.floors.map((floor) => (
                  <MenuItem key={floor.id} value={floor.floor_number.toString()}>{floor.floor_number}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Property</InputLabel>
              <Select
                name="property_name"
                value={formData.property_name}
                onChange={handleChange}
              >
                {relatedData.properties.map((property) => (
                  <MenuItem key={property.id} value={property.name}>{property.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Unit Type</InputLabel>
              <Select
                name="unit_type"
                value={formData.unit_type}
                onChange={handleChange}
              >
                {relatedData.unitTypes.map((unitType) => (
                  <MenuItem key={unitType.id} value={unitType.name}>{unitType.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Bedrooms</InputLabel>
              <Select
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
              >
                {relatedData.bedrooms.map((bedroom) => (
                  <MenuItem key={bedroom.id} value={bedroom.number_of_bedrooms.toString()}>{bedroom.number_of_bedrooms}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                {STATUS_OPTIONS.map((status) => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              name="square_footage"
              label="Square Footage"
              type="number"
              fullWidth
              value={formData.square_footage}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              name="bathrooms"
              label="Bathrooms"
              type="number"
              fullWidth
              value={formData.bathrooms}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              name="30_70_sale_price"
              label="30/70 Sale Price"
              type="number"
              fullWidth
              value={formData["30_70_sale_price"]}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              name="40_60_full_comp_price"
              label="40/60 Full Comp Price"
              type="number"
              fullWidth
              value={formData["40_60_full_comp_price"]}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              name="plot_id_adm"
              label="Plot ID ADM"
              fullWidth
              value={formData.plot_id_adm}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              name="virtual_account_no"
              label="Virtual Account No"
              fullWidth
              value={formData.virtual_account_no}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              name="bua"
              label="BUA"
              type="number"
              fullWidth
              value={formData.bua}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              name="sellable_area"
              label="Sellable Area"
              type="number"
              fullWidth
              value={formData.sellable_area}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              name="release"
              label="Release"
              fullWidth
              value={formData.release}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              name="amenities"
              label="Amenities"
              fullWidth
              value={formData.amenities}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              name="post_2_year_payment_price"
              label="2 Year Payment Price"
              type="number"
              fullWidth
              value={formData.post_2_year_payment_price}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              name="post_3_year_payment_price"
              label="3 Year Payment Price"
              type="number"
              fullWidth
              value={formData.post_3_year_payment_price}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              name="post_4_year_payment_price"
              label="4 Year Payment Price"
              type="number"
              fullWidth
              value={formData.post_4_year_payment_price}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              name="customer_virtual_iban_number"
              label="Customer Virtual IBAN Number"
              fullWidth
              value={formData.customer_virtual_iban_number}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <StyledButton onClick={handleClose} color="secondary" variant="outlined">
          Cancel
        </StyledButton>
        <StyledButton onClick={handleSubmit} color="primary" variant="contained">
          {editingUnit ? 'Update' : 'Create'}
        </StyledButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default UnitForm;