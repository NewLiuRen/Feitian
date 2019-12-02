import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Popover } from 'antd';
import CategoryTag from '../common/CategoryTag';

class FilePreviewTable extends Component {
  render() {
    const { fileInfo, records, share, surplus, warehouseMap, categoryMap, goodsMap } = this.props;
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
        align: 'right',
      }
    ];
    let dataSource = []
    const warehouseList = []
    const categoryFilters = []
    const dataSourceGoodsMap = {}
    const labelMap = {}

    const surplusComp = (list, suffix) => (
      <div>{
        list.map((g, i) => (
          <div style={{marginBottom: 5}} key={`surplus_${suffix}_${g.goods_id}`}>
            <CategoryTag category_id={goodsMap[g.goods_id].category_id} />
            <span>{`${goodsMap[g.goods_id].name}(${goodsMap[g.goods_id].max_count}个/箱)：${g.count}`}</span>
          </div>
        ))
      }</div>
    )

    // 遍历records，计算warehouse列表，及计算每个商品同仓库的对应关系
    // 商品同仓库对应关系格式：{goods_id: {warehouse_id: count}}
    records.forEach(r => {
      if (!warehouseList.find(w => w === r.warehouse_id)) warehouseList.push(r.warehouse_id)
      if (!dataSourceGoodsMap[r.goods_id]) dataSourceGoodsMap[r.goods_id] = {}
      dataSourceGoodsMap[r.goods_id][`warehouse_${r.warehouse_id}`] = r.count;
      if (!labelMap[r.warehouse_id]) labelMap[r.warehouse_id] = {full: 0}
      labelMap[r.warehouse_id].full += r.labels.length;
    })

    // 遍历拼箱，将拼箱数据按照仓库分类，用于计算箱数
    share.forEach(s => {
      if (!labelMap[s.warehouse_id]) labelMap[s.warehouse_id] = {share: 0}
      if (!labelMap[s.warehouse_id].share) labelMap[s.warehouse_id] = Object.assign(labelMap[s.warehouse_id], {share: 0})
      labelMap[s.warehouse_id].share += 1;
    })

    // 根据warehouseList，计算表格列
    warehouseList.sort((a, b) => a.id - b.id).forEach(wid => {
      columns.push({
        title: `${warehouseMap[wid].name}`,
        dataIndex: `warehouse_${wid}`,
        align: 'right',
        render: (text, record, index) => {
          const { key } = record
          if (key === 'warehouse_total') {
            return (<span>{text}</span>)
          } 

          if (key === 'box_total' && !fileInfo.is_import) {
            if (!surplusMap[`warehouse_${wid}`]) {
              return (<span>{text}</span>)
            } 
            return (
              <Popover placement="topLeft" title="剩余商品" content={surplusComp(surplusMap[`warehouse_${wid}`], `warehouse_${wid}`)}>
                <span>{`${text}  (${surplusMap[`warehouse_${wid}`].reduce((p, c) => p + c.count, 0)})`}</span>
              </Popover>
            )
          } 

          if (key === 'box_total' && fileInfo.is_import && fileInfo.is_order) {
            const { full, share } = labelMap[wid];
            return (
              <span>{`${full || 0}${share ? `(拼:${share})` : ''}`}</span>
            )
          }

          return (<span>{text}</span>)
        }
      })
    })
    
    columns.push({
      title: '合计',
      dataIndex: `total`,
      align: 'right',
      render: (text, record, index) => {
        const { key } = record;
        const sum = Object.entries(record).map(([k, v]) => k.includes('warehouse') ? v : null).filter(v => v).reduce((p, c) => p+c, 0)
        if (key === 'box_total' && fileInfo.is_import && fileInfo.is_order) {
          let s = 0
          Object.values(labelMap).forEach(v => {
            s += v.full;
            s += v.share;
          })
          return (<span>{s}</span>)
        }
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
    // 箱数合计
    const totalBox = {
      key: 'box_total',
      goods: '箱数', 
      category: '',
      max_count: '',
      goods_id: '',
    }
    // 仓库剩余商品数量
    const surplusMap = {}
    // 根据dataSourceGoodsMap，计算dataSource
    dataSource = Object.entries(dataSourceGoodsMap).map(([gid, wobj]) => {
      const category_id = goodsMap[gid].category_id || -1
      const max_count = goodsMap[gid].max_count
      const record = {
        key: `record_${gid}`,
        goods: goodsMap[gid].name, 
        category: category_id,
        max_count,
      }
      
      if (!categoryFilters.find(c => c.value === category_id)) categoryFilters.push({ text: categoryMap[category_id] ? categoryMap[category_id].name : '其他', value: category_id,})
      Object.entries(wobj).forEach(([wkey, count]) => {
        if (!totalWarehouse.hasOwnProperty(wkey)) {
          totalWarehouse[wkey] = count
        } else {
          totalWarehouse[wkey] += count
        }
        // 计算仓库总箱数
        if (!totalBox.hasOwnProperty(wkey)) {
          totalBox[wkey] = Math.floor(count/max_count);
        } else {
          totalBox[wkey] += Math.floor(count/max_count);
        }
        // 计算剩余商品数量
        if (count%max_count !== 0) {
          if (!surplusMap[wkey]) surplusMap[wkey] = []
          surplusMap[wkey].push({goods_id: gid, count: count % max_count});
        }
        record[wkey] = count;
      })
      return record;
    }).sort((p, c) => p.category !== c.category ? p.category - c.category : p.goods_id - c.goods_id)

    dataSource.push(totalWarehouse);
    if (!fileInfo.is_import || (fileInfo.is_import && fileInfo.is_order)) dataSource.push(totalBox);
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
  goodsMap: state.goods.map,
  warehouseMap: state.warehouse.map,
  categoryMap: state.category.map,
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(FilePreviewTable)
