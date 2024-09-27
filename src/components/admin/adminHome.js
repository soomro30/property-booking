import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import IconSettings from '@salesforce/design-system-react/components/icon-settings';
import VerticalNavigation from '@salesforce/design-system-react/components/vertical-navigation';
import { Card } from '@salesforce/design-system-react';
import AdminProperties from './Properties';
import AdminFloors from './Floors';
import AdminUnits from './Units';
import AdminBedrooms from './Bedrooms';
import AdminUnitTypes from './UnitTypes';
import BrandBand from '@salesforce/design-system-react/components/brand-band';
import AdminBrokers from './admin_data/brokers';
import AdminDirectClients from './admin_data/direct_clients';
import AdminBookings from './admin_data/bookings';
import Icon from '@salesforce/design-system-react/components/icon';
import PageHeader from '@salesforce/design-system-react/components/page-header';

import './admin.css';
const AdminHome = () => {
  const navigate = useNavigate();
  const [selectedComponentId, setSelectedComponentId] = useState(null);

  const categories = useMemo(() => [
    {
      id: 'properties',
      label: 'Properties Master',
      items: [
        { id: 'properties', label: ' Projects', component: AdminProperties, icon: <Icon category="standard" name="home" size="small" style={{ aspectRatio: '1/1', width: '1.5rem', height: '1.5rem', marginRight: '0.5rem' }} /> },
        { id: 'units', label: ' Property Units Inventory', component: AdminUnits, icon: <Icon category="standard" name="household" size="small" style={{ aspectRatio: '1/1', width: '1.5rem', height: '1.5rem', marginRight: '0.5rem' }} /> },
      ],
    },
    {
      id: 'unit-details',
      label: 'Unit Details',
      items: [
        { id: 'bedrooms', label: ' Bedrooms', component: AdminBedrooms, icon: <Icon category="standard" name="account" size="small" style={{ aspectRatio: '1/1', width: '1.5rem', height: '1.5rem', marginRight: '0.5rem' }} /> },
        { id: 'unit-types', label: ' Unit Types', component: AdminUnitTypes, icon: <Icon category="standard" name="custom" size="small" style={{ aspectRatio: '1/1', width: '1.5rem', height: '1.5rem', marginRight: '0.5rem' }} /> },
        { id: 'floors', label: 'Floors', component: AdminFloors, icon: <Icon category="standard" name="hierarchy" size="small" style={{ aspectRatio: '1/1', width: '1.5rem', height: '1.5rem', marginRight: '0.5rem' }} /> },
      ],
    },
    {
      id: 'data',
      label: 'Data Management',
      items: [
        { id: 'brokers-submissions', label: ' Brokers Submissions', component: AdminBrokers, icon: <Icon category="standard" name="file" size="small" style={{ aspectRatio: '1/1', width: '1.5rem', height: '1.5rem', marginRight: '0.5rem' }} /> },
        { id: 'direct-clients-submissions', label: ' Direct Clients Submissions', component: AdminDirectClients, icon: <Icon category="standard" name="client" size="small" style={{ aspectRatio: '1/1', width: '1.5rem', height: '1.5rem', marginRight: '0.5rem' }} /> },
        { id: 'property-bookings', label: ' Property Bookings', component: AdminBookings, icon: <Icon category="standard" name="record" size="small" style={{ aspectRatio: '1/1', width: '1.5rem', height: '1.5rem', marginRight: '0.5rem' }} /> },
      ],
    },
  ], []);

  const handleSelect = (event, data) => {
    if (data.item && data.item.id) {
      setSelectedComponentId(data.item.id);
    }
  };

  const selectedComponent = useMemo(() => {
    if (!selectedComponentId) return null;
    for (const category of categories) {
      for (const item of category.items) {
        if (item.id === selectedComponentId) {
          return item;
        }
      }
    }
    return null;
  }, [selectedComponentId, categories]);

  return (
    <IconSettings iconPath={`${process.env.PUBLIC_URL}/assets/icons`}>
      <BrandBand
        className="custom-brand-band-class"
        id="brand-band-large"
        size="large"
      />
      <div className="slds-container_x-large slds-container_center" style={{ width: '100%', maxWidth: '100%', margin: '0 auto' }}>
        <div className="slds-grid slds-wrap">
          <div className="slds-col slds-size_1-of-6" style={{ backgroundColor: 'white', padding: '1rem' }}>
            <Card>
              <VerticalNavigation
                id="admin-vertical-navigation"
                categories={categories}
                onSelect={handleSelect}
              />
            </Card>
          </div>
          <div className="slds-col slds-size_5-of-6 slds-p-around_medium" style={{ backgroundColor: 'white' }}>
            {selectedComponent ? (
              <>
                <PageHeader
                  title={selectedComponent.label}
                  icon={
                    <Icon
                      assistiveText={{ label: selectedComponent.label }}
                      category={selectedComponent.icon.props.category}
                      name={selectedComponent.icon.props.name}
                      size="large"
                    />
                  }
                />
                {React.createElement(selectedComponent.component)}
              </>
            ) : (
              <div className="slds-m-around_medium">
                <PageHeader
                  title="Welcome to Admin Dashboard"
                  icon={
                    <Icon
                      assistiveText={{ label: 'Admin Dashboard' }}
                      category="standard"
                      name="home"
                      size="large"
                      label="Record Type"
                    />
                  }
                />
                <p className="slds-text-body_regular slds-m-top_medium">
                  Use the navigation menu on the left to manage various aspects of the Property Reservation System.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </IconSettings>
  );
};

export default AdminHome;
