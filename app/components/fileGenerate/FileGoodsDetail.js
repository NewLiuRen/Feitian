import React, { Component } from 'react';
import { Table, Input, Button, Popconfirm, Form } from 'antd';

export default class FileGoodsDetail extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      dataSource: [
        {
          key: '0',
          goods_id: '1',
          sku: '323232',
          count: '',
          max_count: '',
          order_number: '',
        },
        {
          key: '1',
          goods_id: '2',
          sku: '11111111',
          count: '',
          max_count: '',
          order_number: '',
        },
        {
          key: '2',
          goods_id: '2',
          sku: '11111111',
          count: '',
          max_count: '',
          order_number: '',
        },
        {
          key: '3',
          goods_id: '2',
          sku: '11111111',
          count: '',
          max_count: '',
          order_number: '',
        },
        {
          key: '4',
          goods_id: '2',
          sku: '11111111',
          count: '',
          max_count: '',
          order_number: '',
        },
        {
          key: '5',
          goods_id: '2',
          sku: '11111111',
          count: '',
          max_count: '',
          order_number: '',
        },
        {
          key: '6',
          goods_id: '2',
          sku: '11111111',
          count: '',
          max_count: '',
          order_number: '',
        },
        {
          key: '7',
          goods_id: '2',
          sku: '11111111',
          count: '',
          max_count: '',
          order_number: '',
        },
        {
          key: '8',
          goods_id: '2',
          sku: '11111111',
          count: '',
          max_count: '',
          order_number: '',
        },
        {
          key: '9',
          goods_id: '2',
          sku: '11111111',
          count: '',
          max_count: '',
          order_number: '',
        },
        {
          key: '10',
          goods_id: '2',
          sku: '11111111',
          count: '',
          max_count: '',
          order_number: '',
        },
        {
          key: '11',
          goods_id: '2',
          sku: '11111111',
          count: '',
          max_count: '',
          order_number: '',
        },
        {
          key: '12',
          goods_id: '2',
          sku: '11111111',
          count: '',
          max_count: '',
          order_number: '',
        },
        {
          key: '13',
          goods_id: '2',
          sku: '11111111',
          count: '',
          max_count: '',
          order_number: '',
        },
        {
          key: '14',
          goods_id: '2',
          sku: '11111111',
          count: '',
          max_count: '',
          order_number: '',
        },
        {
          key: '15',
          goods_id: '2',
          sku: '11111111',
          count: '',
          max_count: '',
          order_number: '',
        },
      ],
      count: 2,
      current: 1,
      pageSize: 10,
    };
  }

  render() {
    const { dataSource, current, pageSize } = this.state;
    const columns = [
      {
        title: '',
        width: '5%',
        key: 'index',
        render: (text,record,index)=>`${(current - 1) * pageSize + index + 1}`
      },
      {
        title: '商品',
        dataIndex: 'goods_id',
        width: '35%',
        render: (text,record,index)=>`${record.good_id}`
      },
      {
        title: 'SKU',
        dataIndex: 'sku',
        width: '18%',
      },
      {
        title: '数量',
        dataIndex: 'count',
        width: '10%',
        render: () =>
          (<Input size="small" />)
      },
      {
        title: '每箱数量',
        dataIndex: 'max_count',
        width: '12%',
        render: () =>
          (<Input size="small" />)
      },
      {
        title: '箱号',
        dataIndex: 'order_number',
        width: '20%',
        render: () =>
          (<Input size="small" />)
      },
    ];

    return (
      <div style={{padding: 10}}>
        <Table
          size="small"
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
          scroll={{ y: 'calc(100vh - 230px)' }}
          pagination={false}
        />
        <Button type="primary" block ghost style={{marginTop: 15}}>完 成</Button>
      </div>
    );
  }
}