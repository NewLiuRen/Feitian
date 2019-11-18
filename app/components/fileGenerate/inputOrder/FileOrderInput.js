import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Button } from 'antd';
import CategoryTag from '../../common/CategoryTag';
import OrderModalWrap from './OrderModalWrap';
import * as actions from '../../../actions/fileRecord';

class FileOrder extends Component {

  addOrder = () => {
    this.props.add(this.props.warehouse_id)
  }

  render() {
    const { data, goodsMap, warehouse_id } = this.props;
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
        order_number: d.order_number,
        goods_id: d.goods_id,
      }
    }).sort((p, c) => p.category !== c.category ? p.category - c.category : p.goods_id - c.goods_id)
    const orderDataSource = Object.entries(orderMap).map(([order_number, goods]) => ({
      k: `${warehouse_id}_${order_number}`,
      order_number,
      goods: goods.sort((p, c) => p.id - c.id).map(g => g.name).join('，'),
    }));
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
        width: 65,
        key: 'max_count',
        dataIndex: 'max_count',
        // fixed: 'left',
        align: 'right',
      }, {
        title: '数量',
        width: 65,
        key: 'count',
        dataIndex: 'count',
        // fixed: 'left',
        align: 'right',
      }, {
        title: '采购订单号',
        width: 120,
        key: 'order_number',
        dataIndex: 'order_number',
        // fixed: 'left',
        align: 'right',
      }
    ];
    const orderColumns = [{
      title: '',
      width: 10,
      key: 'index',
      dataIndex: 'index',
      render: (text,record,index) => `${index + 1}`
    }, {
      title: '订单号',
      width: 50,
      key: 'order_number',
      dataIndex: 'order_number',
    }, {
      title: '包含商品',
      width: 150,
      key: 'goods',
      dataIndex: 'goods',
    }];

    return (
      <>
        <div style={{height: 'calc(100vh - 180px)'}}>
          <Table
            className="file-data-input"
            columns={columns}
            dataSource={dataSource}
            scroll={{ x: '100%', y: 'calc(100vh - 480px)' }}
            bordered
            pagination={false}
            size="small"
          />
          <div style={{marginTop: 10, marginBottom: 10, overflow: 'hidden'}}>
            <Button type="primary" style={{float: 'right'}} onClick={this.addOrder}>新增订单</Button>
          </div>
          <Table
            className="file-data-input"
            columns={orderColumns}
            dataSource={orderDataSource}
            scroll={{ x: '100%', y: 'calc(100vh - 1000px)' }}
            bordered
            pagination={false}
            size="small"
          />
        </div>
        <Button block type="success" style={{marginTop: 15}} onClick={this.validateOpen}>完成</Button>
      </>
    )
  }
}

const mapStateToProps = state => ({
  categoryMap: state.category.map,
  goodsMap: state.goods.map,
  fileInfo: state.fileRecord.file,
  fileGoodsList: state.fileRecord.goods,
})

const mapDispatchToProps = {
  addRecordsOrderNumber: actions.fetchAddRecordsOrderNumber
}

const FileOrderInput = OrderModalWrap(FileOrder);

export default connect(mapStateToProps, mapDispatchToProps)(FileOrderInput);
