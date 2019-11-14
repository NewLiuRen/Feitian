import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Form, Button, InputNumber } from 'antd';
import CategoryTag from '../common/CategoryTag';
import * as actions from '../../actions/fileRecord';
import { RECORD } from '../../constants/records';
import { fetchUpdateRecords } from '../../actions/fileRecord';
import { debounce } from '../../utils';

class FileDataInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validate: false,
    }
  }

  // 向库中存入数量
  setCount = debounce(({warehouse_id, goods_id, count}) => {
    if (isNaN(parseInt(count, 10))) return
    const { fileInfo: {id: file_id}, fetchUpdateRecords } = this.props;
    const record = Object.assign({}, RECORD);
    record.warehouse_id = warehouse_id;
    record.goods_id = goods_id;
    record.count = count;
    fetchUpdateRecords(file_id, record);
  })

  render() {
    const { records, warehouseList, warehouseMap, categoryMap, goodsMap } = this.props;
    const { validate } = this.state;
    // const { records } = this.state;
    const columns = [
      {
        title: '商品',
        width: 150,
        key: 'goods',
        dataIndex: 'goods',
        fixed: 'left',
      }, {
        title: '类目',
        width: 100,
        key: 'category',
        dataIndex: 'category',
        fixed: 'left',
        filters: [],
        filterMultiple: true,
        onFilter: (value, record) => record.category === value,
        render: (text, record) => (<CategoryTag category_id={text} />)
      }, {
        title: '个数/箱',
        width: 65,
        key: 'max_count',
        dataIndex: 'max_count',
        fixed: 'left',
        align: 'right',
      }
    ];
    let dataSource = []
    // const warehouseList = []
    const categoryFilters = []
    const dataSourceGoodsMap = {}

    // 遍历records，计算warehouse列表，及计算每个商品同仓库的对应关系
    // 商品同仓库对应关系格式：{goods_id: {warehouse_id: count}}
    records.forEach(r => {
      // if (!warehouseList.find(w => w === r.warehouse_id)) warehouseList.push(r.warehouse_id)
      if (!dataSourceGoodsMap[r.goods_id]) dataSourceGoodsMap[r.goods_id] = {}
      dataSourceGoodsMap[r.goods_id][`warehouse_${r.warehouse_id}`] = r.count;
    })

    // 根据warehouseList，计算表格列
    warehouseList.sort((a, b) => a.id - b.id).forEach(w => {
      columns.push({
        title: `${w.name}`,
        dataIndex: `warehouse_${w.id}`,
        align: 'right',
        render: (text, record, index) => (
            <Form.Item validateStatus={(validate && !text) ? "error" : ""} style={{marginBottom: 0}}>
              <InputNumber value={text} min={0} size="small" onChange={val => {this.setCount({warehouse_id: w.id, goods_id: record.goods_id, count: val})}} />
            </Form.Item>
          )
      })
    })

    // 根据dataSourceGoodsMap，计算dataSource
    dataSource = Object.entries(dataSourceGoodsMap).map(([gid, wobj]) => {
      const category_id = goodsMap[gid].category_id || -1
      const max_count = goodsMap[gid].max_count
      const record = {
        key: `record_${gid}`,
        goods: goodsMap[gid].name, 
        category: category_id,
        max_count,
        goods_id: gid,
      }
      
      if (!categoryFilters.find(c => c.value === category_id)) categoryFilters.push({ text: categoryMap[category_id] ? categoryMap[category_id].name : '其他', value: category_id,})
      Object.entries(wobj).forEach(([wkey, count]) => {
        record[wkey] = count;
      })
      return record;
    })

    columns[1].filters = categoryFilters.sort((a, b) => b.value - a.value);
    
    return (
      <Table
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: '100%', y: 'calc(100vh - 200px)' }}
        bordered
        pagination={false}
        size="small"
      />
    )
  }
}

const mapStateToProps = state => ({
  fileInfo: state.fileRecord.file,
  goodsMap: state.goods.map,
  warehouseList: state.warehouse.list,
  warehouseMap: state.warehouse.map,
  categoryMap: state.category.map,
  records: state.fileRecord.records,
})

const mapDispatchToProps = {
  fetchUpdateRecords: actions.fetchUpdateRecords
}

export default connect(mapStateToProps, mapDispatchToProps)(FileDataInput)
