import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Table, Switch, Input, Tag, Icon } from 'antd';
import * as actions from '../../actions/goods';
import CategoryTag from '../common/CategoryTag';

import style from './WarehouseManage.scss';

class GoodsManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      pageSize: 10,
      keyWord: '',
    }
  }

  // 组件加载后载入所有商品（包含删除）列表
  componentDidMount() {
    this.props.getAllGoodsList();
  }

  // 组件卸载时清空所有商品（包含删除）列表
  componentWillUnmount() { 
    this.props.clearGoodsList();
  }

  // 切换商品冻结状态（若已冻结则恢复，否则执行冻结 ）
  toggleGoodsState(goods, is_del) {
    const { freezeGoods, recoverGoods } = this.props;
    if (is_del) recoverGoods(goods.id);
    else freezeGoods(goods.id);
  }

  setKeyWord(event) {
    this.setState({keyWord: event.target.value});
  }

  clearWord() {
    this.setState({keyWord: ''});
  }

  render() {
    const { goodsList, categoryMap, categoryList } = this.props;
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
          <Switch checkedChildren="正常" unCheckedChildren="冻结" checked={!record.is_del} onChange={checked => {this.toggleGoodsState(record, checked)}} />
        ),
      },
    ];
    
    return (
      <>
        <Row>
          <div className={style['operator-wrap']} style={{float: 'right', marginBottom: 10,}}>
            <Input style={{width: 300}} placeholder="请输入搜索关键词：名称、SKU、类目" value={keyWord} suffix={
              <Icon type="close-circle" theme="filled" className={style.clear} onClick={() => this.clearWord()} />
            } onChange={keyWord => this.setKeyWord(keyWord)}/>
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
    )
  }
}

const mapStateToProps = state => ({
  categoryList: state.category.list,
  categoryMap: state.category.map,
  goodsList: state.goods.listWithDel,
})

const mapDispatchToProps = {
  getAllGoodsList: actions.fetchGetGoodsWithDelList,
  clearGoodsList: actions.clearGoodsWithDelList,
  freezeGoods: actions.fetchFreezeGoods,
  recoverGoods: actions.fetchRecoverGoods,
}

export default connect(mapStateToProps, mapDispatchToProps)(GoodsManage);
