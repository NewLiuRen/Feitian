import React, { Component } from 'react';
import { Switch, Route, NavLink, Redirect } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import routes from '../constants/routes';
import VERSION from '../constants/version';

import RouteFileView from '../routes/fileView';
import RouteFileGenerate from '../routes/fileGenerate';
import RouteDataManage from '../routes/dataManage';
import LayoutDataManagePage from './LayoutDataManagePage';

const { Header, Footer, } = Layout;

export default class LayoutPage extends Component {
  render() {
    return (
      <Layout>
        <Header className="header" style={{ height: '46px' }}>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
          >
            <Menu.Item key="1"><NavLink to={routes.File_VIEW}>文件一览</NavLink></Menu.Item>
            <Menu.Item key="2"><NavLink to={routes.File_GENERATE}>文件生成</NavLink></Menu.Item>
            <Menu.Item key="3"><NavLink to={routes.DATA_MANAGE}>数据管理</NavLink></Menu.Item>
          </Menu>
        </Header>
        <Layout style={{ height: 'calc(100vh - 76px)', overflow: 'auto' }}>
          <Switch>
            <Route path={routes.File_VIEW} component={RouteFileView} />
            <Route path={routes.File_GENERATE} component={RouteFileGenerate} />
            <Route path={routes.DATA_MANAGE} component={LayoutDataManagePage} />
            <Redirect from='/' to={routes.File_VIEW} />
          </Switch>
        </Layout>
        <Footer style={{padding: '5px 50px', borderTop: '1px solid #ddd', textAlign: 'center'}}>{`Copyright © 2019 L.R ( Version: ${VERSION} )`}</Footer>
      </Layout>
    )
  }
}
