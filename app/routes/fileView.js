import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import routes from '../constants/routes';

import FileViewCalendar from '../components/fileView/FileViewCalendar';

export default () => (
  <Switch>
    <Route path={routes.File_VIEW_TABLE} component={FileViewCalendar} />
    <Redirect from={routes.File_VIEW} to={routes.File_VIEW_TABLE}></Redirect>         
  </Switch>
)
