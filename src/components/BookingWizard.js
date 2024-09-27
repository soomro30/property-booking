import React, { useState, useEffect, useCallback } from 'react';
import { IconSettings } from '@salesforce/design-system-react';
import Tabs from '@salesforce/design-system-react/components/tabs';
import TabsPanel from '@salesforce/design-system-react/components/tabs/panel';
import Input from '@salesforce/design-system-react/components/input';
import Button from '@salesforce/design-system-react/components/button';
import Combobox from '@salesforce/design-system-react/components/combobox';
import Checkbox from '@salesforce/design-system-react/components/checkbox';
import PageHeader from '@salesforce/design-system-react/components/page-header';
import Icon from '@salesforce/design-system-react/components/icon';

import JotFormBooking from './JotFormBooking';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const BookingWizard = ({ unit, salespersonEmail, onSubmit, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [downPayment, setDownPayment] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState('');
  const [isDownPaymentCollected, setIsDownPaymentCollected] = useState(false);
  const [selectedPaymentPlanPrice, setSelectedPaymentPlanPrice] = useState(null);
  const [paymentReference, setPaymentReference] = useState('');

  const fetchCustomers = useCallback(async (term) => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://api.jotform.com/form/242253667987472/submissions', {
        params: {
          apiKey: '51e28f19eaafaf235709b5dd535b8c5b',
          filter: {
            'ClientFullName:first': {
              'operator': 'contains',
              'value': term
            }
          }
        }
      });

      if (response.data && response.data.content) {
        const processedCustomers = response.data.content
          .filter(submission => {
            const fullName = `${submission.answers[4]?.answer?.first || ''} ${submission.answers[4]?.answer?.last || ''}`.trim().toLowerCase();
            return fullName.includes(term.toLowerCase());
          })
          .map(submission => ({
            id: submission.id,
            fullName: `${submission.answers[4]?.answer?.first || ''} ${submission.answers[4]?.answer?.last || ''}`.trim() || 'Unknown',
            email: submission.answers[5]?.answer || '',
            phone: `${submission.answers[6]?.answer?.area || ''} ${submission.answers[6]?.answer?.phone || ''}`,
            emiratesID: submission.answers[53]?.answer || '',
            passportNumber: submission.answers[56]?.answer || '',
            address: `${submission.answers[51]?.answer?.addr_line1 || ''}, ${submission.answers[51]?.answer?.city || ''}, ${submission.answers[51]?.answer?.country || ''}`,
            uaeResident: submission.answers[84]?.answer || '',
            brokerCompanyName: submission.answers[71]?.answer || '',
            agentName: `${submission.answers[78]?.answer?.first || ''} ${submission.answers[78]?.answer?.last || ''}`,
            imkanPropertyAdvisor: submission.answers[82]?.answer || '',
            emiratesIDAttachment: submission.answers[54]?.answer?.[0] || '',
            passportAttachment: submission.answers[57]?.answer?.[0] || '',
            visaFamilyBookAttachment: submission.answers[63]?.answer?.[0] || '',
            brokerTradeLicenseAttachment: submission.answers[79]?.answer?.[0] || '',
            brokerCardAttachment: submission.answers[81]?.answer?.[0] || '',
            tokenPaymentProofAttachment: submission.answers[86]?.answer?.[0] || '',
            answers: submission.answers,
            brokerCompanyLicense: submission.answers[87]?.answer || '',
            agentBrokerLicense: submission.answers[88]?.answer || '',
            leadSource: submission.answers[89]?.answer || '',
          }));
        setCustomers(processedCustomers);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchTerm.length > 2) {
      fetchCustomers(searchTerm);
    }
  }, [searchTerm, fetchCustomers]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTabSelect = (index) => {
    setActiveTab(index);
  };

  const renderAttachmentIcon = (params) => {
    return params.value ? (
      <a href={params.value} target="_blank" rel="noopener noreferrer">
        View Attachment
      </a>
    ) : 'N/A';
  };

  const columnDefs = [
    {
      headerName: '',
      field: 'id',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 62
    },
    { headerName: "Full Name", field: "fullName", cellStyle: { color: '#0070d2' } },
    { headerName: "Email", field: "email", cellStyle: { color: '#0070d2' } },
    { headerName: "Phone", field: "phone" },
    { headerName: "Emirates ID", field: "emiratesID" },
    { headerName: "Passport Number", field: "passportNumber" },
    { headerName: "Address", field: "address" },
    { headerName: "UAE Resident", field: "uaeResident" },
    { headerName: "Broker Company", field: "brokerCompanyName" },
    { headerName: "Agent Name", field: "agentName" },
    { headerName: "IMKAN Advisor", field: "imkanPropertyAdvisor" },
    { headerName: "Emirates ID", field: "emiratesIDAttachment", cellRenderer: renderAttachmentIcon },
    { headerName: "Passport", field: "passportAttachment", cellRenderer: renderAttachmentIcon },
    { headerName: "Visa/Family Book", field: "visaFamilyBookAttachment", cellRenderer: renderAttachmentIcon },
    { headerName: "Broker License", field: "brokerTradeLicenseAttachment", cellRenderer: renderAttachmentIcon },
    { headerName: "Broker Card", field: "brokerCardAttachment", cellRenderer: renderAttachmentIcon },
    { headerName: "Payment Proof", field: "tokenPaymentProofAttachment", cellRenderer: renderAttachmentIcon },
    { headerName: "Broker Company License", field: "brokerCompanyLicense" },
    { headerName: "Agent/Broker License", field: "agentBrokerLicense" },
    { headerName: "Lead Source", field: "leadSource" },
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  const onSelectionChanged = (event) => {
    const selectedRows = event.api.getSelectedRows();
    if (selectedRows.length > 0) {
      const fullCustomerData = customers.find(customer => customer.id === selectedRows[0].id);
      setSelectedCustomer(fullCustomerData);
    } else {
      setSelectedCustomer(null);
    }
  };

  const handleNext = () => {
    setActiveTab(prevTab => prevTab + 1);
  };

  const handlePrevious = () => {
    setActiveTab(prevTab => prevTab - 1);
  };

  const isDownPaymentValid = isDownPaymentCollected ? 
    (downPayment && paymentMode && paymentReference) : true;
  const isPaymentPlanValid = selectedPaymentPlan !== '';

  const paymentPlanOptions = [
    { id: '30/70 Discount Sales Price', label: '30:70 Full Payment on Completion', value: unit['30_70_sale_price'] },
    { id: '40/60 Discount Sales Price', label: '40:60 Full Payment on Completion', value: unit['40_60_full_comp_price'] },
    { id: '2 Year Post Handover Payment Plan', label: 'Post-Handover-2 Years Payment Plan', value: unit['post_2_year_payment_price'] },
    { id: '3 Year Post Handover Payment Plan', label: 'Post-Handover-3 Years Payment Plan', value: unit['post_3_year_payment_price'] },
    { id: '4 Year Post Handover Payment Plan', label: 'Post-Handover-4 Years Payment Plan', value: unit['post_4_year_payment_price'] },
  ].filter(option => option.value); // Only include plans that have a value

  const formatNumber = (value) => {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <IconSettings iconPath={`${process.env.PUBLIC_URL}/assets/icons`}>
      <PageHeader
        title={`Booking Wizard - Unit ${unit.unit_number}`}
        info={`${unit.unit_type}`}
        icon={
          <Icon
            category="standard"
            name="contract"
            size="medium"
          />
        }
        iconPosition="left"
      />
      <div className="slds-grid slds-grid_align-end slds-m-bottom_small">
        {activeTab > 0 && (
          <Button
            label="Previous"
            onClick={handlePrevious}
            className="slds-m-right_small"
          />
        )}
      </div>
      <Tabs id="booking-wizard-tabs" variant="scoped" selectedIndex={activeTab} onSelect={handleTabSelect}>
        <TabsPanel label="1. Down Payment">
          <div className="slds-p-around_medium">
            <p className="slds-m-bottom_small">Did you collect a down payment for this booking?</p>
            <Checkbox
              assistiveText={{ label: 'Down payment collected' }}
              id="down-payment-collected"
              labels={{ label: 'Down payment collected' }}
              checked={isDownPaymentCollected}
              onChange={(e) => setIsDownPaymentCollected(e.target.checked)}
            />
            {isDownPaymentCollected && (
              <>
                <Input
                  id="down-payment"
                  label="Down Payment Amount"
                  placeholder="Enter amount"
                  value={downPayment}
                  onChange={(event) => setDownPayment(formatNumber(event.target.value))}
                />
                <Combobox
                  id="payment-mode"
                  labels={{label: 'Mode of Payment'}}
                  options={[
                    { id: 'cash', label: 'Cash' },
                    { id: 'card', label: 'Card' },
                    { id: 'bank_transfer', label: 'Bank Transfer' },
                    { id: 'cheque', label: 'Bank Cheque' },
                  ]}
                  value={paymentMode}
                  events={{
                    onSelect: (event, data) => setPaymentMode(data.selection[0].id),
                  }}
                />
                <Input
                  id="payment-reference"
                  label="Payment Reference Number"
                  placeholder="Enter reference number"
                  value={paymentReference}
                  onChange={(event) => setPaymentReference(event.target.value)}
                  required
                />
              </>
            )}
            <Button
              label="Proceed to Payment Plan"
              onClick={handleNext}
              disabled={!isDownPaymentValid || !paymentReference}
              className="slds-m-top_medium"
              variant="brand"
            />
          </div>
        </TabsPanel>
        <TabsPanel label="2. Payment Plan">
          <div className="slds-p-around_medium">
            <Combobox
              id="payment-plan"
              labels={{label: 'Select Payment Plan'}}
              options={paymentPlanOptions.map(option => ({
                ...option,
                label: `${option.label} - AED ${option.value.toLocaleString()}`
              }))}
              value={selectedPaymentPlan}
              events={{
                onSelect: (event, data) => {
                  setSelectedPaymentPlan(data.selection[0].id);
                  setSelectedPaymentPlanPrice(data.selection[0].value);
                },
              }}
            />
            {selectedPaymentPlanPrice && (
              <p className="slds-m-top_small">
                Selected Plan Price: AED {selectedPaymentPlanPrice.toLocaleString()}
              </p>
            )}
            <div className="slds-grid slds-grid_align-spread slds-m-top_medium">
              <Button
                label="Proceed to Customer Selection"
                onClick={handleNext}
                disabled={!isPaymentPlanValid}
                variant="brand"
              />
            </div>
          </div>
        </TabsPanel>
        <TabsPanel label="3. Select Customer">
          <div className="slds-p-around_medium">
            <Input
              id="customer-search"
              label="Search Customer"
              placeholder="Type to search..."
              onChange={handleSearch}
            />
            <div style={{ height: '400px', width: '100%' }} className="ag-theme-alpine">
              <AgGridReact
                columnDefs={columnDefs}
                rowData={customers}
                defaultColDef={defaultColDef}
                rowSelection="single"
                onSelectionChanged={onSelectionChanged}
                suppressRowClickSelection={true}
                pagination={true}
                paginationPageSize={10}
                domLayout='normal'
              />
            </div>
            <div className="slds-grid slds-grid_align-start slds-m-top_medium">
              <Button
                label="Proceed to Unit Booking Form"
                onClick={handleNext}
                disabled={!selectedCustomer}
                variant="brand"
                iconCategory="utility"
                iconName="forward"
                iconPosition="right"
              />
            </div>
          </div>
        </TabsPanel>
        <TabsPanel label="4. Booking Form">
          <div className="slds-p-around_medium" style={{ height: 'calc(100vh - 100px)', overflowY: 'auto' }}>
            {selectedCustomer && (
              <JotFormBooking
                unit={unit}
                salespersonEmail={salespersonEmail}
                onSubmit={onSubmit}
                customerData={{...selectedCustomer, unitData: unit}}
                selectedPaymentPlan={selectedPaymentPlan}
                selectedPaymentPlanPrice={selectedPaymentPlanPrice}
                downPayment={downPayment}
                paymentMode={paymentMode}
              />
            )}
          </div>
        </TabsPanel>
      </Tabs>
    </IconSettings>
  );
};

export default BookingWizard;