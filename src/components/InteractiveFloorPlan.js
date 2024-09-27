import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import UnitDetailsPopup from './UnitDetailsPopup';
import UnitLayoutModal from './UnitLayoutModal';
import QuickFilters from './QuickFilters';
import UnitListView from './UnitListView';
import UnitGridView from './UnitGridView';
import PaymentPlanCalculator from './PaymentPlanCalculator';
import { generateSalesOffer } from '../services/salesOfferService';
import { useNavigate } from 'react-router-dom';
import SalesOfferButton from './SalesOfferButton';
import BookingWizard from './BookingWizard';

// SLDS imports
import IconSettings from '@salesforce/design-system-react/components/icon-settings';
import Card from '@salesforce/design-system-react/components/card';
import Button from '@salesforce/design-system-react/components/button';
import Icon from '@salesforce/design-system-react/components/icon';
import Modal from '@salesforce/design-system-react/components/modal';

const getStatusColor = (status) => {
  switch (status) {
    case 'Available':
      return '#4caf50'; // Green
    case 'Sold':
      return '#f44336'; // Red
    case 'Booked':
      return '#ffeb3b'; // Yellow
    case 'Reserved':
      return '#FFA500'; // Orange
    default:
      return '#9e9e9e'; // Default Grey
  }
};

