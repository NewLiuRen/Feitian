import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import routes from '../constants/routes';

import Category from '../components/dataManage/Category';
import Goods from '../components/dataManage/Goods';
import Warehouse from '../components/dataManage/Warehouse';
import CategoryManage from '../components/dataManage/CategoryManage';
import GoodsManage from '../components/dataManage/GoodsManage';
import WarehouseManage from '../components/dataManage/WarehouseManage';
import FileManage from '../components/dataManage/FileManage';

export default () => (
  <Switch>
    <Route path={routes.DATA_MANAGE_WAREHOUSE} component={Warehouse} />
    <Route path={routes.DATA_MANAGE_CATEGORY} component={Category} />
    <Route path={routes.DATA_MANAGE_GOODS} component={Goods} />
    <Route path={routes.DATA_MANAGE_WAREHOUSE_MANAGE} component={WarehouseManage} />
    <Route path={routes.DATA_MANAGE_CATEGORY_MANAGE} component={CategoryManage} />
    <Route path={routes.DATA_MANAGE_GOODS_MANAGE} component={GoodsManage} />
    <Route path={routes.DATA_MANAGE_FILE_MANAGE} component={FileManage} />
    <Redirect from={routes.DATA_MANAGE} to={routes.DATA_MANAGE_WAREHOUSE}></Redirect>  
  </Switch>
)
