import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import RouteDataManage from '../routes/dataManage';
import routes from '../constants/routes';

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

export default class LayoutDataManagePage extends Component {
  handleClick = e => {
    console.log('click ', e);
  };

  render() {
    return (
      <>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
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
              <Menu.Item key="1"><NavLink to={routes.DATA_MANAGE_WAREHOUSE}>仓库数据管理</NavLink></Menu.Item>
              <Menu.Item key="2"><NavLink to={routes.DATA_MANAGE_CATEGORY}>类目数据管理</NavLink></Menu.Item>
              <Menu.Item key="3"><NavLink to={routes.DATA_MANAGE_GOODS}>商品数据管理</NavLink></Menu.Item>
              <Menu.Item key="4"><NavLink to={routes.DATA_MANAGE_FILE_MANAGE}>文件数据管理</NavLink></Menu.Item>
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
              <Menu.Item key="5"><NavLink to={routes.DATA_MANAGE_WAREHOUSE_MANAGE}>仓库</NavLink></Menu.Item>
              <Menu.Item key="6"><NavLink to={routes.DATA_MANAGE_GOODS_MANAGE}>商品</NavLink></Menu.Item>
            </SubMenu>
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