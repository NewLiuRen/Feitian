import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Button } from 'antd';
import CategoryTag from '../../common/CategoryTag';

class FilePreviewTable extends Component {
  render() {
    const { records, surplus, warehouseMap, categoryMap, goodsMap } = this.props;
    const columns = [
      {
        title: '商品',
        width: 150,
        key: 'goods',
        dataIndex: 'goods',
        // fixed: 'left',
      }, {
        title: '类目',
        width: 100,
        key: 'category',
        dataIndex: 'category',
        // fixed: 'left',
        filters: [],
        filterMultiple: true,
        onFilter: (value, record) => record.category === value,
        render: (text, record) => (<CategoryTag category_id={text} />)
      }, {
        title: '个数/箱',
        width: 65,
        key: 'max_count',
        dataIndex: 'max_count',
        // fixed: 'left',
        align: 'right'
      }
    ];
    let dataSource = []
    const warehouseList = []
    const categoryFilters = []
    const dataSourceGoodsMap = {}
    const surplusMap = {}
    surplus.forEach(s => {
      if (!surplusMap[s.goods_id]) surplusMap[s.goods_id] = {};
      surplusMap[s.goods_id][s.warehouse_id] = s.count;
    })

    // 遍历records，计算warehouse列表，及计算每个商品同仓库的对应关系
    // 商品同仓库对应关系格式：{goods_id: {warehouse_id: count}}
    records.forEach(r => {
      const { warehouse_id, goods_id, count } = r;
      if (!warehouseList.find(w => w === warehouse_id)) warehouseList.push(warehouse_id)
      if (!dataSourceGoodsMap[goods_id]) dataSourceGoodsMap[goods_id] = {}
      dataSourceGoodsMap[goods_id][`warehouse_${warehouse_id}`] = surplusMap[goods_id] && surplusMap[goods_id][warehouse_id] ? count : null;
    })

    // 根据warehouseList，计算表格列
    warehouseList.sort((a, b) => a.id - b.id).forEach(wid => {
      columns.push({
        title: `${warehouseMap[wid].name}`,
        dataIndex: `warehouse_${wid}`,
        align: 'right',
      render: (text, record) => (<span>{!text ? '-' : text}</span>)
      })
    })
    
    columns.push({
      title: '合计',
      dataIndex: `total`,
      align: 'right',
      render: (text, record, index) => {
        const sum = Object.entries(record).map(([k, v]) => k.includes('warehouse') ? v : null).filter(v => v).reduce((p, c) => p+c, 0)
        return (<span>{sum}</span>)
      }
    })

    // 仓库合计
    const totalWarehouse = {
      key: 'warehouse_total',
      goods: '合计', 
      category: '',
      max_count: '',
      goods_id: '',
    }

    // 根据dataSourceGoodsMap，计算dataSource
    dataSource = Object.entries(dataSourceGoodsMap).map(([gid, wobj]) => {
      const category_id = goodsMap[gid].category_id || -1
      const max_count = goodsMap[gid].max_count
      const record = {
        key: `prev_record_${gid}`,
        goods: goodsMap[gid].name, 
        category: category_id,
        max_count,
        goods_id: gid,
      }
      
      if (!categoryFilters.find(c => c.value === category_id)) categoryFilters.push({ text: categoryMap[category_id] ? categoryMap[category_id].name : '其他', value: category_id,})
      Object.entries(wobj).forEach(([wkey, count]) => {
        if (!totalWarehouse.hasOwnProperty(wkey)) {
          totalWarehouse[wkey] = count
        } else {
          totalWarehouse[wkey] += count
        }
        record[wkey] = count;
      })
      return record;
    })

    dataSource.push(totalWarehouse);
    columns[1].filters = categoryFilters.sort((a, b) => b.value - a.value);

    return (
      <Table
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 700, y: 'calc(100vh - 200px)' }}
        bordered
        pagination={false}
        size="small"
      />
    )
  }
}

const mapStateToProps = state => ({
  records: state.fileRecord.records, 
  surplus: state.fileRecord.surplus,
  goodsMap: state.goods.map,
  warehouseMap: state.warehouse.map,
  categoryMap: state.category.map,
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(FilePreviewTable)
