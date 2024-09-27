import React from 'react';
import { useNavigate } from 'react-router-dom';
import IconSettings from '@salesforce/design-system-react/components/icon-settings';
import VisualPicker from '@salesforce/design-system-react/components/visual-picker';
import Icon from '@salesforce/design-system-react/components/icon';

const AdminSelectionPage = () => {
  const navigate = useNavigate();

  const handleSelection = (option) => {
    if (option === 'booking') {
      navigate('/reservation');
    } else if (option === 'manage') {
      navigate('/manage-data');
    }
  };

  return (
    <IconSettings iconPath={`${process.env.PUBLIC_URL}/assets/icons`}>
      <div className="slds-p-around_medium">
        <h1 className="slds-text-heading_large slds-m-bottom_medium">Admin Dashboard</h1>
        <div className="slds-grid slds-gutters slds-wrap slds-grid_align-center">
          <div className="slds-col slds-size_1-of-2 slds-medium-size_1-of-3 slds-large-size_1-of-4">
            <VisualPicker
              label="Property Booking System"
              coverable
              onSelect={() => handleSelection('booking')}
            >
              <Icon
                category="standard"
                name="home"
                size="large"
              />
            </VisualPicker>
          </div>
          <div className="slds-col slds-size_1-of-2 slds-medium-size_1-of-3 slds-large-size_1-of-4">
            <VisualPicker
              label="Manage Brokers, Customers & Booking Data"
              coverable
              onSelect={() => handleSelection('manage')}
            >
              <Icon
                category="standard"
                name="people"
                size="large"
              />
            </VisualPicker>
          </div>
        </div>
      </div>
    </IconSettings>
  );
};

export default AdminSelectionPage;