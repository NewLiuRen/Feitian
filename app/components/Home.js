// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import { message, Row, Col, Button, Input } from 'antd';
import routes from '../constants/routes';
import styles from './Home.css';
import * as actions from '../actions/goods';
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
    // db.getGoodsByCategoryId('1').then(data => {
    //   if (data) this.setState({testList: data})
    // })
    // fileDB.addFile({name: 'file-1', create_date: Date.now()})
    // recordDB.addFileRecords(1, [{
    //   count: 1,
    //   max_count: 5,
    //   order_number: '',
    //   goods_id: 1,
    //   warehouse_id: 1,
    // }, {
    //   count: 2,
    //   max_count: 6,
    //   order_number: '',
    //   goods_id: 2,
    //   warehouse_id: 1,
    // }, {
    //   count: 3,
    //   max_count: 5,
    //   order_number: '',
    //   goods_id: 3,
    //   warehouse_id: 1,
    // }]).then(({success}) => success ? message.success('成功') : message.error('失败'))
    fileDB.deleteFile(1)
  }

  getWarehouseList() {
    this.props.fetchGetWarehouseList();
    this.props.fetchGetWarehouseWithDelList();
  }

  addWarehouseFn() {
    const { name, categoryId, count } = this.state
    this.props.fetchAddWarehouse({name: `${name}-${count}`, sku: `sku-${count}`, category_id: categoryId, description: 'desc'});
    this.setState({ count: count + 1 })
  }

  updateWarehouseList(id) {
    const { categoryId } = this.state
    console.log('id :', id);
    this.props.fetchUpdateWarehouse({id: parseInt(id), name: `商品x`, sku: 'x', category_id: categoryId, description: '描述'})
  }

  freezeWarehouseList(id) {
    console.log('id :', id);
    this.props.fetchFreezeWarehouse(parseInt(id))
  }

  recoverWarehouseList(id) {
    this.props.fetchRecoverWarehouse(parseInt(id))
  }

  changeVal(attr, val) {
    console.log(attr+' :', val);
    this.setState({ [attr]: val })
  }

  render() {
    const { goods: { list, listWithDel } } = this.props;
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
          <h3>list</h3>
          {
            list.map((w, i) => (<span style={{marginLeft: '10px'}} key={ i }>{ `${w.name}(${w.id}: ${w.is_del ? '冻结' : '未冻结'})` }</span>))
          }
        </div>
        <div>
          <h3>listWithDel</h3>
          {
            listWithDel.map((w, i) => (<span style={{marginLeft: '10px'}} key={ i }>{ `${w.name}(${w.id}: ${w.is_del ? '冻结' : '未冻结'})` }</span>))
          }
        </div>
        <Button onClick={ this.getTestList }>test查看</Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <Button onClick={() => { this.getWarehouseList() }}>查看列表</Button>&nbsp;&nbsp;&nbsp;&nbsp;
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
        <Button onClick={() => { this.updateWarehouseList(id) }}>修改仓库</Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <Button onClick={() => { this.freezeWarehouseList(id) }}>冻结仓库</Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <Button onClick={() => { this.recoverWarehouseList(id) }}>恢复仓库</Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <br />
        <Link to={routes.COUNTER}>to Counter</Link>
      </div>
    );
  }
}

const mapStateToProps = state => ({ goods: state.goods })

const mapDispatchToProps = { 
  fetchGetWarehouseList: actions.fetchGetGoodsList,
  fetchGetWarehouseWithDelList: actions.fetchGetGoodsWithDelList,
  fetchAddWarehouse: actions.fetchAddGoods,
  fetchUpdateWarehouse: actions.fetchUpdateGoods,
  fetchFreezeWarehouse: actions.fetchFreezeGoods,
  fetchRecoverWarehouse: actions.fetchRecoverGoods,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home)