const getContrastColor = (hexColor) => {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for bright colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

const normalizeUnitData = (unit) => {
  console.log('Raw unit data:', unit);  // Add this line to log the raw data
  return {
    ...unit,
    unit_type: unit.unit_type?.name || 'N/A',
    number_of_bedrooms: unit.bedroom?.number_of_bedrooms || 'N/A'
  };
};

const InteractiveFloorPlan = ({ 
  floorData, 
  onUnitSelect, 
  isFloorPlanShown, 
  selectedProperty,
  user,
  userEmail
}) => {
  const [units, setUnits] = useState([]);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeFilters, setActiveFilters] = useState({ 
    bedrooms: null, 
    sort: null,
    floor: null,
    status: null,
    unitType: null,
    release: null,
    amenities: null
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedUnit, setHighlightedUnit] = useState(null);
  const [layoutModalOpen, setLayoutModalOpen] = useState(false);
  const [selectedLayoutUnit, setSelectedLayoutUnit] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [paymentPlanOpen, setPaymentPlanOpen] = useState(false);
  const [selectedPaymentPlanUnit, setSelectedPaymentPlanUnit] = useState(null);
  const navigate = useNavigate();
  const [isGridView, setIsGridView] = useState(isFloorPlanShown);
  const [userRole, setUserRole] = useState(null);

  // Safely access user email and role
  const safeUserEmail = user?.email || '';
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch user role from public.profiles table
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user && user.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
        } else if (data) {
          setUserRole(data.role);
          setIsAdmin(data.role === 'admin');
        }
      }
    };

    fetchUserRole();
  }, [user]);

  console.log("User role:", userRole);
  console.log("Is admin:", isAdmin);
  console.log("Safe user email:", safeUserEmail);

  // Filter units based on user role and email
  const visibleUnits = useMemo(() => {
    console.log("Filtering units. Is admin:", isAdmin);
    if (!filteredUnits) return [];
    if (isAdmin) {
      console.log("Admin user, showing all units:", filteredUnits.length);
      return filteredUnits;
    } else {
      const filtered = filteredUnits.filter(unit => 
        unit.status === 'Available' || 
        (unit.status === 'Reserved' && unit.reserved_by_email === safeUserEmail)
      );
      console.log("Non-admin user, showing filtered units:", filtered.length);
      return filtered;
    }
  }, [filteredUnits, isAdmin, safeUserEmail]);

  const getUnitColor = useCallback((unit) => {
    if (unit.status === 'Available') {
      return '#90EE90'; // Light green
    } else if (unit.status === 'Sold') {
      return '#FF6961'; // Light red
    } else if (unit.status === 'Reserved') {
      // Change color to yellow if reserved by the current user
      return unit.reserved_by_email === safeUserEmail ? '#FFFF00' : '#FFA500'; // Yellow if reserved by user, orange otherwise
    }
    return '#FFFFFF'; // White for unknown status
  }, [safeUserEmail]);

  const floorOptions = useMemo(() => {
    return [...new Set(units.filter(unit => unit && unit.floor?.floor_number !== undefined)
      .map(unit => unit.floor.floor_number))]
      .sort((a, b) => a - b)
      .map(floorNumber => ({ value: floorNumber, label: floorNumber.toString() }));
  }, [units]);

  const unitTypeOptions = useMemo(() => 
    [...new Set(units.map(unit => unit?.unit_type || 'N/A'))]
      .sort()
      .map(type => ({ value: type, label: type })),
    [units]
  );

  const releaseOptions = useMemo(() => 
    [...new Set(units.map(unit => unit?.release || 'N/A'))]
      .sort()
      .map(release => ({ value: release, label: release })),
    [units]
  );

  const bedroomOptions = useMemo(() => 
    [...new Set(units.map(unit => unit?.bedroom?.number_of_bedrooms))]
      .filter(bedrooms => bedrooms !== undefined && bedrooms !== null)
      .sort((a, b) => a - b)
      .map(bedrooms => ({ value: bedrooms, label: `${bedrooms} BR` })),
    [units]
  );

  const amenitiesOptions = useMemo(() => 
    [...new Set(units.flatMap(unit => unit?.amenities ? unit.amenities.split(',') : []))]
      .sort()
      .map(amenity => ({ value: amenity, label: amenity })),
    [units]
  );

  const fetchUnits = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('units')
        .select(`
          *,
          unit_type:unit_types(name),
          bedroom:bedrooms(number_of_bedrooms),
          floor:floors(id, floor_number)
        `)
        .eq('property_id', selectedProperty.id);
      
      if (error) throw error;
      
      const normalizedUnits = data.map(normalizeUnitData);
      setUnits(normalizedUnits);
      setFilteredUnits(normalizedUnits);
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  }, [selectedProperty]);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  useEffect(() => {
    const unitsChannel = supabase
      .channel('units_channel')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'units' 
        }, 
        (payload) => {
          console.log('Real-time update received:', payload);
          handleRealTimeUpdate(payload);
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      supabase.removeChannel(unitsChannel);
    };
  }, []);

  const handleRealTimeUpdate = useCallback((payload) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    setUnits(currentUnits => {
      const updatedUnits = currentUnits.map(unit => {
        if (unit.id === newRecord.id) {
          return { ...unit, ...newRecord };
        }
        return unit;
      });
      return updatedUnits;
    });

    setFilteredUnits(currentFilteredUnits => {
      const updatedFilteredUnits = currentFilteredUnits.map(unit => {
        if (unit.id === newRecord.id) {
          return { ...unit, ...newRecord };
        }
        return unit;
      });
      return updatedFilteredUnits;
    });

    if (oldRecord && newRecord && oldRecord.status !== newRecord.status) {
      console.log(`Unit ${newRecord.unit_number} status changed from ${oldRecord.status} to ${newRecord.status}`);
      setHighlightedUnit(newRecord.id);
      setTimeout(() => setHighlightedUnit(null), 3000);
    }
  }, []);

  const handleUnitClick = useCallback((event, unit) => {
    if (unit.status === 'Blocked' && unit.blocked_by !== user?.id) {
      // Show a message that the unit is blocked
      console.log('This unit is blocked by another salesperson');
      return;
    }
    setSelectedUnit(unit);
    setAnchorEl(event.currentTarget);
    onUnitSelect(unit);
  }, [onUnitSelect, user]);

  const handleClosePopup = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleBookUnit = useCallback((unit) => {
    console.log('Booking unit:', unit);
    navigate('/booking', { state: { unit, salespersonEmail: user.email } });
  }, [navigate, user]);

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    const lowercasedValue = value.toLowerCase().trim();
    const filtered = units.filter(unit => 
      unit.unit_number.toLowerCase().includes(lowercasedValue) ||
      unit.unit_type.toLowerCase().includes(lowercasedValue) ||
      unit.status.toLowerCase().includes(lowercasedValue)
    );
    setFilteredUnits(filtered);
  }, [units]);

  const handleFilter = useCallback((type, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [type]: value
    }));
  }, []);

  useEffect(() => {
    let filtered = [...units];

    // Apply search filter
    if (searchTerm) {
      const lowercasedValue = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(unit => 
        unit.unit_number.toLowerCase().includes(lowercasedValue) ||
        unit.unit_type.toLowerCase().includes(lowercasedValue) ||
        unit.status.toLowerCase().includes(lowercasedValue)
      );
    }

    // Apply other filters
    if (activeFilters.floor) {
      filtered = filtered.filter(unit => unit.floor?.floor_number === activeFilters.floor);
    }
    if (activeFilters.unitType) {
      filtered = filtered.filter(unit => unit.unit_type === activeFilters.unitType);
    }
    if (activeFilters.bedrooms) {
      filtered = filtered.filter(unit => unit.bedroom?.number_of_bedrooms === activeFilters.bedrooms);
    }
    if (activeFilters.release) {
      filtered = filtered.filter(unit => unit.release === activeFilters.release);
    }
    if (activeFilters.status) {
      filtered = filtered.filter(unit => unit.status === activeFilters.status);
    }
    if (activeFilters.amenities) {
      filtered = filtered.filter(unit => unit.amenities && unit.amenities.includes(activeFilters.amenities));
    }

    setFilteredUnits(filtered);
  }, [units, searchTerm, activeFilters]);

  const handleSort = useCallback((field, direction) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(direction);
    }
    // Implement your sorting logic here
  }, [sortField]);

  const handleClearFilters = useCallback(() => {
    setActiveFilters({ bedrooms: null, sort: null, floor: null, status: null, unitType: null, release: null, amenities: null });
  }, []);

  const handleLayoutClick = useCallback(async (event, unit) => {
    event.stopPropagation();
    console.log('Layout clicked for unit:', unit);
    try {
      const { data, error } = await supabase
        .from('units')
        .select(`
          *,
          unit_type:unit_type_id(file_path)
        `)
        .eq('id', unit.id)
        .single();

      if (error) throw error;
      
      console.log('Fetched unit data:', data);
      setSelectedLayoutUnit(data);
      setLayoutModalOpen(true);
    } catch (error) {
      console.error('Error fetching unit details:', error);
    }
  }, []);

  const handleLayoutModalClose = useCallback(() => {
    setLayoutModalOpen(false);
    setSelectedLayoutUnit(null);
  }, []);

  const handlePaymentPlanClick = useCallback((event, unit) => {
    event.stopPropagation();
    setSelectedPaymentPlanUnit({
      ...unit,
      unit_type: unit.unit_type?.name || 'N/A'
    });
    setPaymentPlanOpen(true);
  }, []);

  const canReserve = useCallback((unit) => {
    return unit.status === 'Available';
  }, []);

  const canBook = useCallback((unit) => {
    return unit.status === 'Reserved' && unit.reserved_by_email === user.email;
  }, [user.email]);

  const handleGenerateSalesOffer = useCallback(async (unit) => {
    try {
      await generateSalesOffer(unit, selectedProperty);
    } catch (error) {
      console.error('Error generating sales offer:', error);
      // You can show an error message to the user here, e.g. using a snackbar or alert
      // For example, if you're using Material-UI:
      // enqueueSnackbar(error.message, { variant: 'error' });
    }
  }, [selectedProperty]);

  const handleReserveUnit = useCallback(async (unit) => {
    try {
      const reservationTime = new Date().toISOString();
      const { data, error } = await supabase
        .from('units')
        .update({ status: 'Reserved', reserved_by_email: user.email, reservation_time: reservationTime })
        .eq('id', unit.id);

      if (error) throw error;

      console.log(`Unit ${unit.unit_number} reserved successfully`, data);

      fetchUnits();

    } catch (error) {
      console.error('Error reserving unit:', error);
    }
  }, [user, fetchUnits]);

  useEffect(() => {
    console.log('Units state updated:', units);
  }, [units]);

  useEffect(() => {
    console.log('FilteredUnits state updated:', filteredUnits);
  }, [filteredUnits]);

  useEffect(() => {
    console.log('filteredUnits updated:', filteredUnits);
    if (!Array.isArray(filteredUnits)) {
      console.warn('filteredUnits is not an array, initializing as empty array');
      setFilteredUnits([]);
    }
  }, [filteredUnits]);

  useEffect(() => {
    console.log('Units or filteredUnits changed:', { units, filteredUnits });
  }, [units, filteredUnits]);

  if (!floorData || !floorData.units) {
    return <div>No floor data available</div>;
  }

  if (units.length === 0) {
    return <div>No units available</div>;
  }

  return (
    <IconSettings iconPath={`${process.env.PUBLIC_URL}/assets/icons`}>
      <div className="slds-grid slds-grid_vertical">
      
        <QuickFilters
          onFilter={handleFilter}
          activeFilters={activeFilters}
          floorOptions={floorOptions}
          unitTypeOptions={unitTypeOptions}
          bedroomOptions={bedroomOptions}
          amenitiesOptions={amenitiesOptions}
          onSearch={handleSearch}
          searchTerm={searchTerm}
          totalUnits={units.length}
          filteredUnits={visibleUnits.length}
          units={units}
          user={user}
        />
       
        <div className="slds-text-heading_small slds-text-align_center slds-p-around_x-small" style={{backgroundColor: 'white', fontWeight: 'bold'}}>
          <Icon
            category="standard"
            name="account_score"
            size="small"
            className="slds-m-right_x-small"
          />
          Property Units (Showing {visibleUnits.length} of {units.length})
          <Button
            iconCategory="utility"
            iconName={isGridView ? "list" : "table"}
            iconPosition="right"
            variant="icon"
            className="slds-float_right"
            onClick={() => setIsGridView(!isGridView)}
          />
        </div>
         
        {isGridView ? (
          <UnitGridView
            filteredUnits={visibleUnits}
            handleLayoutClick={handleLayoutClick}
            handleUnitClick={handleUnitClick}
            handleSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
            getStatusColor={getStatusColor}
            getContrastColor={getContrastColor}
            onPaymentPlanClick={handlePaymentPlanClick}
            onReserveUnit={handleReserveUnit}
            onBookUnit={handleBookUnit}
            canReserve={canReserve}
            canBook={canBook}
            currentUserId={user?.id}
            handleGenerateSalesOffer={handleGenerateSalesOffer}
            userEmail={safeUserEmail}
            user={user}
            isAdmin={isAdmin}
          />
        ) : (
          <UnitListView
            filteredUnits={visibleUnits}
            handleLayoutClick={handleLayoutClick}
            handleUnitClick={handleUnitClick}
            handleSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
            getStatusColor={getStatusColor}
            getContrastColor={getContrastColor}
            onPaymentPlanClick={handlePaymentPlanClick}
            onReserveUnit={handleReserveUnit}
            onBookUnit={handleBookUnit}
            canReserve={canReserve}
            canBook={canBook}
            currentUserId={user?.id}
            handleGenerateSalesOffer={handleGenerateSalesOffer}
            userEmail={safeUserEmail}
            user={user}
            isAdmin={isAdmin}
          />
        )}
        
        <UnitDetailsPopup 
          unit={selectedUnit}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClosePopup}
          onBook={handleBookUnit}
        />
        
        <UnitLayoutModal
          open={layoutModalOpen}
          onClose={handleLayoutModalClose}
          unit={selectedLayoutUnit}
        />
        
        <PaymentPlanCalculator
          open={paymentPlanOpen}
          onClose={() => setPaymentPlanOpen(false)}
          unit={selectedPaymentPlanUnit}
        />
        
        {/* <SalesOfferButton
          unit={selectedUnit}
          property={selectedProperty}
          onGenerateSalesOffer={handleGenerateSalesOffer}
        /> */}
      </div>
    </IconSettings>
  );
};

export default InteractiveFloorPlan;