import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { supabase } from '../supabaseClient'; // Make sure this import is correct

const UnitLayoutModal = ({ open, onClose, unit }) => {
  console.log('UnitLayoutModal - open:', open);
  console.log('UnitLayoutModal - unit:', unit);

  if (!open) return null;

  const renderContent = () => {
    if (!unit) {
      return <Typography>No unit data available.</Typography>;
    }

    const filePath = unit.unit_type?.file_path;
    if (!filePath) {
      return <Typography>No layout file available for this unit type.</Typography>;
    }

    const fileExtension = filePath.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      return <img src={supabase.storage.from('unit-type-files').getPublicUrl(filePath).data.publicUrl} alt="Unit Layout" style={{ maxWidth: '100%', height: 'auto' }} />;
    } else if (fileExtension === 'pdf') {
      return (
        <iframe
          src={`${supabase.storage.from('unit-type-files').getPublicUrl(filePath).data.publicUrl}#toolbar=0`}
          width="100%"
          height="600px"
          style={{ border: 'none' }}
          title="Unit Layout PDF"
        />
      );
    } else {
      return <Typography>Unsupported file format</Typography>;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Unit Layout: {unit ? unit.unit_number : 'Unknown'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default UnitLayoutModal;
