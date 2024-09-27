import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { supabase } from '../supabaseClient';

const JotFormBooking = ({ unit, salespersonEmail, onSubmit, customerData, selectedPaymentPlan, selectedPaymentPlanPrice, downPayment, paymentMode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Unit:', unit);
    console.log('Salesperson Email:', salespersonEmail);
    console.log('Customer Data:', customerData);
    console.log('Selected Payment Plan:', selectedPaymentPlan);
    console.log('Selected Payment Plan Price:', selectedPaymentPlanPrice);
    console.log('Down Payment:', downPayment);
    console.log('Payment Mode:', paymentMode);

    const iframe = document.getElementById('JotFormIFrame-242314453469054');
    if (iframe) {
      iframe.onload = () => {
        setIsLoading(false);
        window.addEventListener('message', handleIframeMessage, false);
        
        if (customerData && unit) {
          setTimeout(() => populateForm(customerData, unit), 1000);
        }
      };
    }

    return () => {
      window.removeEventListener('message', handleIframeMessage);
    };
  }, [customerData, unit, selectedPaymentPlan, selectedPaymentPlanPrice, downPayment, paymentMode]);

  const populateForm = (data, unitData) => {
    console.log('Populating form with data:', data);
    console.log('Unit data:', unitData);
    const iframe = document.getElementById('JotFormIFrame-242314453469054');
    if (iframe && iframe.contentWindow) {
      const formData = {
        'q6_clientName[first]': data.fullName.split(' ')[0] || '',
        'q6_clientName[last]': data.fullName.split(' ').slice(1).join(' ') || '',
        'input_4': data.email || '',
        'input_5': data.phone || '',
        'input_53': data.emiratesID || '',
        'input_56': data.passportNumber || '',
        'input_51_addr_line1': data.address || '',
        'input_51_city': '',
        'input_51_country': '',
        'input_84': data.uaeResident || '',
        'input_71': data.brokerCompanyName || '',
        'input_78_first': data.agentName?.split(' ')[0] || '',
        'input_78_last': data.agentName?.split(' ').slice(1).join(' ') || '',
        'input_82': data.imkanPropertyAdvisor || '',
        'input_6': unitData.unit_number,
        'input_7': unitData.unit_type,
        'input_8': selectedPaymentPlanPrice,
        'input_9': selectedPaymentPlan,
        'input_10': downPayment,
        'input_11': paymentMode,
      };

      iframe.contentWindow.postMessage(JSON.stringify({
        action: 'setFormData',
        formData: formData
      }), '*');

      console.log('Sent form data:', formData);
    } else {
      console.error('Iframe or contentWindow not found');
    }
  };

  const handleIframeMessage = (event) => {
    console.log('Received iframe message:', event.data);
    if (event.data.action === 'submission-completed') {
      console.log('Form submitted:', event.data);
      handleFormSubmit(event.data);
    }
  };

  const handleFormSubmit = async (submissionData) => {
    console.log('Form submitted:', submissionData);
    try {
      const { data, error } = await supabase
        .from('units')
        .update({ 
          status: 'Booked', 
          blocked_by: null,
          blocked_by_email: null
        })
        .eq('id', unit.id);

      if (error) throw error;

      console.log('Unit booked successfully:', data);
      onSubmit(unit.id);
    } catch (error) {
      console.error('Error booking unit:', error);
      setError('Failed to book unit. Please try again.');
    }
  };

  if (error) {
    return (
      <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const formUrl = new URL('https://form.jotform.com/242470958917469');
  
  formUrl.searchParams.append('unitNumber', unit.unit_number);
  formUrl.searchParams.append('unitType', unit.unit_type);
  formUrl.searchParams.append('propertyPrice', selectedPaymentPlanPrice);
  formUrl.searchParams.append('salesPerson', salespersonEmail);
  formUrl.searchParams.append('clientName[first]', customerData.fullName.split(' ')[0] || '');
  formUrl.searchParams.append('clientName[last]', customerData.fullName.split(' ').slice(1).join(' ') || '');
  
  formUrl.searchParams.append('customerEmail', customerData.email);
  formUrl.searchParams.append('customerPhone', customerData.phone);
  formUrl.searchParams.append('emiratesId', customerData.emiratesID);
  formUrl.searchParams.append('customerPassportNumber', customerData.passportNumber);
  formUrl.searchParams.append('completeAddress', customerData.address);
  formUrl.searchParams.append('resident', customerData.uaeResident);
  formUrl.searchParams.append('brokerCompany', customerData.brokerCompanyName);
  formUrl.searchParams.append('agentbrokerName', customerData.agentName);
  formUrl.searchParams.append('customerIMKANAdvisor', customerData.imkanPropertyAdvisor);
  formUrl.searchParams.append('brokerCompanyLicense', customerData.brokerCompanyLicense);
  formUrl.searchParams.append('agentbrokerLicense1', customerData.agentBrokerLicense);
  formUrl.searchParams.append('leadSource', customerData.leadSource);
  
  formUrl.searchParams.append('paymentPlan', selectedPaymentPlan);
  formUrl.searchParams.append('downPayment', downPayment);
  formUrl.searchParams.append('paymentMode', paymentMode);

  if (customerData) {
    Object.entries(customerData).forEach(([key, value]) => {
      if (value) formUrl.searchParams.append(key, value);
    });
  }

  return (
    <Box sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      {isLoading && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.7)', zIndex: 1 }}>
          <CircularProgress />
        </Box>
      )}
      <iframe
        id="JotFormIFrame-242314453469054"
        title="Booking Form"
        onLoad={() => {
          console.log('iframe loaded');
          setIsLoading(false);
        }}
        allowTransparency="true"
        allowFullScreen="true"
        allow="geolocation; microphone; camera"
        src={formUrl.toString()}
        frameBorder="0"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        scrolling="yes"
      />
    </Box>
  );
};

export default JotFormBooking;
