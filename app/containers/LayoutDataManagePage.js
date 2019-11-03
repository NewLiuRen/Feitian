import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import RouteDataManage from '../routes/dataManage';
import routes from '../constants/routes';

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

export default class LayoutDataManagePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pathname: ''
    }
  }

  render() {
    const { location: { pathname } } = this.props;

    return (
      <>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={[routes.DATA_MANAGE_WAREHOUSE]}
            defaultOpenKeys={['sub1']}
            selectedKeys={[pathname]}
            style={{ height: '100%' }}
          >
            <SubMenu
              key="sub1"
              title={
                <span>
                  <Icon type="database" />
                  数据
                </span>
              }
            >
              <Menu.Item key={routes.DATA_MANAGE_WAREHOUSE}><NavLink to={routes.DATA_MANAGE_WAREHOUSE}>仓库数据管理</NavLink></Menu.Item>
              <Menu.Item key={routes.DATA_MANAGE_CATEGORY}><NavLink to={routes.DATA_MANAGE_CATEGORY}>类目数据管理</NavLink></Menu.Item>
              <Menu.Item key={routes.DATA_MANAGE_GOODS}><NavLink to={routes.DATA_MANAGE_GOODS}>商品数据管理</NavLink></Menu.Item>
              <Menu.Item key={routes.DATA_MANAGE_FILE_MANAGE}><NavLink to={routes.DATA_MANAGE_FILE_MANAGE}>文件数据管理</NavLink></Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={
                <span>
                  <Icon type="delete" />
                  回收站
                </span>
              }
            >
              <Menu.Item key={routes.DATA_MANAGE_WAREHOUSE_MANAGE}><NavLink to={routes.DATA_MANAGE_WAREHOUSE_MANAGE}>仓库</NavLink></Menu.Item>
              <Menu.Item key={routes.DATA_MANAGE_GOODS_MANAGE}><NavLink to={routes.DATA_MANAGE_GOODS_MANAGE}>商品</NavLink></Menu.Item>
            </SubMenu>
            <Menu.Item key={routes.CONFIG}>
              <NavLink to={routes.CONFIG}>
                <Icon type="setting" />
                系统设置
              </NavLink>
            </Menu.Item>
          </Menu>
        </Sider>
        <Content style={{ height: '100%', padding: '10px' }}>
          <Layout style={{ height: '100%', padding: '10px', backgroundColor: '#fff', overflow: 'auto'}}>
            <RouteDataManage />
          </Layout>
        </Content>
      </>
    )
  }
}