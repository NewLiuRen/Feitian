// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import { message, Row, Col, Button, Input } from 'antd';
import routes from '../constants/routes';
import styles from './Home.css';
import * as actions from '../actions/fileRecord';
import * as db from '../db/goods'
import * as fileDB from '../db/file'
import * as recordsDB from '../db/records'

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      id: 0,
      name: '商品',
      categoryId: '',
      count: 1,
      testList: [],
    }
  }

  getTestList = () => {
    const addFileRecord = (id) => {
      recordsDB.addFileRecords(id, [{
        count: 111,
        max_count: 111555,
        order_number: '00000000',
        goods_id: '111',
        warehouse_id: '555',
      }, {
        count: 2,
        max_count: 6,
        order_number: '',
        goods_id: 2,
        warehouse_id: 1,
      }, {
        count: 333,
        max_count: 333666,
        order_number: '12312',
        goods_id: 333,
        warehouse_id: 666,
      }]).then(({success}) => success ? message.success('成功') : message.error('失败'))
    }
    // fileDB.addFile({name: 'file-10', create_date: 11});
    // fileDB.updateFileToImport({id: 12, name: 'file-999', description: 'ddddesc'})
    addFileRecord(13);
    // fileDB.deleteFile(4).then(({success}) => success ? message.success('成功') : message.error('失败'))
  }

  getWarehouseList() {
    const file = {
      create_date: 11,
      description: "",
      id: 13,
      is_import: false,
      name: "file-10"
    }
    this.props.setFile(file);
    this.props.fetchGetRecords(file);
  }

  fUpdateRecords(id) {
    const { categoryId } = this.state
    console.log('id :', id);
    this.props.fetchUpdateRecords(13, [{
      count: 20,
      goods_id: 100001,
      max_count: 12321,
      order_number: 6666,
      warehouse_id: 10,
    }, {
      count: 202,
      goods_id: '11',
      max_count: 2002,
      order_number: 'c0000000',
      warehouse_id: '55',
    }])
  }

  freezeWarehouseList(id) {
    console.log('id :', id);
    this.props.fetchFreezeWarehouse(parseInt(id))
  }

  recoverWarehouseList(id) {
    this.props.fetchRecoverWarehouse(parseInt(id))
  }

  changeVal(attr, val) {
    console.log(`${attr} :`, val);
    this.setState({ [attr]: val })
  }

  render() {
    console.log('this.props :', this.props);
    const { fileRecord: { file, records } } = this.props;
    const { id, name, categoryId, testList } = this.state

    return (
      <div className={styles.container} data-tid="container">
        <div>
          <h3>testlist</h3>
          {
            testList.map((w, i) => (<span style={{marginLeft: '10px'}} key={ i }>{ `${w.name}(${w.id}: ${w.is_del ? '冻结' : '未冻结'})` }</span>))
          }
        </div>
        <div>
          <h3>file</h3>
          { JSON.stringify(file) }
        </div>
        <div>
          <h3>records</h3>
          {
            records.map((r, i) => (<p style={{marginLeft: '10px'}} key={ `${i}-r` }>{ JSON.stringify(r) }</p>))  
          }
        </div>
        <Button onClick={ this.getTestList }>test查看</Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <Button onClick={() => { this.getWarehouseList() }}>获取记录集</Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <Button onClick={() => { this.addWarehouseFn() }}>新建仓库</Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <Row gutter={16}>
          <Col className="gutter-row" span={6}>
            <div className="gutter-box"><Input value={id} onChange={ e => this.changeVal('id', e.target.value) } size="small" placeholder="id" /></div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div className="gutter-box"><Input value={name} onChange={ e => this.changeVal('name', e.target.value) } size="small" placeholder="name" /></div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div className="gutter-box"><Input value={categoryId} onChange={ e => this.changeVal('categoryId', e.target.value) } size="small" placeholder="categoryId" /></div>
          </Col>
        </Row>
        <Button onClick={() => { this.fUpdateRecords() }}>修改记录集</Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <Button onClick={() => { this.freezeWarehouseList(id) }}>冻结仓库</Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <Button onClick={() => { this.recoverWarehouseList(id) }}>恢复仓库</Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <br />
        <Link to={routes.COUNTER}>to Counter</Link>
      </div>
    );
  }
}

const mapStateToProps = state => ({ fileRecord: state.fileRecord })

const mapDispatchToProps = { 
  setFile: actions.setFile,
  fetchGetRecords: actions.fetchGetRecords,
  fetchUpdateRecords: actions.fetchUpdateRecordsOrderNumber,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home)
