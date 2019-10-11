// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import routes from '../constants/routes';
import styles from './Home.css';
import * as db from '../db/warehouse';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  getWarehouseList() {
    // ipcRenderer.send('addWarehouse')
    db.getWarehouses();
  }

  addWarehouseFn() {
    // ipcRenderer.send('addWarehouse')
    db.addWarehouse({name: '仓库2', ware_index: 5});
  }

  updateWarehouseList() {
    // ipcRenderer.send('addWarehouse')
    db.updateWarehouse({id: 2, name: '仓库3', ware_index: 2});
  }

  deleteWarehouseList() {
    // ipcRenderer.send('addWarehouse')
    db.deleteWarehouse(4);
  }

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <h2>Home</h2>
        <Button onClick={() => { this.getWarehouseList() }}>查看列表</Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <Button onClick={() => { this.addWarehouseFn() }}>新建仓库</Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <Button onClick={() => { this.updateWarehouseList() }}>修改仓库</Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <Button onClick={() => { this.deleteWarehouseList() }}>删除仓库</Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <Link to={routes.COUNTER}>to Counter</Link>
      </div>
    );
  }
}
