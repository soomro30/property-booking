import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

import IconSettings from '@salesforce/design-system-react/components/icon-settings';
import GlobalNavigationBar from '@salesforce/design-system-react/components/global-navigation-bar';
import GlobalNavigationBarRegion from '@salesforce/design-system-react/components/global-navigation-bar/region';
import GlobalNavigationBarDropdown from '@salesforce/design-system-react/components/global-navigation-bar/dropdown';
import GlobalNavigationBarLink from '@salesforce/design-system-react/components/global-navigation-bar/link';
import AppLauncher from '@salesforce/design-system-react/components/app-launcher';
import AppLauncherExpandableSection from '@salesforce/design-system-react/components/app-launcher/expandable-section';
import AppLauncherTile from '@salesforce/design-system-react/components/app-launcher/tile';
import Button from '@salesforce/design-system-react/components/button';
import Search from '@salesforce/design-system-react/components/input/search';

const Header = ({ isAuthenticated, setIsAuthenticated, user, setUser }) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const checkAdminRole = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (data && data.role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      }
    };

    checkAdminRole();
  }, [user]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setIsAuthenticated(false);
      setUser(null);
      setIsAdmin(false);
      navigate('/login');
    }
  };

  const adminOptions = [
    { label: 'Administration Panel', value: '/admin' }
  ];

  const handleAdminSelect = (option) => {
    navigate(option.value);
  };

  const userOptions = [
   
    { label: 'My Bookings', value: '/my-bookings' },
    { label: 'Logout', value: 'logout' }
  ];

  const handleUserSelect = (option) => {
    if (option.value === 'logout') {
      handleLogout();
    } else {
      navigate(option.value);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    console.log('Search term:', event.target.value);
  };

  if (!isAuthenticated) {
    return null;
  }

  const search = (
    <Search
      onChange={handleSearch}
      placeholder="Find an app"
      assistiveText={{ label: 'Find an app' }}
    />
  );

  const headerButton = <Button label="App Exchange" />;

  return (
    <IconSettings iconPath={`${process.env.PUBLIC_URL}/assets/icons`}>
      <GlobalNavigationBar>
        <GlobalNavigationBarRegion region="primary">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="https://www.imkan.ae/themes/custom/imkan/logos/logo-en.svg" 
              alt="IMKAN Logo" 
              style={{ height: '30px', marginRight: '10px' }}
            />
            <AppLauncher
              id="app-launcher-trigger"
              triggerName="Property Booking Platform"
              search={search}
              modalHeaderButton={headerButton}
              className="slds-icon-waffle_container"
            >
              {isAdmin && (
                <AppLauncherExpandableSection title="Admin">
                  <AppLauncherTile
                    description="Manage administration panel"
                    iconText="AP"
                    search={searchTerm}
                    title="Administration Panel"
                    onClick={() => navigate('/admin')}
                  />
                </AppLauncherExpandableSection>
              )}
            </AppLauncher>
          </div>
        </GlobalNavigationBarRegion>
        <GlobalNavigationBarRegion region="secondary" navigation>
          <GlobalNavigationBarLink
            active={window.location.pathname === '/reservation'}
            label="Unit Reservation"
            id="unit-reservation-link"
            onClick={() => navigate('/reservation')}
          />
          {isAdmin && (
            <GlobalNavigationBarDropdown
              assistiveText={{ icon: 'Open admin menu' }}
              id="adminDropdown"
              label="Admin"
              options={adminOptions}
              onSelect={handleAdminSelect}
            />
          )}
        </GlobalNavigationBarRegion>
        <GlobalNavigationBarRegion region="tertiary">
          <GlobalNavigationBarDropdown
            assistiveText={{ icon: 'Open user menu' }}
            id="userDropdown"
            label={user?.email || 'User'}
            options={userOptions}
            onSelect={handleUserSelect}
          />
        </GlobalNavigationBarRegion>
      </GlobalNavigationBar>
    </IconSettings>
  );
};

export default Header;
