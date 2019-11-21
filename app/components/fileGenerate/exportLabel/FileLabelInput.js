import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Form, Button, Slider, Popover, Popconfirm } from 'antd';
import CategoryTag from '../../common/CategoryTag';
import LabelModalWrap from './LabelModalWrap';
import * as actions from '../../../actions/fileRecord';

class FileLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  // 批量添加订单号
  addLabel = () => {
    const { data } = this.props;
    const fileGoodsIdList = data.filter(d => !d.order_number).map(d => d.goods_id);
    this.props.add(this.props.warehouse_id, fileGoodsIdList)
  }
  
  // 批量修改订单号
  editOrder = (record) => {
    const { data } = this.props;
    const { order_number, goods } = record;
    const goodsIdList = goods.split('，').map(gid => parseInt(gid, 10));
    const fileGoodsIdList = data.filter(d => !d.order_number).map(d => d.goods_id).concat(goodsIdList);
    this.props.edit(this.props.warehouse_id, fileGoodsIdList, goodsIdList, order_number)
  }
  
  // 批量删除订单号
  deleteOrder = (record) => {
    const { deleteRecordsOrderNumber, fileInfo, warehouse_id } = this.props;
    deleteRecordsOrderNumber(fileInfo.id, {warehouse_id, goodsIdList: record.goods.split('，').map(g => parseInt(g, 10)), order_number: record.order_number})
  }

  // 修改单个订单号
  changOrderNumber = (goods_id, order_number) => {
    const { changeRecordOrderNumber, fileInfo, warehouse_id } = this.props;
    changeRecordOrderNumber(fileInfo.id, {warehouse_id, goods_id, order_number})
  }

  render() {
    const { data, goodsMap, warehouse_id, } = this.props;
    const done = data.filter(d => !d.order_number).length === 0;

    const orderMap = {};
    const dataSource = data.map(d => {
      const { order_number } = d;
      if (!orderMap[order_number]) orderMap[order_number] = [];
      orderMap[order_number].push(goodsMap[d.goods_id]);
      return {
        key: `record_${d.goods_id}`,
        goods: goodsMap[d.goods_id].name, 
        category: goodsMap[d.goods_id].category_id,
        max_count: goodsMap[d.goods_id].max_count,
        count: d.count,
        labels: d.labels,
        order_number: d.order_number,
        goods_id: d.goods_id,
      }
    }).sort((p, c) => p.category !== c.category ? p.category - c.category : p.goods_id - c.goods_id)
    const orderDataSource = Object.entries(orderMap).map(([order_number, goods]) => ({
      key: `${warehouse_id}_${order_number}`,
      order_number,
      goods: goods.sort((p, c) => p.id - c.id).map(g => g.id).join('，'),
    })).filter(d => d.order_number);
    const columns = [
      {
        title: '商品',
        width: 150,
        key: 'goods',
        dataIndex: 'goods',
        // fixed: 'left',
      }, {
        title: '类目',
        width: 60,
        key: 'category',
        dataIndex: 'category',
        // fixed: 'left',
        filters: [],
        filterMultiple: true,
        onFilter: (value, record) => record.category === value,
        render: (text, record) => (<CategoryTag category_id={text} />)
      }, {
        title: '个数/箱',
        width: 50,
        key: 'max_count',
        dataIndex: 'max_count',
        // fixed: 'left',
        align: 'right',
      }, {
        title: '数量',
        width: 50,
        key: 'count',
        dataIndex: 'count',
        // fixed: 'left',
        align: 'right',
      }, {
        title: '采购订单号',
        width: 100,
        key: 'order_number',
        dataIndex: 'order_number',
        // fixed: 'left',
        align: 'right',
      }, {
        title: '箱号',
        width: 100,
        key: 'labels',
        dataIndex: 'labels',
        // fixed: 'left',
        align: 'right',
        render: (text, record) => { 
          console.log('record :', record);
          return record.labels.join('，') }
      }
    ];
    const orderColumns = [{
      title: '箱采购订单号',
      width: 50,
      key: 'order_number',
      dataIndex: 'order_number',
    }, {
      title: '箱号',
      width: 50,
      key: 'label',
      dataIndex: 'label',
    }, {
      title: '包含商品',
      width: 150,
      key: 'goods',
      dataIndex: 'goods',
      render: (text,record,index) => {
        const idList = text.split('，');
        return (
          <div>{
            idList.map((gid, i) => (
              <Popover key={`order_number_${gid}`} placement="topLeft" title="商品信息" content={
                <div>
                  <CategoryTag category_id={goodsMap[gid].category_id} />
                  <span>{`${goodsMap[gid].name}(${goodsMap[gid].sku})`}</span>
                </div>
              }>
                <span style={{cursor: 'default'}}>{`${goodsMap[gid].name}${i !== idList.length - 1 ? '，' : ''}`}</span>
              </Popover>
              
            ))
          }</div>
        )
      }
    }, {
      title: '操作',
      width: 20,
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record) => (
        <>
          <Popconfirm
            placement="topRight"
            title={`是否确定删除，订单： ${record.order_number}`}
            onConfirm={() => this.deleteOrder(record)}
          >
            <a onClick={() => {}}>
              删除
            </a> 
          </Popconfirm>
        </>
      ),
    }];

    return (
      <>
        <div style={{height: 'calc(100vh - 180px)'}}>
          <Table
            className="file-label-show"
            columns={columns}
            dataSource={dataSource}
            scroll={{ x: '100%', y: 'calc(100vh - 440px)' }}
            bordered
            pagination={false}
            size="small"
          />
          <div style={{marginTop: 10, marginBottom: 10, overflow: 'hidden'}}>
            <Button type="primary" style={{float: 'right'}} onClick={this.addLabel}>新增拼箱</Button>
          </div>
          <Table
            className="file-label-input"
            columns={orderColumns}
            dataSource={orderDataSource}
            scroll={{ x: '100%', y: 'calc(100vh - 550px)' }}
            bordered
            pagination={false}
            size="small"
          />
        </div>
        <Button disabled={!done} block type="primary" style={{marginTop: 15}} onClick={this.validateOpen}>完成</Button>
      </>
    )
  }
}

const mapStateToProps = state => ({
  warehouseMap: state.warehouse.map,
  categoryMap: state.category.map,
  goodsMap: state.goods.map,
  fileInfo: state.fileRecord.file,
  fileGoodsList: state.fileRecord.goods,
})

const mapDispatchToProps = {
  addRecordsOrderNumber: actions.fetchAddRecordsOrderNumber,
  updateRecordsOrderNumber: actions.fetchUpdateRecordsOrderNumber,
  changeRecordOrderNumber: actions.fetchChangeRecordOrderNumber,
  deleteRecordsOrderNumber: actions.fetchDeleteRecordsOrderNumber,
}

const FileOrderInput = LabelModalWrap(FileLabel);

export default connect(mapStateToProps, mapDispatchToProps)(FileOrderInput);
