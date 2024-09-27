import React, { useEffect } from 'react';
import IconSettings from '@salesforce/design-system-react/components/icon-settings';

const AdminDirectClients = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.jotfor.ms/s/umd/latest/for-sheets-embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <IconSettings iconPath={`${process.env.PUBLIC_URL}/assets/icons`}>
      <div className="slds-p-around_medium">
        
        <div 
          className="jotform-table-embed" 
          style={{ width: '100%', height: '600px' }} 
          data-id="242253667987472" 
          data-iframesource="www.jotform.com" 
          data-type="interactive"
        ></div>
      </div>
    </IconSettings>
  );
};

export default AdminDirectClients;
