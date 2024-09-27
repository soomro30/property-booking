import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Adjust this import path as needed

const useUserEmail = () => {
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const getUserEmail = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
      }
    };

    getUserEmail();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email || null);
    });

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  return userEmail;
};

export default useUserEmail;
