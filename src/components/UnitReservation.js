import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Combobox from '@salesforce/design-system-react/components/combobox';
import Icon from '@salesforce/design-system-react/components/icon';
import comboboxFilterAndLimit from '@salesforce/design-system-react/components/combobox/filter';
import IconSettings from '@salesforce/design-system-react/components/icon-settings';
import BrandBand from '@salesforce/design-system-react/components/brand-band';
import InteractiveFloorPlan from './InteractiveFloorPlan';
import BookingForm from './BookingForm';
// import ActiveFilters from './ActiveFilters';
// import FilterContent from './FilterContent';
import Modal from '@salesforce/design-system-react/components/modal';
import Card from '@salesforce/design-system-react/components/card';
import UnitListView from './UnitListView';
import UnitGridView from './UnitGridView';

const UnitReservation = ({ 
  properties,
  selectedProperty,
  handlePropertySelect,
  floorData,
  handleUnitSelect,
  selectedUnit,
  handleBookClick,
  bookingUnit,
  handleBookingComplete,
  allUnits,
  isFloorPlanShown,
  user
}) => {
  console.log("User in UnitReservation:", user);

  const units = allUnits || (floorData ? floorData.units : []);

  const [filterOptions, setFilterOptions] = useState({
    floors: [],
    bedrooms: [],
    unitTypes: [],
    maxPrice: 1000000,
    maxArea: 5000
  });

  const [filters, setFilters] = useState({
    floor: '',
    bedrooms: '',
    unitType: '',
    priceRange: [0, 1000000],
    areaRange: [0, 5000],
    status: ''
  });

  const [filteredUnits, setFilteredUnits] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selection, setSelection] = useState([]);

  useEffect(() => {
    if (floorData && floorData.units && floorData.units.length > 0) {
      console.log("Floor data received:", floorData);
      const units = floorData.units;
      
      units.forEach(unit => {
        console.log("Unit:", unit.unit_number, "Bedrooms:", unit.number_of_bedrooms?.number_of_bedrooms, "Unit Type:", unit.unit_type?.name);
      });

      const options = {
        floors: [...new Set(units.map(unit => unit.floor?.floor_number).filter(Boolean))].sort((a, b) => a - b),
        bedrooms: [...new Set(units.map(unit => unit.number_of_bedrooms?.number_of_bedrooms).filter(Boolean))].sort((a, b) => a - b),
        unitTypes: [...new Set(units.map(unit => unit.unit_type?.name).filter(Boolean))].sort(),
        maxPrice: Math.max(...units.map(unit => parseFloat(unit.price) || 0)),
        maxArea: Math.max(...units.map(unit => unit.square_footage || 0)),
      };
      console.log("Filter options:", options);
      setFilterOptions(options);
      setFilters(prev => ({
        ...prev,
        priceRange: [0, options.maxPrice],
        areaRange: [0, options.maxArea],
      }));
      setFilteredUnits(units);
    } else {
      console.log("No floor data or units available");
      setFilterOptions({
        floors: [],
        bedrooms: [],
        unitTypes: [],
        maxPrice: 1000000,
        maxArea: 5000
      });
      setFilteredUnits([]);
    }
  }, [floorData]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const applyFilters = () => {
    console.log("Applying filters:", filters);
    const filtered = floorData.units.filter((unit) => {
      return (
        (filters.floor === '' || unit.floor?.floor_number === parseInt(filters.floor)) &&
        (filters.bedrooms === '' || unit.number_of_bedrooms?.number_of_bedrooms === parseInt(filters.bedrooms)) &&
        (filters.unitType === '' || unit.unit_type?.name === filters.unitType) &&
        (parseFloat(unit.price) >= filters.priceRange[0] && parseFloat(unit.price) <= filters.priceRange[1]) &&
        (unit.square_footage >= filters.areaRange[0] && unit.square_footage <= filters.areaRange[1]) &&
        (filters.status === '' || unit.status === filters.status)
      );
    });
    console.log("Filtered units:", filtered);
    setFilteredUnits(filtered);
    setIsFilterModalOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({
      floor: '',
      bedrooms: '',
      unitType: '',
      priceRange: [0, filterOptions.maxPrice],
      areaRange: [0, filterOptions.maxArea],
      status: ''
    });
  };

  const onUnitSelect = (unit) => {
    handleUnitSelect(unit);
  };

  const headingText = selectedProperty?.name ? `${selectedProperty.name} Units Booking System` : "Property Units Booking System";

  const propertiesWithIcon = properties.map((property) => ({
    id: property.id,
    label: property.name,
    icon: (
      <Icon
        assistiveText={{ label: 'Account' }}
        category="standard"
        name="account"
      />
    ),
  }));

  return (
    <IconSettings iconPath={`${process.env.PUBLIC_URL}/assets/icons`}>
      <Box className="slds-p-around_medium">
        <BrandBand
          className="custom-brand-band-class"
          id="brand-band-large"
          size="large"
        />
        <div className="slds-container_x-large slds-container_center" style={{ width: '100%', maxWidth: '100%', margin: '0 auto' }}>
          <div className="slds-grid slds-grid_vertical">
            <Card
              id="ExampleCard"
              heading={headingText}
              icon={<Icon category="standard" name="home" size="small" />}
            >
              <div className="slds-m-top_medium" style={{ maxWidth: '400px', margin: '0rem auto 0' }}>
                <Combobox
                  id="property-select-combobox"
                  events={{
                    onChange: (event, { value }) => {
                      setInputValue(value);
                    },
                    onRequestRemoveSelectedOption: (event, data) => {
                      setInputValue('');
                      setSelection([]);
                      handlePropertySelect(null);
                    },
                    onSelect: (event, data) => {
                      const selectedProperty = properties.find(p => p.id === data.selection[0].id);
                      handlePropertySelect(selectedProperty);
                      setInputValue(selectedProperty.name);
                      setSelection([data.selection[0]]);
                    },
                  }}
                  labels={{
                    label: (
                      <span>
                        <Icon
            category="standard"
            name="contact_list"
            size="small"
            className="slds-m-right_x-small"
          />
                        Search the project and see the available units to book
                      </span>
                    ),
                    placeholder: 'Select the project',
                  }}
                  menuItemVisibleLength={5}
                  options={comboboxFilterAndLimit({
                    inputValue: inputValue,
                    limit: 10,
                    options: propertiesWithIcon,
                    selection
                  })}
                  selection={selection}
                  value={inputValue}
                  variant="inline-listbox"
                  multiple={false}
                  renderIcon={(option) => (
                    <Icon
                      category="standard"
                      name="home"
                      size="small"
                      className="slds-m-right_x-small"
                    />
                  )}
                />
              </div>
            </Card>
          </div>
          
          {floorData && (
            <div className="slds-m-top_medium">
              {/* <ActiveFilters filters={filters} filterOptions={filterOptions} /> */}
              <InteractiveFloorPlan 
                floorData={{...floorData, units: filteredUnits}} 
                onUnitSelect={onUnitSelect}
                onBookUnit={handleBookClick}
                isFloorPlanShown={isFloorPlanShown}
                selectedProperty={selectedProperty}
                user={user || {}} // Provide a default empty object if user is null
                userEmail={user?.email || ''} // Use optional chaining and provide a default value
              />
            </div>
          )}
        </div>
        
        {bookingUnit && (
          <div className="slds-container_x-large slds-container_center slds-p-around_medium">
            <BookingForm unit={bookingUnit} onBookingComplete={handleBookingComplete} />
          </div>
        )}
        
        <Modal
          isOpen={isFilterModalOpen}
          onRequestClose={() => setIsFilterModalOpen(false)}
          heading="Filters"
          size="medium"
        >
          {/* <section className="slds-p-around_medium">
            <FilterContent 
              filters={filters}
              filterOptions={filterOptions}
              handleFilterChange={handleFilterChange}
              applyFilters={applyFilters}
              handleClearFilters={handleClearFilters}
            />
          </section> */}
        </Modal>
      </Box>
    </IconSettings>
  );
};

export default UnitReservation;