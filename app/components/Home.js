// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import { Button, Input } from 'antd';
import routes from '../constants/routes';
import styles from './Home.css';
import * as actions from '../actions/category';

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      id: 0,
      count: 1,
    }
  }

  getWarehouseList() {
    this.props.fetchGetWarehouseList();
    this.props.fetchGetWarehouseWithDelList();
  }

  addWarehouseFn() {
    const { count } = this.state
    this.props.fetchAddWarehouse({name: `种类${count}`, description: 'desc'});
    this.setState({ count: count + 1 })
  }

  updateWarehouseList(id) {
    console.log('id :', id);
    this.props.fetchUpdateWarehouse({id: parseInt(id), name: `种类x`, description: '描述'})
  }

  freezeWarehouseList(id) {
    console.log('id :', id);
    this.props.fetchFreezeWarehouse(parseInt(id))
  }

  recoverWarehouseList(id) {
    this.props.fetchRecoverWarehouse(parseInt(id))
  }

  changeVal(id) {
    console.log('id :', id);
    this.setState({ id })
  }

  render() {
    const { category: { list, listWithDel } } = this.props;
    const { id } = this.state

    return (
      <div className={styles.container} data-tid="container">
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
        <Button onClick={() => { this.getWarehouseList() }}>查看列表</Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <Button onClick={() => { this.addWarehouseFn() }}>新建仓库</Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <Input value={id} onChange={ e => this.changeVal(e.target.value) } size="small" placeholder="small size" />&nbsp;&nbsp;&nbsp;&nbsp;
        <Button onClick={() => { this.updateWarehouseList(id) }}>修改仓库</Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <Button onClick={() => { this.freezeWarehouseList(id) }}>冻结仓库</Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <Button onClick={() => { this.recoverWarehouseList(id) }}>恢复仓库</Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <br />
        <Link to={routes.COUNTER}>to Counter</Link>
      </div>
    );
  }
}

const mapStateToProps = state => ({ category: state.category })

const mapDispatchToProps = { 
  fetchGetWarehouseList: actions.fetchGetCategoryList,
  fetchGetWarehouseWithDelList: actions.fetchGetCategoryWithDelList,
  fetchAddWarehouse: actions.fetchAddCategory,
  fetchUpdateWarehouse: actions.fetchUpdateCategory,
  fetchFreezeWarehouse: actions.fetchFreezeCategory,
  fetchRecoverWarehouse: actions.fetchRecoverCategory,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home)
