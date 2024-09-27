import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // You can change this to your preferred primary color
    },
    secondary: {
      main: '#9c27b0', // You can change this to your preferred secondary color
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // This removes the default uppercase transform
        },
      },
    },
    // You can add more component style overrides here
  },
});

export default theme;
