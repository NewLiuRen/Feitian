import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Button } from 'antd';
import CategoryTag from '../common/CategoryTag';

class FilePreviewTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      records: [],
    }
  }

  render() {
    const { records, warehouseMap, categoryMap, goodsMap } = this.props;
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
        filterMultiple: false,
        onFilter: (value, record) => record.category === value,
        render: (text, record) => (<CategoryTag category_id={text} />)
      }
    ];
    let dataSource = []
    const warehouseList = []
    const categoryFilters = []
    const dataSourceGoodsMap = {}

    // 遍历records，计算warehouse列表，及计算每个商品同仓库的对应关系
    // 商品同仓库对应关系格式：{goods_id: {warehouse_id: count}}
    records.forEach(r => {
      if (!warehouseList.find(w => w === r.warehouse_id)) warehouseList.push(r.warehouse_id)
      if (!dataSourceGoodsMap[r.goods_id]) dataSourceGoodsMap[r.goods_id] = {}
      dataSourceGoodsMap[r.goods_id][`warehouse_${r.warehouse_id}`] = r.count;
    })

    // 根据warehouseList，计算表格列
    warehouseList.sort().forEach(wid => {
      columns.push({
        title: `${warehouseMap[wid].name}`,
        dataIndex: `warehouse_${wid}`,
        align: 'right',
      })
    })

    // 根据dataSourceGoodsMap，计算dataSource
    dataSource = Object.entries(dataSourceGoodsMap).map(([gid, wobj]) => {
      const category_id = goodsMap[gid].category_id
      const record = {
        key: `record_${gid}`,
        goods: goodsMap[gid].name, 
        category: category_id || -1,
      }
      if (!categoryFilters.find(c => c.value === category_id || c.value === -1)) categoryFilters.push({ text: categoryMap[category_id] ? categoryMap[category_id].name : '其他', value: category_id || -1,})
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
        scroll={{ x: 700, y: 'calc(100vh - 260px)' }}
        bordered
        pagination={false}
        size="small"
      />
    )
  }
}

const mapStateToProps = state => ({
  goodsMap: state.goods.map,
  warehouseMap: state.warehouse.map,
  categoryMap: state.category.map,
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(FilePreviewTable)
