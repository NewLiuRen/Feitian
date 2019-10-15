import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import routes from '../constants/routes';

import RouteFileView from './LayoutFileView';
import RouteFileGenerate from './LayoutFileGenerate';
import RouteDataManage from './LayoutDataManage';
import Count from '../components/Counter';

const { SubMenu } = Menu;
const { Header, Footer, Content, Sider } = Layout;

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
            <Menu.Item key="1"><Link to={routes.File_VIEW}>文件一览</Link></Menu.Item>
            <Menu.Item key="2"><Link to={routes.File_GENERATE}>文件生成</Link></Menu.Item>
            <Menu.Item key="3"><Link to={routes.DATA_MANAGE}>数据管理</Link></Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Switch>
            <Route path={routes.File_VIEW} component={RouteFileView} />
            <Route path={routes.File_GENERATE} component={RouteFileGenerate} />
            <Route path={routes.DATA_MANAGE} component={RouteDataManage} />
          </Switch>
        </Layout>
        <Footer style={{padding: '5px 50px', textAlign: 'center'}}>Copyright © 2019 L.R ( Version 1.0.0 )</Footer>
      </Layout>
    )
  }
}
