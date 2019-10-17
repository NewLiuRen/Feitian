import React from 'react';
import { Switch, Route } from 'react-router-dom';

import App from '../containers/App';
import LayoutPage from '../containers/LayoutPage';

export default () => (
  <App>
    <Switch>
      <Route path='/' component={LayoutPage} />
    </Switch>
  </App>
);
