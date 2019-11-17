import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Button } from 'antd';
import CategoryTag from '../../common/CategoryTag';

class FileOrderInput extends Component {
  render() {
    const { data, goodsMap } = this.props;
    const dataSource = data.map(d => ({
      key: `record_${d.goods_id}`,
      goods: goodsMap[d.goods_id].name, 
      category: d.category_id,
      max_count: d.max_count,
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
  categoryMap: state.category.map,
  goodsMap: state.goods.map
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(FileOrderInput);
