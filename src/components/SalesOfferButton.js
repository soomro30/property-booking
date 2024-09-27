import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { generateSalesOffer } from '../services/salesOfferService';

const SalesOfferButton = ({ unit, property, onGenerateSalesOffer }) => {
  const handleGenerateSalesOffer = async () => {
    try {
      await generateSalesOffer(unit, property);
      onGenerateSalesOffer(unit);
    } catch (error) {
      console.error('Error generating sales offer:', error);
      // You can add error handling here, such as showing an error message to the user
    }
  };

  return (
    <Tooltip title="Generate Sales Offer" placement="top">
      <IconButton size="small" onClick={handleGenerateSalesOffer}>
        <span className="slds-icon_container slds-icon-standard-contract">
          <svg className="slds-icon slds-icon_small" aria-hidden="true">
            <use xlinkHref="/assets/icons/standard-sprite/svg/symbols.svg#contract"></use>
          </svg>
        </span>
      </IconButton>
    </Tooltip>
  );
};

export default SalesOfferButton;
