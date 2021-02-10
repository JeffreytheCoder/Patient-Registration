import React from 'react';
import ReactDOM from 'react-dom';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import Form from './components/Form';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Form />
    </MuiPickersUtilsProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
