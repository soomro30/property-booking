import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BookingWizard from '../components/BookingWizard';
import Button from '@salesforce/design-system-react/components/button';
import IconSettings from '@salesforce/design-system-react/components/icon-settings';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { unit, salespersonEmail } = location.state || {};

  const handleSubmit = (unitId) => {
    console.log('Booking submitted for unit:', unitId);
    navigate('/'); // Navigate back to the main page after submission
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  if (!unit || !salespersonEmail) {
    return <div>Error: Missing unit or salesperson information</div>;
  }

  return (
    <IconSettings iconPath={`${process.env.PUBLIC_URL}/assets/icons`}>
      <div className="slds-p-around_medium">
        <div className="slds-grid slds-gutters slds-m-bottom_medium">
          <div className="slds-col">
            <Button
              label="Back to Units List"
              onClick={handleBack}
              iconCategory="utility"
              iconName="back"
              iconPosition="left"
            />
          </div>
          <div className="slds-col">
            <h1 className="slds-text-heading_large">
             Property Booking Form for Unit: {unit.unit_number}, {unit.unit_type}
            </h1>
          </div>
        </div>
        <BookingWizard
          unit={unit}
          salespersonEmail={salespersonEmail}
          onSubmit={handleSubmit}
          onClose={handleBack}
        />
      </div>
    </IconSettings>
  );
};

export default BookingPage;