import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Button, Table, Popconfirm, Tag } from 'antd';
import * as actions from '../../actions/goods';
import CategoryTag from '../common/CategoryTag';
import GoodsModalWrap from './GoodsModalWrap';

class Goods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      pageSize: 10,
    }
  }

  render() {
    const { goodsList, categoryMap, categoryList, add, edit } = this.props;
    const { current, pageSize } = this.state;
    const colorList = ['red', 'blue', 'volcano', 'geekblue', 'orange', 'purple', 'gold', 'green', 'magenta', 'cyan'];
    const columns = [
      {
        title: '',
        width: '7%',
        key: 'index',
        render: (text,record,index)=>`${(current - 1) * pageSize + index + 1}`
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: '23%',
        key: 'name',
      },
      {
        title: 'SKU',
        dataIndex: 'sku',
        width: '16%',
        key: 'sku',
      },
      {
        title: '类目',
        dataIndex: 'category_id',
        width: '9%',
        key: 'category_id',
        render: (text, record) => (<CategoryTag category_id={text} />)
      },
      {
        title: '个数/箱',
        dataIndex: 'max_count',
        width: '15%',
        key: 'max_count',
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: '15%',
        key: 'description',
      },
      {
        title: '操作',
        width: '15%',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <>
            <a onClick={() => edit(record)} style={{marginRight: 15}}>
              编辑
            </a> 
            <Popconfirm
              placement="topRight"
              title={`是否确定删除，类目： ${record.name}`}
              onConfirm={() => this.freezeGoods(record)}
            >
              <a onClick={() => {}}>
                删除
              </a> 
            </Popconfirm>
          </>
        ),
      },
    ];
    
    return (
      <>
        <Row>
          <div style={{float: 'right'}}>
            <Button onClick={this.handleAdd} type="primary" style={{marginBottom: 15}} onClick={() => add()}>
              添加商品
            </Button>
          </div>
        </Row>
        <Table
          rowKey={record => `row-${record.id}`}
          dataSource={goodsList}
          columns={columns}
          scroll={{ y: 'calc(100vh - 270px)' }}
          scrollToFirstRowOnChange
          onChange={({current, pageSize}) => {this.setState({current, pageSize})}}
        />
      </>
    );
  }
}

const GoodsWithModal = GoodsModalWrap(Goods)

const mapStateToProps = state => ({
  categoryList: state.category.list,
  categoryMap: state.category.map,
  goodsList: state.goods.list,
})

const mapDispatchToProps = {
  addGoods: actions.fetchAddGoods,
  editGoods: actions.fetchUpdateGoods,
  freezeGoods: actions.fetchFreezeGoods,
}

export default connect(mapStateToProps, mapDispatchToProps)(GoodsWithModal);
