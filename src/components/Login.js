import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

import IconSettings from '@salesforce/design-system-react/components/icon-settings';
import Card from '@salesforce/design-system-react/components/card';
import Input from '@salesforce/design-system-react/components/input';
import Button from '@salesforce/design-system-react/components/button';
import Alert from '@salesforce/design-system-react/components/alert';

const Login = ({ setIsAuthenticated, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setIsAuthenticated(true);
      setUser(data.user);
      navigate('/reservation');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <IconSettings iconPath={`${process.env.PUBLIC_URL}/assets/icons`}>
      <div 
        className="slds-grid slds-grid_vertical-align-center slds-grid_align-center" 
        style={{ 
          height: '100vh', 
          backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/sunstone.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="slds-col slds-size_1-of-4">
          <Card
            heading="Sales Login"
            className="slds-p-around_medium"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.97)' }}
          >
            <img 
              src="https://www.imkan.ae/themes/custom/imkan/logos/logo-en.svg" 
              alt="IMKAN Logo" 
              style={{ width: '100px', marginBottom: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} 
            />
            <h2 className="slds-text-heading_large slds-text-align_center slds-m-bottom_medium" style={{ fontWeight: 'bold' }}>
              Property Reservation & Broker Registration System
            </h2>
            <form onSubmit={handleLogin} className="slds-form slds-form_stacked">
              <Input
                id="email"
                label="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="slds-m-bottom_medium"
              />
              <Input
                id="password"
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="slds-m-bottom_medium"
              />
              <Button
                type="submit"
                label="Sign In"
                variant="brand"
                className="slds-m-top_medium slds-size_1-of-1"
              />
            </form>
            {error && (
              <Alert
                labels={{
                  heading: 'Error',
                  closeButton: 'Close',
                }}
                onRequestClose={() => setError('')}
                variant="error"
                className="slds-m-top_medium"
              >
                {error}
              </Alert>
            )}
          </Card>
        </div>
      </div>
    </IconSettings>
  );
};

export default Login;
