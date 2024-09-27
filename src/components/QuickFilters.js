import React, { useState, useEffect } from 'react';
import Button from '@salesforce/design-system-react/components/button';
import ButtonGroup from '@salesforce/design-system-react/components/button-group';
import Dropdown from '@salesforce/design-system-react/components/menu-dropdown';
import Icon from '@salesforce/design-system-react/components/icon';
import IconSettings from '@salesforce/design-system-react/components/icon-settings';
import PageHeader from '@salesforce/design-system-react/components/page-header';
import PageHeaderControl from '@salesforce/design-system-react/components/page-header/control';

const FilterDropdown = ({ label, options, value, onChange }) => (
  <Dropdown
    align="right"
    buttonVariant="neutral"
    iconCategory="utility"
    iconName="down"
    label={`${label}: ${value || 'All'}`}
    onSelect={(option) => onChange(option.value)}
    options={[
      { label: 'All', value: null },
      { type: 'divider' },
      ...(options || []).map(option => ({
        label: option.label,
        value: option.value,
        isSelected: value === option.value
      }))
    ]}
  />
);

const QuickFilters = ({ 
  onFilter, 
  activeFilters, 
  floorOptions, 
  unitTypeOptions, 
  onSearch,
  searchTerm,
  totalUnits,
  filteredUnits,
  onClearFilters,
  units = [], // Provide a default empty array
  bedroomOptions, // Import bedroomOptions from InteractiveFloorPlan.js
  user // Add user prop to get current logged in user
}) => {
  const [amenities, setAmenities] = useState([]);

  useEffect(() => {
    if (units.length > 0) {
      const uniqueAmenities = [...new Set(units.flatMap(unit => unit.amenities ? unit.amenities.split(',') : []))].sort();
      setAmenities(uniqueAmenities);
    }
  }, [units]);

  const handleFilter = (type, value) => {
    onFilter(type, value);
  };

  const amenitiesOptions = [...new Set(units.map(unit => unit.amenities))]
    .filter(amenity => amenity !== undefined && amenity !== null && amenity !== '')
    .sort()
    .map(amenity => ({ value: amenity, label: amenity }));

  const statusOptions = [
    { value: 'Available', label: 'Available', icon: 'success' },
    { value: 'Sold', label: 'Sold', icon: 'ban' },
    { value: 'Booked', label: 'Booked', icon: 'check' },
    { value: 'Blocked', label: 'Blocked', icon: 'lock' },
    { value: 'Reserved', label: 'Reserved', icon: 'clock' },
  ];

  const handleClearAllFilters = () => {
    if (typeof onClearFilters === 'function') {
      onClearFilters();
    } else {
      console.warn('onClearFilters is not a function');
    }
    onSearch('');  // Reset search term
    // Reset all quick filters
    handleFilter('floor', null);
    handleFilter('unitType', null);
    handleFilter('bedrooms', null);
    handleFilter('amenities', null);
    handleFilter('status', null);
    handleFilter('blocked_by_email', null);
  };

  const actions = () => (
    <React.Fragment>
      <PageHeaderControl>
        <div className="slds-form-element">
          <div className="slds-form-element__control slds-input-has-icon slds-input-has-icon_left">
            <Icon category="utility" name="search" className="slds-input__icon slds-input__icon_left" />
            <input
              type="search"
              id="search-units"
              className="slds-input slds-input_small"
              placeholder="Search units"
              value={searchTerm}
              onChange={(event) => onSearch(event.target.value)}
            />
          </div>
        </div>
      </PageHeaderControl>
      <PageHeaderControl>
        <ButtonGroup>
          <FilterDropdown
            label="Floor"
            options={floorOptions}
            value={activeFilters.floor}
            onChange={(value) => handleFilter('floor', value)}
          />
          <FilterDropdown
            label="Unit Type"
            options={unitTypeOptions}
            value={activeFilters.unitType}
            onChange={(value) => handleFilter('unitType', value)}
          />
          <FilterDropdown
            label="Bedrooms"
            options={bedroomOptions}
            value={activeFilters.bedrooms}
            onChange={(value) => handleFilter('bedrooms', value)}
          />
          <FilterDropdown
            label="View"
            options={amenitiesOptions}
            value={activeFilters.amenities}
            onChange={(value) => handleFilter('amenities', value)}
          />
        </ButtonGroup>
      </PageHeaderControl>
      <PageHeaderControl>
        <ButtonGroup>
          {statusOptions.map((status) => (
            <Button
              key={status.value}
              icon={<Icon category="utility" name={status.icon} size="xx-small" />}
              iconPosition="left"
              variant={activeFilters.status === status.value ? 'brand' : 'neutral'}
              onClick={() => {
                handleFilter('status', status.value);
                console.log('User email:', user.email);
                if (status.value === 'Blocked') {
                  handleFilter('blocked_by_email', user.email);
                } else {
                  handleFilter('blocked_by_email', null);
                }
              }}
            >
              {status.label}
            </Button>
          ))}
        </ButtonGroup>
      </PageHeaderControl>
      <PageHeaderControl>
        <Button
          label="Clear All Filters"
          onClick={handleClearAllFilters}
          variant="neutral"
        />
      </PageHeaderControl>
    </React.Fragment>
  );

  const details = [
    {
      label: 'Units',
      content: `Showing ${filteredUnits} of ${totalUnits} units`,
    },
  ];

  return (
    <IconSettings iconPath={`${process.env.PUBLIC_URL}/assets/icons`}>
      <PageHeader
        icon={<Icon category="standard" name="filter" />}
        title="Quick Filters"
        details={details}
        onRenderActions={actions}
        variant="object-home"
      />
    </IconSettings>
  );
};

export default QuickFilters;
