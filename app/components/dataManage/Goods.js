import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Button, Table, Popconfirm, Input, Icon } from 'antd';
import * as actions from '../../actions/goods';
import CategoryTag from '../common/CategoryTag';
import GoodsModalWrap from './GoodsModalWrap';

import style from './WarehouseManage.scss';

class Goods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      pageSize: 10,
      keyWord: '',
    }
  }

  setKeyWord(event) {
    this.setState({keyWord: event.target.value});
  }

  clearWord() {
    this.setState({keyWord: ''});
  }

  render() {
    const { goodsList, categoryMap, categoryList, add, edit } = this.props;
    const { current, pageSize, keyWord } = this.state;
    const list = goodsList.filter(w => w.name.includes(keyWord) || w.sku.includes(keyWord) || (w.category_id && categoryMap[w.category_id].name.includes(keyWord)))
    const categoryFilters = []
    list.forEach(g => {
      if (!categoryFilters.find(c => c.value === g.category_id || c.value === -1)) categoryFilters.push({ text: categoryMap[g.category_id] ? categoryMap[g.category_id].name : '其他', value: g.category_id || -1,})
    })
    const filters = categoryFilters.sort((a, b) => b.value - a.value);
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
        width: '10%',
        key: 'category_id',
        filters,
        filterMultiple: false,
        onFilter: (value, record) => {
          if (value === -1) return !record.category_id;
          return record.category_id === value;
        },
        render: (text, record) => (<CategoryTag category_id={text} />)
      },
      {
        title: '个数/箱',
        dataIndex: 'max_count',
        width: '14%',
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
            <Input style={{width: 300, marginRight: 15}} placeholder="请输入搜索关键词：名称、SKU、类目" value={keyWord} suffix={
              <Icon type="close-circle" theme="filled" className={style.clear} onClick={() => this.clearWord()} />
            } onChange={keyWord => this.setKeyWord(keyWord)}/>
            <Button onClick={this.handleAdd} type="primary" style={{marginBottom: 15}} onClick={() => add()}>
              添加商品
            </Button>
          </div>
        </Row>
        <Table
          rowKey={record => `row-${record.id}`}
          dataSource={list}
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
