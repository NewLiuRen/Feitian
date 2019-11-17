import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Button } from 'antd';
import CategoryTag from '../../common/CategoryTag';

class FileOrderInput extends Component {

  addOrder = () => {

  }

  render() {
    const { data, goodsMap } = this.props;
    const dataSource = data.map(d => ({
      key: `record_${d.goods_id}`,
      goods: goodsMap[d.goods_id].name, 
      category: goodsMap[d.goods_id].category_id,
      max_count: goodsMap[d.goods_id].max_count,
      count: d.count,
      order_number: d.order_number,
    }))
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
    const orderDataSource = [];

    return (
      <>
        <div style={{height: 'calc(100vh - 180px)'}}>
          <Table
            className="file-data-input"
            columns={columns}
            dataSource={dataSource}
            scroll={{ x: '100%', y: 'calc(100vh - 400px)' }}
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
            scroll={{ x: '100%', y: 'calc(100vh - 900px)' }}
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
  goodsMap: state.goods.map
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(FileOrderInput);
