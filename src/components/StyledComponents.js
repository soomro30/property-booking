import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';
import { keyframes } from '@mui/material/styles';

// Define getStatusColor function
const getStatusColor = (status) => {
  switch (status) {
    case 'Available':
      return '#0f62fe'; // Blue
    case 'Sold':
      return '#4caf50'; // Green
    case 'Booked':
      return '#ff9800'; // Orange
    case 'Blocked':
      return '#c1c7cd'; // Light Gray
    default:
      return '#c1c7cd'; // Default Light Gray
  }
};

// Define getContrastColor function
const getContrastColor = (hexColor) => {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for bright colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 255, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 255, 0, 0);
  }
`;

export const UnitPaper = styled(Paper)(({ theme, status, isHighlighted }) => {
  const bgColor = getStatusColor(status);
  const textColor = status === 'Sold' ? '#FFFFFF' : getContrastColor(bgColor);

  return {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: textColor,
    backgroundColor: bgColor,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    cursor: status === 'Sold' ? 'default' : 'pointer',
    transition: 'all 0.3s ease-in-out',
    position: 'relative',
    opacity: status === 'Sold' ? 0.7 : 1, // Reduce opacity for sold units
    ...(isHighlighted && status !== 'Sold' && {
      animation: `${pulseAnimation} 1.5s infinite`,
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        border: '3px solid #00FF00',
        pointerEvents: 'none',
        zIndex: 1,
      },
    }),
  };
});
