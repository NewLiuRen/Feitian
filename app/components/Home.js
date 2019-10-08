// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import styles from './Home.css';
import { Button } from 'antd';
import { ipcRenderer } from 'electron';
import { addWarehouse } from '../db/warehouse';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;
  constructor(props) {
    super(props);
    // ipcRenderer.on('getWarehouseListResult', (event, arg) => {
    //   console.log('query warehouse: ', arg) 
    // })
    // ipcRenderer.on('addWarehouseResult', (event, arg) => {
    //   console.log('add warehouse: ', arg) 
    // })
  }

  getWarehouseList() {
    ipcRenderer.send('getWarehouseList')
  }

  addWarehouseFn() {
    // ipcRenderer.send('addWarehouse')
    addWarehouse({name: '仓库1', ware_index: 1});
  }

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <h2>Home</h2>
        <Button onClick={() => { this.addWarehouseFn() }}>新建仓库</Button><br />
        <Button onClick={() => { this.getWarehouseList() }}>仓库列表</Button><br />
        <Link to={routes.COUNTER}>to Counter</Link>
      </div>
    );
  }
}
