import React from 'react';
import ReactDOM from 'react-dom';
import IconSettings from '@salesforce/design-system-react/components/icon-settings';

import App from './App';

ReactDOM.render(
  <IconSettings iconPath={`${process.env.PUBLIC_URL}/assets/icons`}>
    <App />
  </IconSettings>,
  document.getElementById('root')
);