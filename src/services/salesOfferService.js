import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, pdf, Font } from '@react-pdf/renderer';

// Register the Times New Roman font
Font.register({
  family: 'Times New Roman',
  src: `${process.env.PUBLIC_URL}/assets/fonts/times-new-roman.ttf`
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  section: {
    margin: 5,
    padding: 5,
  },
  logo: {
    width: 60,
    height: 22,
    alignSelf: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Times New Roman',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Times New Roman',
    marginBottom: 5,
    marginTop: 13,
    fontWeight: 700,
  },
  text: {
    fontSize: 10,
    fontFamily: 'Times New Roman',
    marginBottom: 3,
  },
  table: {
    display: 'table',
    width: '100%', // Changed to 100%
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 10,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableHeader: {
    backgroundColor: '#5E7261',
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tableCell: {
    margin: 'auto',
    marginTop: 3,
    marginBottom: 3,
    fontSize: 8,
  },
  headerLogo: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 60,
    height: 22,
  },
  footer: {
    position: 'absolute',
    bottom: 40, // Increased to make room for the timestamp
    left: 20,
    right: 20,
    textAlign: 'center',
    fontSize: 8,
    color: '#5E7261',
    fontFamily: 'Times New Roman',
  },
  timestamp: {
    position: 'absolute',
    bottom: 30, // Positioned below the footer text
    left: 20,
    right: 20,
    textAlign: 'center',
    fontSize: 8,
    color: '#000000',
    fontFamily: 'Times New Roman',
  },
  disclaimer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    textAlign: 'center',
    fontSize: 8,
    color: '#000000',
    fontFamily: 'Times New Roman',
  },
  propertyImage: {
    width: '100%',
    height: 'auto',
  },
});

const calculatePaymentPlan = (unit, installmentPlan) => {
  const unitPrice = getUnitPrice(unit, installmentPlan);
  if (!unitPrice) return [];

  const today = new Date();
  const formatDate = (date) => date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const getDateFromDays = (days) => {
    let date = new Date(today);
    date.setDate(date.getDate() + days);
    return date;
  };

  let schedule = [];

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

  return schedule;
};

const getUnitPrice = (unit, plan) => {
  switch (plan) {
    case '30/70':
      return unit['30_70_sale_price'] || 0;
    case '40/60':
      return unit['40_60_full_comp_price'] || 0;
    case '2':
      return unit['post_2_year_payment_price'] || 0;
    case '3':
      return unit['post_3_year_payment_price'] || 0;
    case '4':
      return unit['post_4_year_payment_price'] || 0;
    default:
      return 0;
  }
};

