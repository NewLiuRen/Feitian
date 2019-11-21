import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import routes from '../constants/routes';

import FileGenerateIndex from '../components/fileGenerate/FileGenerateIndex';
import FileGenerateTable from '../components/fileGenerate/FileGenerateTable';
import FileGenerateOrder from '../components/fileGenerate/FileGenerateOrder';
import FileGenerateLabel from '../components/fileGenerate/FileGenerateLabel';
import FileViewCalendar from '../components/fileView/FileViewCalendar';

export default () => (
  <Switch>
    <Route path={routes.FILE_GENERATE_INDEX} component={FileGenerateIndex} />
    <Route path={`${routes.FILE_GENERATE_TABLE}/:type`} component={FileGenerateTable} />
    <Route path={`${routes.FILE_GENERATE_ORDER}`} component={FileGenerateOrder} />
    <Route path={`${routes.FILE_GENERATE_LABEL}`} component={FileGenerateLabel} />
    <Route path={routes.FILE_GENERATE_PREVIEW} component={FileViewCalendar} />
    <Redirect from={routes.FILE_GENERATE} to={routes.FILE_GENERATE_INDEX} />  
  </Switch>
)
