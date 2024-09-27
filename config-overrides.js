const { override, babelInclude, addWebpackPlugin } = require('customize-cra');
const path = require('path');
const webpack = require('webpack');

module.exports = override(
  babelInclude([
    path.resolve('src'),
    path.resolve('node_modules/@salesforce/design-system-react')
  ]),
  addWebpackPlugin(
    new webpack.DefinePlugin({
      'process.env.PUBLIC_URL': JSON.stringify(process.env.NODE_ENV === 'production' ? '/salesbooking' : '')
    })
  )
);