export const generateSalesOffer = async (unit, property) => {
  try {
    const MyDocument = () => {
      const PageWrapper = ({ children }) => {
        const timestamp = new Date().toLocaleString();
        return (
          <Page size="A4" style={styles.page}>
            <Image style={styles.headerLogo} src={`${process.env.PUBLIC_URL}/assets/images/logo.png`} />
            {children}
            {/* <Text style={styles.footer}>IMKAN Properties | +971 2 123 4567 | info@imkan.ae | www.imkan.ae</Text> */}
            <Text style={styles.timestamp}>Generated on: {timestamp}</Text>
            <Text style={styles.disclaimer}>Disclaimer: IMKAN reserves the right to make revisions, at its absolute discretion without liability.</Text>
          </Page>
        );
      };

      return (
        <Document>
          <PageWrapper>
            <Image style={styles.propertyImage} src={`${process.env.PUBLIC_URL}/projects/${unit.property_id}/mainImage.png`} />
            <Text style={styles.title}>Sales Proposal for {unit.unit_number} - {unit.unit_type}</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                {['Unit Number', 'Total Sellable Area', 'Unit Type', 'Bedrooms', 'BUA', 'Plot Area'].map((header, i) => (
                  <View style={[styles.tableCol, styles.tableHeader, { width: `${100/6}%` }]} key={i}>
                    <Text style={styles.tableCell}>{header}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.tableRow}>
                {[
                  unit.unit_number || 'N/A',
                  unit.square_footage ? `${unit.square_footage} SQM` : 'N/A',
                  unit.unit_type || 'N/A',
                  unit.number_of_bedrooms ? unit.number_of_bedrooms.toString() : 'N/A',
                  unit.bua ? `${unit.bua} SQM` : 'N/A',
                  unit.sellable_area ? `${unit.sellable_area} SQM` : 'N/A'
                ].map((value, i) => (
                  <View style={[styles.tableCol, { width: `${100/6}%` }]} key={i}>
                    <Text style={styles.tableCell}>{value}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                {['30:70 Full Payment on Completion', '40:60 Full Payment on Completion', 'Post-Handover-2 Years Payment Plan', 'Post-Handover-3 Years Payment Plan', 'Post-Handover-4 Years Payment Plan'].map((header, i) => (
                  <View style={[styles.tableCol, styles.tableHeader, { width: '20%' }]} key={i}>
                    <Text style={styles.tableCell}>{header}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.tableRow}>
                {[
                  unit['30_70_sale_price'] ? `AED ${unit['30_70_sale_price'].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : 'N/A',
                  unit['40_60_full_comp_price'] ? `AED ${unit['40_60_full_comp_price'].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : 'N/A',
                  unit['post_2_year_payment_price'] ? `AED ${unit['post_2_year_payment_price'].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : 'N/A',
                  unit['post_3_year_payment_price'] ? `AED ${unit['post_3_year_payment_price'].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : 'N/A',
                  unit['post_4_year_payment_price'] ? `AED ${unit['post_4_year_payment_price'].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : 'N/A',
                ].map((value, i) => (
                  <View style={[styles.tableCol, { width: '20%' }]} key={i}>
                    <Text style={styles.tableCell}>{value}</Text>
                  </View>
                ))}
              </View>
            </View>
            {['30/70', '40/60', '2', '3', '4'].map((plan, index) => {
              const paymentPlan = calculatePaymentPlan(unit, plan);
              const unitPrice = getUnitPrice(unit, plan);
              const admFees = unitPrice * 0.02;
              const total = unitPrice + admFees + 420; // Adding 420 AED for registration fees

              let planTitle;
              switch (plan) {
                case '30/70':
                  planTitle = '30:70 Full Payment on Completion';
                  break;
                case '40/60':
                  planTitle = '40:60 Full Payment on Completion';
                  break;
                case '2':
                  planTitle = 'Post-Handover-2 Years Payment Plan';
                  break;
                case '3':
                  planTitle = 'Post-Handover-3 Years Payment Plan';
                  break;
                case '4':
                  planTitle = 'Post-Handover-4 Years Payment Plan';
                  break;  
                default:
                  planTitle = `Payment Plan (${plan})`;
              }

              return paymentPlan && paymentPlan.length > 0 ? (
                <React.Fragment key={index}>
                  <Text style={styles.subtitle}>{planTitle}</Text>
                  <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                      {['Date', 'Milestone', 'Percentage', 'Amount (AED)'].map((header, i) => (
                        <View style={[styles.tableCol, { width: '25%' }]} key={i}>
                          <Text style={styles.tableCell}>{header}</Text>
                        </View>
                      ))}
                    </View>
                    {paymentPlan.map((payment, i) => (
                      <View style={styles.tableRow} key={i}>
                        <View style={[styles.tableCol, { width: '25%' }]}>
                          <Text style={styles.tableCell}>{payment.date}</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '25%' }]}>
                          <Text style={styles.tableCell}>{payment.milestone}</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '25%' }]}>
                          <Text style={styles.tableCell}>{`${payment.percentage.toFixed(2)}%`}</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '25%' }]}>
                          <Text style={styles.tableCell}>{payment.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                  <View style={[styles.table, { marginTop: 5 }]}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                      <View style={[styles.tableCol, { width: '50%' }]}>
                        <Text style={styles.tableCell}>Description</Text>
                      </View>
                      <View style={[styles.tableCol, { width: '50%' }]}>
                        <Text style={styles.tableCell}>Amount (AED)</Text>
                      </View>
                    </View>
                    <View style={styles.tableRow}>
                      <View style={[styles.tableCol, { width: '50%' }]}>
                        <Text style={styles.tableCell}>Unit Price</Text>
                      </View>
                      <View style={[styles.tableCol, { width: '50%' }]}>
                        <Text style={styles.tableCell}>{unitPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Text>
                      </View>
                    </View>
                    <View style={styles.tableRow}>
                      <View style={[styles.tableCol, { width: '50%' }]}>
                        <Text style={styles.tableCell}>ADM Fees (2%)</Text>
                      </View>
                      <View style={[styles.tableCol, { width: '50%' }]}>
                        <Text style={styles.tableCell}>{admFees.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Text>
                      </View>
                    </View>
                    <View style={styles.tableRow}>
                      <View style={[styles.tableCol, { width: '50%' }]}>
                        <Text style={styles.tableCell}>Registration Fees</Text>
                      </View>
                      <View style={[styles.tableCol, { width: '50%' }]}>
                        <Text style={styles.tableCell}>420.00</Text>
                      </View>
                    </View>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                      <View style={[styles.tableCol, { width: '50%' }]}>
                        <Text style={styles.tableCell}>Total</Text>
                      </View>
                      <View style={[styles.tableCol, { width: '50%' }]}>
                        <Text style={styles.tableCell}>{total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Text>
                      </View>
                    </View>
                  </View>
                </React.Fragment>
              ) : null;
            })}
            
            <View style={styles.bankDetails}>
              <Text style={styles.subtitle}>The Bank Details</Text>
              <Text style={styles.subtitle}>VILLA BANK ACCOUNT</Text>
              <View style={styles.table}>
                {[
                  ['Villa Escrow Account', ''],
                  ['Bank Name', 'Abu Dhabi Islamic Bank'],
                  ['Bank Branch Name & Address', 'ABU DHABI'],
                  ['Account Name', 'Al Jurf Gardens Phase 3A'],
                  ['Escrow Account Number', unit.virtual_account_no],
                  ['Escrow IBAN', unit.customer_virtual_iban_number],
                  ['Swift Code', 'ABDIAEAD'],
                ].map((row, i) => (
                  <View style={styles.tableRow} key={i}>
                    <View style={[styles.tableCol, { width: '50%' }]}>
                      <Text style={styles.tableCell}>{row[0]}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: '50%' }]}>
                      <Text style={styles.tableCell}>{row[1]}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
            <View style={[styles.bankDetails, { marginTop: 0 }]}>
              <Text style={styles.subtitle}>The ADM registration fees account details</Text>
              <View style={styles.table}>
                {[
                  ['Bank Name', 'First Abu Dhabi Bank PJSC'],
                  ['Bank Branch Name & Address', 'Abu Dhabi'],
                  ['Account Name', 'IMKAN AL JURF PROPERTIES-SOLE PROP'],
                  ['Account Number', '7771002038877011'],
                  ['IBAN', 'AE540357771002038877011'],
                  ['Swift Code', 'NBADAEAAXXX'],
                ].map((row, i) => (
                  <View style={styles.tableRow} key={i}>
                    <View style={[styles.tableCol, { width: '50%' }]}>
                      <Text style={styles.tableCell}>{row[0]}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: '50%' }]}>
                      <Text style={styles.tableCell}>{row[1]}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
            <Image style={styles.propertyImage} src={`${process.env.PUBLIC_URL}/projects/${unit.property_id}/sitePlan.jpg`} />
          </PageWrapper>
        </Document>
      );
    };

    const blob = await pdf(<MyDocument />).toBlob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Sales_Offer_${unit.unit_number || 'Unknown'}.pdf`;
    link.click();

  } catch (error) {
    console.error('Error in generateSalesOffer:', error);
    throw new Error('Failed to generate sales offer. Please try again.');
  }
};