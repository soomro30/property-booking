import React, { useMemo } from 'react';
import Card from '@salesforce/design-system-react/components/card';
import Button from '@salesforce/design-system-react/components/button';
import Icon from '@salesforce/design-system-react/components/icon';
import UnitActionIcons from './UnitActionIcons';
import useUserEmail from './useUserEmail'; // Import the useUserEmail hook

const UnitGridView = ({ 
  filteredUnits, 
  handleUnitClick, 
  handleLayoutClick, 
  onPaymentPlanClick, 
  onBlockUnit, 
  onBookUnit,
  canBookOrBlock,
  currentUserId,
  highlightedUnit,
  getStatusColor,
  getContrastColor,
  handleGenerateSalesOffer,
  user, // Add user prop
  isAdmin,
  userEmail
}) => {
  // Remove the visibleUnits filter here as it's now handled in InteractiveFloorPlan

  if (!filteredUnits || filteredUnits.length === 0) {
    return <div className="slds-text-heading_medium slds-align_absolute-center slds-p-around_large">No units to display</div>;
  }

  return (
    <div className="slds-grid slds-wrap slds-gutters">
      {filteredUnits.map((unit) => {
        if (!unit) {
          console.warn('Undefined unit in UnitGridView');
          return null;
        }
        
        const bedrooms = unit.number_of_bedrooms || 'N/A';
        const backgroundColor = getStatusColor(unit.status);
        const color = getContrastColor(backgroundColor);
        
        return (
          <div key={unit.id || `unit-${Math.random()}`} className="slds-col slds-size_1-of-2 slds-medium-size_1-of-3 slds-large-size_1-of-4" style={{padding: '0.5rem'}}>
            <div
              className={`slds-box ${unit.id === highlightedUnit ? 'slds-box_shadow' : ''}`}
              style={{
                backgroundColor,
                color,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '0.25rem',
              }}
            >
              <div className="slds-grid slds-grid_align-spread slds-has-flexi-truncate slds-m-bottom_small">
                <h3 className="slds-truncate slds-text-heading_medium" title={unit.unit_number}>
                  <Icon category="standard" name="home" size="small" className="slds-m-right_x-small" /> {unit.unit_number}
                </h3>
                <span className="slds-badge" style={{backgroundColor: 'rgba(255,255,255,0.2)', color: color}}>{unit.status}</span>
              </div>
              <div className="slds-text-body_small">
                <p className="slds-truncate slds-m-bottom_xx-small">
                  <Icon category="utility" name="layout" size="xx-small" className="slds-m-right_xx-small" /> Type: {unit.unit_type}
                </p>
                <p className="slds-truncate slds-m-bottom_xx-small">
                  <Icon category="utility" name="bed" size="xx-small" className="slds-m-right_xx-small" /> Bedrooms: {bedrooms}
                </p>
                <p className="slds-truncate slds-m-bottom_xx-small">
                  <Icon category="utility" name="expand_alt" size="xx-small" className="slds-m-right_xx-small" /> Area: {unit.square_footage} sqm
                </p>
                <p className="slds-truncate slds-m-bottom_xx-small">
                  <Icon category="utility" name="moneybag" size="xx-small" className="slds-m-right_xx-small" /> Price: {unit.post_2_year_payment_price ? unit.post_2_year_payment_price.toLocaleString() : 'N/A'}
                </p>
                {unit.status === 'Blocked' && (
                  <p className="slds-truncate slds-m-bottom_xx-small">
                    <Icon category="utility" name="lock" size="xx-small" className="slds-m-right_xx-small" /> Blocked by: {unit.blocked_by_email}
                  </p>
                )}
              </div>
              <div className="slds-m-top_small">
                <UnitActionIcons
                  unit={unit}
                  handleLayoutClick={handleLayoutClick}
                  handlePaymentPlanClick={onPaymentPlanClick}
                  handleBlockUnit={onBlockUnit}
                  handleBookUnit={onBookUnit}
                  handleGenerateSalesOffer={handleGenerateSalesOffer}
                  canBookOrBlock={canBookOrBlock}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UnitGridView;
