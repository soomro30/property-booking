import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0f62fe',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#ffffff',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#0f62fe',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: '#ffffff',
          fontWeight: 'bold',
        },
      },
    },
  },
});

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'available':
      return { backgroundColor: '#0f62fe', color: '#ffffff' };
    case 'sold':
      return { backgroundColor: '#4caf50', color: '#ffffff' };
    case 'booked':
      return { backgroundColor: '#ff9800', color: '#000000' };
    case 'blocked':
      return { backgroundColor: '#c1c7cd', color: '#000000' };
    default:
      return { backgroundColor: '#c1c7cd', color: '#000000' };
  }
};