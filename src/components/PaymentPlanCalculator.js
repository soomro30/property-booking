import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const PrintableContent = styled(Box)(({ theme }) => ({
  '@media print': {
    padding: theme.spacing(2),
    '& .MuiDialog-paper': {
      boxShadow: 'none',
    },
  },
}));

const CompactTable = styled(Table)(({ theme }) => ({
  '& .MuiTableCell-root': {
    padding: theme.spacing(1),
    fontSize: '0.8rem',
  },
}));

const HeaderLogo = styled('img')({
  height: '20px',
  marginRight: '10px',
});

const PaymentPlanCalculator = ({ open, onClose, unit }) => {
  const [installmentPlan, setInstallmentPlan] = useState('30/70');
  const [unitPrice, setUnitPrice] = useState(0);
  const [paymentSchedule, setPaymentSchedule] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [admFees, setAdmFees] = useState(0);

  useEffect(() => {
    if (unit) {
      updateUnitPrice(installmentPlan);
    }
  }, [unit, installmentPlan]);

  useEffect(() => {
    calculatePaymentPlan();
    calculateTotalPrice();
  }, [unitPrice, installmentPlan]);

  const updateUnitPrice = (plan) => {
    switch (plan) {
      case '30/70':
        setUnitPrice(unit['30_70_sale_price'] || 0);
        break;
      case '40/60':
        setUnitPrice(unit['40_60_full_comp_price'] || 0);
        break;
      case '2':
        setUnitPrice(unit['post_2_year_payment_price'] || 0);
        break;
      case '3':
        setUnitPrice(unit['post_3_year_payment_price'] || 0);
        break;
      case '4':
        setUnitPrice(unit['post_4_year_payment_price'] || 0);
        break;
      default:
        setUnitPrice(0);
    }
  };

  const calculatePaymentPlan = () => {
    if (!unitPrice) return;

    const today = new Date();
    const formatDate = (date) => date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    let schedule = [];

    const getDateFromDays = (days) => {
      let date = new Date(today);
      date.setDate(date.getDate() + days);
      return date;
    };

    if (installmentPlan === '30/70' || installmentPlan === '40/60') {
      const dates = [0, 8, 39, 131, 281, 497].map(getDateFromDays);
      const initialPayment = installmentPlan === '30/70' ? 0.1 : 0.2;
      const finalPayment = installmentPlan === '30/70' ? 0.7 : 0.6;

      schedule = [
        { date: formatDate(dates[0]), milestone: 'Down Payment', percentage: initialPayment * 100, amount: unitPrice * initialPayment },
        { date: formatDate(dates[1]), milestone: 'Site clearance & Enabling works', percentage: 5, amount: unitPrice * 0.05 },
        { date: formatDate(dates[2]), milestone: '50% Foundation Completion', percentage: 5, amount: unitPrice * 0.05 },
        { date: formatDate(dates[3]), milestone: '100% Foundation Completion', percentage: 5, amount: unitPrice * 0.05 },
        { date: formatDate(dates[4]), milestone: '100% Superstructure completion', percentage: 5, amount: unitPrice * 0.05 },
        { date: formatDate(dates[5]), milestone: 'Completion', percentage: finalPayment * 100, amount: unitPrice * finalPayment },
      ];
    } else if (installmentPlan === '2') {
      const dates = [0, 8, 39, 131, 281, 497, 679, 863, 1044, 1228].map(getDateFromDays);
      schedule = [
        { date: formatDate(dates[0]), milestone: 'Down Payment', percentage: 10, amount: unitPrice * 0.1 },
        { date: formatDate(dates[1]), milestone: 'Site clearance & Enabling works', percentage: 5, amount: unitPrice * 0.05 },
        { date: formatDate(dates[2]), milestone: '50% Foundation Completion', percentage: 10, amount: unitPrice * 0.1 },
        { date: formatDate(dates[3]), milestone: '100% Foundation Completion', percentage: 5, amount: unitPrice * 0.05 },
        { date: formatDate(dates[4]), milestone: '100% Superstructure completion', percentage: 10, amount: unitPrice * 0.1 },
        { date: formatDate(dates[5]), milestone: 'Completion', percentage: 10, amount: unitPrice * 0.1 },
        { date: formatDate(dates[6]), milestone: 'Post Handover Payment 1', percentage: 12.5, amount: unitPrice * 0.125 },
        { date: formatDate(dates[7]), milestone: 'Post Handover Payment 2', percentage: 12.5, amount: unitPrice * 0.125 },
        { date: formatDate(dates[8]), milestone: 'Post Handover Payment 3', percentage: 12.5, amount: unitPrice * 0.125 },
        { date: formatDate(dates[9]), milestone: 'Post Handover Payment 4', percentage: 12.5, amount: unitPrice * 0.125 },
      ];
    } else if (installmentPlan === '3') {
      const dates = [0, 8, 39, 131, 281, 497, 679, 863, 1044, 1228, 1410, 1594].map(getDateFromDays);
      schedule = [
        { date: formatDate(dates[0]), milestone: 'Down Payment', percentage: 10, amount: unitPrice * 0.1 },
        { date: formatDate(dates[1]), milestone: 'Site clearance & Enabling works', percentage: 5, amount: unitPrice * 0.05 },
        { date: formatDate(dates[2]), milestone: '50% Foundation Completion', percentage: 10, amount: unitPrice * 0.1 },
        { date: formatDate(dates[3]), milestone: '100% Foundation Completion', percentage: 5, amount: unitPrice * 0.05 },
        { date: formatDate(dates[4]), milestone: '100% Superstructure completion', percentage: 10, amount: unitPrice * 0.1 },
        { date: formatDate(dates[5]), milestone: 'Completion', percentage: 10, amount: unitPrice * 0.1 },
        { date: formatDate(dates[6]), milestone: 'Post Handover Payment 1', percentage: 8.3, amount: unitPrice * 0.083 },
        { date: formatDate(dates[7]), milestone: 'Post Handover Payment 2', percentage: 8.3, amount: unitPrice * 0.083 },
        { date: formatDate(dates[8]), milestone: 'Post Handover Payment 3', percentage: 8.3, amount: unitPrice * 0.083 },
        { date: formatDate(dates[9]), milestone: 'Post Handover Payment 4', percentage: 8.3, amount: unitPrice * 0.083 },
        { date: formatDate(dates[10]), milestone: 'Post Handover Payment 5', percentage: 8.3, amount: unitPrice * 0.083 },
        { date: formatDate(dates[11]), milestone: 'Post Handover Payment 6', percentage: 8.3, amount: unitPrice * 0.083 },
      ];
    } else if (installmentPlan === '4') {
      const dates = [0, 8, 39, 131, 281, 497, 679, 863, 1044, 1228, 1410, 1594, 1775, 1959].map(getDateFromDays);
      schedule = [
        { date: formatDate(dates[0]), milestone: 'Down Payment', percentage: 10, amount: unitPrice * 0.1 },
        { date: formatDate(dates[1]), milestone: 'Site clearance & Enabling works', percentage: 5, amount: unitPrice * 0.05 },
        { date: formatDate(dates[2]), milestone: '50% Foundation Completion', percentage: 10, amount: unitPrice * 0.1 },
        { date: formatDate(dates[3]), milestone: '100% Foundation Completion', percentage: 5, amount: unitPrice * 0.05 },
        { date: formatDate(dates[4]), milestone: '100% Superstructure completion', percentage: 10, amount: unitPrice * 0.1 },
        { date: formatDate(dates[5]), milestone: 'Completion', percentage: 10, amount: unitPrice * 0.1 },
        { date: formatDate(dates[6]), milestone: 'Post Handover Payment 1', percentage: 6.3, amount: unitPrice * 0.063 },
        { date: formatDate(dates[7]), milestone: 'Post Handover Payment 2', percentage: 6.3, amount: unitPrice * 0.063 },
        { date: formatDate(dates[8]), milestone: 'Post Handover Payment 3', percentage: 6.3, amount: unitPrice * 0.063 },
        { date: formatDate(dates[9]), milestone: 'Post Handover Payment 4', percentage: 6.3, amount: unitPrice * 0.063 },
        { date: formatDate(dates[10]), milestone: 'Post Handover Payment 5', percentage: 6.3, amount: unitPrice * 0.063 },
        { date: formatDate(dates[11]), milestone: 'Post Handover Payment 6', percentage: 6.3, amount: unitPrice * 0.063 },
        { date: formatDate(dates[12]), milestone: 'Post Handover Payment 7', percentage: 6.3, amount: unitPrice * 0.063 },
        { date: formatDate(dates[13]), milestone: 'Post Handover Payment 8', percentage: 6.3, amount: unitPrice * 0.063 },
      ];
    }

    setPaymentSchedule(schedule);
  };

  const calculateTotalPrice = () => {
    const calculatedAdmFees = unitPrice * 0.02; // 2% ADM Fees
    setAdmFees(calculatedAdmFees);
    const total = unitPrice + calculatedAdmFees + 420; // Adding 420 AED
    setTotalPrice(total);
  };

  const handleInstallmentPlanChange = (event) => {
    const newPlan = event.target.value;
    setInstallmentPlan(newPlan);
    updateUnitPrice(newPlan);
  };

  if (!unit) return null;

  // Safely access the unit_type property
  const unitTypeName = unit.unit_type?.name || 'N/A';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <PrintableContent>
        <DialogTitle>
          <Box display="flex" alignItems="center" mb={2}>
            <HeaderLogo src="https://www.imkan.ae/themes/custom/imkan/logos/logo-en.svg" alt="IMKAN Logo" />
            <Typography variant="subtitle1">
              Unit {unit.unit_number} - {unitTypeName}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <Typography variant="body2" color="textSecondary">
              Select a payment plan:
            </Typography>
            <Select
              value={installmentPlan}
              onChange={handleInstallmentPlanChange}
              fullWidth
              margin="dense"
              size="small"
            >
              <MenuItem value="30/70">30:70 Full Payment on Completion</MenuItem>
              <MenuItem value="40/60">40:60 Full Payment on Completion</MenuItem>
              <MenuItem value="2">Post-Handover-2 Years Payment Plan</MenuItem>
              <MenuItem value="3">Post-Handover-3 Years Payment Plan</MenuItem>
              <MenuItem value="4">Post-Handover-4 Years Payment Plan</MenuItem>
            </Select>
          </Box>
          <Box mb={2}>
            <Typography variant="subtitle1">
              Unit Price: {unitPrice.toLocaleString()} AED
            </Typography>
            <Typography variant="subtitle1">
              Total Price (including 2% ADM Fees of <strong>{admFees.toLocaleString()}</strong> AED and 420 AED): {totalPrice.toLocaleString()} AED
            </Typography>
          </Box>
          <TableContainer component={Paper}>
            <CompactTable>
              <TableHead>
                <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>Date</TableCell>
                  <TableCell>Milestone</TableCell>
                  <TableCell align="right">Percentage</TableCell>
                  <TableCell align="right">Amount (AED)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentSchedule.map((payment, index) => (
                  <TableRow key={index}>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>{payment.milestone}</TableCell>
                    <TableCell align="right">{payment.percentage.toFixed(2)}%</TableCell>
                    <TableCell align="right">{payment.amount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </CompactTable>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </PrintableContent>
    </Dialog>
  );
};

export default PaymentPlanCalculator;
