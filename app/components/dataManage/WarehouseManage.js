import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Table, Switch, Input, Icon } from 'antd';
import * as actions from '../../actions/warehouse';
import style from './WarehouseManage.scss';

class WarehouseManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      pageSize: 10,
      keyWord: '',
    }
  }

  // 组件加载后载入所有仓库（包含删除）列表
  componentDidMount() {
    this.props.getAllWarehouseList();
  }

  // 组件卸载时清空所有仓库（包含删除）列表
  componentWillUnmount() { 
    this.props.clearWarehouseList();
  }

  // 切换仓库冻结状态（若已冻结则恢复，否则执行冻结 ）
  toggleWarehouseState(warehouse, is_del) {
    const { freezeWarehouse, recoverWarehouse } = this.props;
    if (is_del) recoverWarehouse(warehouse.id);
    else freezeWarehouse(warehouse.id);
  }

  setKeyWord(event) {
    this.setState({keyWord: event.target.value});
  }

  clearWord() {
    this.setState({keyWord: ''});
  }

  render() {
    const { current, pageSize, keyWord } = this.state;
    const { warehouseWithDelList } = this.props;
    const list = warehouseWithDelList.filter(w => w.name.includes(keyWord))

    const columns = [
      {
        title: '',
        width: '5%',
        key: 'index',
        render: (text,record,index)=>`${(current - 1) * pageSize + index + 1}`
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: '35%',
        key: 'name',
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: '45%',
        key: 'description',
      },
      {
        title: '操作',
        width: '15%',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <Switch checkedChildren="正常" unCheckedChildren="冻结" checked={!record.is_del} onChange={checked => {this.toggleWarehouseState(record, checked)}} />
        ),
      },
    ];
    
    return (
      <>
        <Row>
          <div className={style['operator-wrap']} style={{float: 'right', marginBottom: 10,}}>
            <Input value={keyWord} placeholder="请输入搜索关键词：名称" suffix={
              <Icon type="close-circle" theme="filled" className={style.clear} value="keyWord" onClick={() => this.clearWord()} />
            } onChange={keyWord => this.setKeyWord(keyWord)}/>
          </div>
        </Row>
        <Table
          rowKey={record => `row-${record.id}`}
          dataSource={list}
          columns={columns}
          scroll={{ y: 'calc(100vh - 270px)' }}
          onChange={({current, pageSize}) => {this.setState({current, pageSize})}}
        />
      </>
    )
  }
}

const mapStateToProps = state => ({
  warehouseWithDelList: state.warehouse.listWithDel,
})

const mapDispatchToProps = {
  getAllWarehouseList: actions.fetchGetWarehouseWithDelList,
  clearWarehouseList: actions.clearWarehouseWithDelList,
  freezeWarehouse: actions.fetchFreezeWarehouse,
  recoverWarehouse: actions.fetchRecoverWarehouse,
}

export default connect(mapStateToProps, mapDispatchToProps)(WarehouseManage)
