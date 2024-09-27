import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Box, CircularProgress, CssBaseline, Grid, Button, Paper, Typography } from '@mui/material';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import UnitReservation from './components/UnitReservation';
import BuildingFloorPlan from './components/BuildingFloorPlan';
import QuickStats from './components/QuickStats';
import AdminHome from './components/admin/adminHome'; // Import AdminHome component
import AdminUnits from './components/admin/Units';
import AdminProperties from './components/admin/Properties';
import AdminFloors from './components/admin/Floors';
import AdminBedrooms from './components/admin/Bedrooms';
import AdminUnitTypes from './components/admin/UnitTypes';
import AdminDataSubmissions from './components/admin/data_submissions';
import Login from './components/Login';
import Header from './components/Header';
import { supabase } from './supabaseClient';
import './App.css';
import BookingPage from './pages/BookingPage';

// Lightning Design System imports
import { IconSettings, GlobalNavigationBar, GlobalNavigationBarRegion, GlobalNavigationBarLink, GlobalNavigationBarDropdown } from '@salesforce/design-system-react';
import '@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css';

// Define your custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#0176D3', // Salesforce blue
    },
    secondary: {
      main: '#2E844A', // Salesforce green
    },
    background: {
      default: '#F3F3F3', // Light gray background
      paper: '#FFFFFF', // White background for paper elements
    },
    text: {
      primary: '#16325C', // Dark blue text
    },
    action: {
      hover: 'rgba(1, 118, 211, 0.1)', // Light blue hover effect
    },
  },
  typography: {
    fontFamily: '"Salesforce Sans", Arial, sans-serif',
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [bookingUnit, setBookingUnit] = useState(null);
  const [properties, setProperties] = useState([]);
  const [units, setUnits] = useState([]);
  const [floorData, setFloorData] = useState(null);
  const [allUnits, setAllUnits] = useState([]);
  const [showFloorPlan, setShowFloorPlan] = useState(false);

  useEffect(() => {
    checkUser();
    fetchProperties();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user;
      setIsAuthenticated(!!currentUser);
      setUser(currentUser || null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user;
      setIsAuthenticated(!!currentUser);
      setUser(currentUser || null);
      console.log("User in App.js:", currentUser); // Add this line
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProperty) {
      fetchUnits(selectedProperty.id);
    }
  }, [selectedProperty]);

  const fetchProperties = async () => {
    const { data, error } = await supabase.from('properties').select('*');
    if (error) console.error('Error fetching properties:', error);
    else setProperties(data);
  };

  const fetchUnits = async (propertyId) => {
    const { data, error } = await supabase
      .from('units')
      .select(`
        *,
        floor:floors(floor_number),
        number_of_bedrooms:bedrooms(number_of_bedrooms),
        unit_type:unit_types(name)
      `)
      .eq('property_id', propertyId);

    if (error) {
      console.error('Error fetching units:', error);
      return;
    }

    console.log('Raw units data:', data);

    setUnits(data);
    const floorNumber = data[0]?.floor?.floor_number || 1;
    setFloorData({
      floorNumber,
      units: data
    });
  };

  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
    setSelectedUnit(null);
    setBookingUnit(null);
  };

  const handleUnitSelect = (unit) => {
    setSelectedUnit(unit);
    setBookingUnit(null);
  };

  const handleBookClick = (unit) => {
    setBookingUnit(unit);
  };

  const handleBookingComplete = async (unit, customerInfo) => {
    try {
      const { data, error } = await supabase
        .from('units')
        .update({ status: 'Reserved' })
        .eq('id', unit.id);

      if (error) throw error;

      const updatedUnits = units.map(u => 
        u.id === unit.id ? { ...u, status: 'Reserved' } : u
      );
      setUnits(updatedUnits);
      setFloorData(prevFloorData => ({
        ...prevFloorData,
        units: updatedUnits
      }));
      setSelectedUnit(null);
      setBookingUnit(null);
      alert(`Booking completed for unit ${unit.unit_number}. Customer: ${customerInfo.customerName}`);
    } catch (error) {
      console.error('Error updating unit status:', error);
      alert('Failed to complete booking. Please try again.');
    }
  };

  useEffect(() => {
    const fetchAllUnits = async () => {
      const { data, error } = await supabase
        .from('units')
        .select('*');
      if (error) {
        console.error('Error fetching units:', error);
      } else {
        setAllUnits(data);
      }
    };

    fetchAllUnits();
  }, []);

  const toggleFloorPlan = () => {
    setShowFloorPlan(!showFloorPlan);
  };

  const basename = process.env.NODE_ENV === 'production' ? '/salesbooking' : '';
  if (loading) {
    return (
      <MuiThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </MuiThemeProvider>
    );
  }

  return (
    <Router basename={basename}>
      <div className="slds-scope">
        <Header 
          isAuthenticated={isAuthenticated} 
          setIsAuthenticated={setIsAuthenticated}
          user={user}
          setUser={setUser}
        />
       <IconSettings iconPath={`${process.env.PUBLIC_URL}/assets/icons`}>
          <MuiThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Routes>
                <Route 
                  path="/login" 
                  element={
                    isAuthenticated ? <Navigate to="/reservation" replace /> : <Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
                  } 
                />
                <Route 
                  path="/reservation" 
                  element={
                    isAuthenticated ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Grid container sx={{ flexGrow: 1 }} spacing={3}>
                          <Grid item xs={12} md={showFloorPlan ? 6 : 12} sx={{ mb: 3 }}>
                          
                              <UnitReservation 
                                user={user} // Make sure you're passing the user prop
                                properties={properties}
                                selectedProperty={selectedProperty}
                                handlePropertySelect={handlePropertySelect}
                                floorData={floorData}
                                handleUnitSelect={handleUnitSelect}
                                selectedUnit={selectedUnit}
                                handleBookClick={handleBookClick}
                                bookingUnit={bookingUnit}
                                handleBookingComplete={handleBookingComplete}
                                allUnits={allUnits}
                                isFloorPlanShown={showFloorPlan}
                              />
                          </Grid>
                          {showFloorPlan && (
                            <Grid item xs={12} md={6} sx={{ mb: 3 }}>
                              <Paper elevation={3} sx={{ height: '100%', p: 2, backgroundColor: '#ffffff' }}>
                                <BuildingFloorPlan 
                                  floorData={floorData}
                                  handleUnitSelect={handleUnitSelect}
                                  selectedUnit={selectedUnit}
                                />
                              </Paper>
                            </Grid>
                          )}
                        </Grid>
                      </Box>
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  } 
                />
                <Route 
                  path="/admin" 
                  element={isAuthenticated ? <AdminHome /> : <Navigate to="/login" replace />} 
                />
                <Route 
                  path="/admin/properties" 
                  element={isAuthenticated ? <AdminProperties /> : <Navigate to="/login" replace />} 
                />
                <Route 
                  path="/admin/floors" 
                  element={isAuthenticated ? <AdminFloors /> : <Navigate to="/login" replace />} 
                />
                <Route 
                  path="/admin/bedrooms" 
                  element={isAuthenticated ? <AdminBedrooms /> : <Navigate to="/login" replace />} 
                />
                <Route 
                  path="/admin/unit-types" 
                  element={isAuthenticated ? <AdminUnitTypes /> : <Navigate to="/login" replace />} 
                />
                <Route 
                  path="/admin/units" 
                  element={isAuthenticated ? <AdminUnits /> : <Navigate to="/login" replace />} 
                />
                <Route 
                  path="/admin/data-submissions" 
                  element={isAuthenticated ? <AdminDataSubmissions /> : <Navigate to="/login" replace />} 
                />
                <Route 
                  path="/" 
                  element={isAuthenticated ? <Navigate to="/reservation" replace /> : <Navigate to="/login" replace />} 
                />
                <Route path="/booking" element={<BookingPage />} />
              </Routes>
            </Box>
          </MuiThemeProvider>
        </IconSettings>
      </div>
    </Router>
  );
}

export default App;