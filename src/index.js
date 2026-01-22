/*!
=========================================================
* Argon Dashboard React - v1.2.2
=========================================================
*/

import React from 'react';
import ReactDOM from 'react-dom';

import 'assets/plugins/nucleo/css/nucleo.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'assets/scss/argon-dashboard-react.scss';
import './darkComponent.css';
import RealIndex from './RealIndex';

ReactDOM.render(
  <React.StrictMode>
    <RealIndex />
  </React.StrictMode>,
  document.getElementById('root')
);
