import React from 'react';
import { Paper, Typography, Button, Box, Popper, Fade, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { supabase } from '../supabaseClient';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  maxWidth: 500,
  width: '100%',
  zIndex: 1000,
}));

const LabelTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '0.75rem',
  color: theme.palette.text.primary,
}));

const ValueTypography = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

const UnitDetailsPopup = ({ unit, open, anchorEl, onClose, onBook }) => {
  const [numberOfBedrooms, setNumberOfBedrooms] = React.useState('N/A');

  React.useEffect(() => {
    const fetchBedrooms = async () => {
      if (unit && unit.bedroom_id) {
        const { data, error } = await supabase
          .from('bedrooms')
          .select('number_of_bedrooms')
          .eq('id', unit.bedroom_id)
          .single();

        if (error) {
          console.error('Error fetching bedrooms:', error);
        } else if (data) {
          setNumberOfBedrooms(data.number_of_bedrooms);
        }
      }
    };

    fetchBedrooms();
  }, [unit]);

  if (!unit) return null;

  const fields = [
    { label: 'Unit Number', value: unit.unit_number },
    { label: 'Status', value: unit.status },
    { label: 'Square Footage', value: unit.square_footage ? `${unit.square_footage} sq ft` : 'N/A' },
    { label: 'Bathrooms', value: unit.bathrooms || 'N/A' },
    { label: 'Bedrooms', value: numberOfBedrooms },
    { label: 'BUA', value: unit.bua ? `${unit.bua} sq ft` : 'N/A' },
    { label: 'Sellable Area', value: unit.sellable_area ? `${unit.sellable_area} sq ft` : 'N/A' },
    { label: '30/70 Sale Price', value: unit['30_70_sale_price'] ? `AED ${unit['30_70_sale_price'].toLocaleString()}` : 'N/A' },
    { label: '40/60 Full Comp Price', value: unit['40_60_full_comp_price'] ? `AED ${unit['40_60_full_comp_price'].toLocaleString()}` : 'N/A' },
    { label: '2 Year Payment Price', value: unit['post_2_year_payment_price'] ? `AED ${unit['post_2_year_payment_price'].toLocaleString()}` : 'N/A' },
    { label: '3 Year Payment Price', value: unit['post_3_year_payment_price'] ? `AED ${unit['post_3_year_payment_price'].toLocaleString()}` : 'N/A' },
    { label: '4 Year Payment Price', value: unit['post_4_year_payment_price'] ? `AED ${unit['post_4_year_payment_price'].toLocaleString()}` : 'N/A' },
    { label: 'Release', value: unit.release || 'N/A' },
    { label: 'Amenities', value: unit.amenities || 'N/A' },
    { label: 'Virtual Account No', value: unit.virtual_account_no || 'N/A' },
    { label: 'Customer Virtual IBAN', value: unit.customer_virtual_iban_number || 'N/A' },
  ];

  return (
    <Popper open={open} anchorEl={anchorEl} placement="right-start" transition>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <StyledPaper elevation={3}>
            <Typography variant="h6" gutterBottom color="primary">Unit Details</Typography>
            <Grid container spacing={1} sx={{ mb: 2 }}>
              {fields.map((field, index) => (
                <Grid item xs={6} key={index}>
                  <LabelTypography>{field.label}:</LabelTypography>
                  <ValueTypography>{field.value}</ValueTypography>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={onClose} color="primary" sx={{ mr: 1 }}>
                Close
              </Button>
              {unit.status.toLowerCase() === 'available' && (
                <Button onClick={() => onBook(unit)} color="primary" variant="contained">
                  Book
                </Button>
              )}
            </Box>
          </StyledPaper>
        </Fade>
      )}
    </Popper>
  );
};

export default UnitDetailsPopup;
