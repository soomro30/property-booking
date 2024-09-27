export const getStatusColor = (status) => {
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
