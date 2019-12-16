import React from 'react';
import { Switch, Route } from 'react-router-dom';

import App from '../containers/App';
import routes from '../constants/routes.json';
import LayoutPage from '../containers/LayoutPage';

export default () => (
  <App>
    <Switch>
      <Route path='/' component={LayoutPage} />
      <Route path={routes.FILE_VIEW} component={LayoutPage} />
      <Route path={routes.FILE_VIEW_TABLE} component={LayoutPage} />
      <Route path={routes.FILE_GENERATE} component={LayoutPage} />
      <Route path={routes.FILE_GENERATE_INDEX} component={LayoutPage} />
      <Route path={routes.FILE_GENERATE_TABLE} component={LayoutPage} />
      <Route path={routes.FILE_GENERATE_ORDER} component={LayoutPage} />
      <Route path={routes.FILE_GENERATE_LABEL} component={LayoutPage} />
      <Route path={routes.FILE_GENERATE_PREVIEW} component={LayoutPage} />
      <Route path={routes.DATA_MANAGE} component={LayoutPage} />
      <Route path={routes.DATA_MANAGE_WAREHOUSE} component={LayoutPage} />
      <Route path={routes.DATA_MANAGE_CATEGORY} component={LayoutPage} />
      <Route path={routes.DATA_MANAGE_GOODS} component={LayoutPage} />
      <Route path={routes.DATA_MANAGE_WAREHOUSE_MANAGE} component={LayoutPage} />
      <Route path={routes.DATA_MANAGE_CATEGORY_MANAGE} component={LayoutPage} />
      <Route path={routes.DATA_MANAGE_GOODS_MANAGE} component={LayoutPage} />
      <Route path={routes.DATA_MANAGE_FILE_MANAGE} component={LayoutPage} />
      <Route path={routes.CONFIG} component={LayoutPage} />
    </Switch>
  </App>
);
