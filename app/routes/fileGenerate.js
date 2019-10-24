import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import routes from '../constants/routes';

import FileGenerateIndex from '../components/fileGenerate/FileGenerateIndex';
import FileGenerateTable from '../components/fileGenerate/FileGenerateTable';
import FileViewTable from '../components/fileView/FileViewTable';

export default () => (
  <Switch>
    <Route path={routes.File_GENERATE_INDEX} component={FileGenerateIndex} />
    <Route path={routes.File_GENERATE_TABLE} component={FileGenerateTable} />
    <Route path={routes.File_GENERATE_PREVIEW} component={FileViewTable} />
    <Redirect from={routes.File_GENERATE} to={routes.File_GENERATE_INDEX} />  
  </Switch>
)