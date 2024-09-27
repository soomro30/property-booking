import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const BookingForm = ({ unit, onBookingComplete }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onBookingComplete(unit, { customerName, customerEmail });
      setCustomerName('');
      setCustomerEmail('');
    } catch (error) {
      console.error('Error completing booking:', error);
      alert('Failed to complete booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid black', padding: '10px', marginTop: '20px' }}>
      <h2>Unit Book for Unit Number {unit.unitNumber}, {unit.unitType}</h2>
      <div>
        <label>
          Name:
          <input 
            type="text" 
            value={customerName} 
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Email:
          <input 
            type="email" 
            value={customerEmail} 
            onChange={(e) => setCustomerEmail(e.target.value)}
            required
          />
        </label>
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Booking...' : 'Complete Booking'}
      </button>
    </form>
  );
};

export default BookingForm;