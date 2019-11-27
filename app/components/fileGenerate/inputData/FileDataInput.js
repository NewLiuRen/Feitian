import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Form, Button, InputNumber, Popover } from 'antd';
import CategoryTag from '../../common/CategoryTag';
import * as actions from '../../../actions/fileRecord';
import { RECORD } from '../../../constants/records';
import { debounce } from '../../../utils';

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
  }, 100)

  // 开启校验
  validateOpen = () => {
    this.setState({validate: true});
  }

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
    // const warehouseList = []
    const categoryFilters = []
    const dataSourceGoodsMap = {}
    // 仓库剩余商品数量
    const surplus = {}

    // 遍历records，计算warehouse列表，及计算每个商品同仓库的对应关系
    // 商品同仓库对应关系格式：{goods_id: {warehouse_id: count}}
    records.forEach(r => {
      // if (!warehouseList.find(w => w === r.warehouse_id)) warehouseList.push(r.warehouse_id)
      if (!dataSourceGoodsMap[r.goods_id]) dataSourceGoodsMap[r.goods_id] = {}
      dataSourceGoodsMap[r.goods_id][`warehouse_${r.warehouse_id}`] = r.count;
    })

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
    // 根据warehouseList，计算表格列
    warehouseList.sort((a, b) => a.id - b.id).forEach((w, j) => {
      columns.push({
        title: `${w.name}`,
        dataIndex: `warehouse_${w.id}`,
        align: 'right',
        render: (text, record, index) => {
            const { key } = record
            if (key === 'warehouse_total') {
              return (<span>{text}</span>)
            } 
            if (key === 'box_total') {
              if (!surplus[`warehouse_${w.id}`]) {
                return (<span>{text}</span>)
              } 
              return (
                <Popover placement="topLeft" title="剩余商品" content={surplusComp(surplus[`warehouse_${w.id}`], `warehouse_${w.id}`)}>
                  <span>{`${text}  (${surplus[`warehouse_${w.id}`].reduce((p, c) => p + c.count, 0)})`}</span>
                </Popover>
              )
            } 

            return (
              <Form.Item validateStatus={(validate && typeof(text) !== 'number') ? "error" : ""} style={{marginBottom: 0}}>
                <InputNumber autoFocus={index === 0 && j === 0} value={text} min={0} size="small" onChange={val => {
                  if (val < 0 || typeof val !== 'number') return;
                  this.setCount({warehouse_id: w.id, goods_id: record.goods_id, count: val})}
                } />
              </Form.Item>
            )
          }
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
    // 箱数合计
    const totalBox = {
      key: 'box_total',
      goods: '箱数', 
      category: '',
      max_count: '',
      goods_id: '',
    }
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
          if (!surplus[wkey]) surplus[wkey] = []
          surplus[wkey].push({goods_id: gid, count: count % max_count});
        }
        record[wkey] = count;
      })
      return record;
    }).sort((p, c) => p.category !== c.category ? p.category - c.category : p.goods_id - c.goods_id)

    dataSource.push(totalWarehouse);
    dataSource.push(totalBox);
    columns[1].filters = categoryFilters.sort((a, b) => b.value - a.value);
    
    return (
      <>
        <Table
          className="file-data-input"
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: '100%', y: 'calc(100vh - 210px)' }}
          bordered
          pagination={false}
          size="small"
          style={{height: 'calc(100vh - 180px)'}}
        />
        <Button block type="primary" style={{marginTop: 15}} onClick={this.validateOpen}>完成</Button>
      </>
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
