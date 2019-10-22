import React, { Component } from 'react';
import { Row, Table, Switch, Input, Typography } from 'antd';

const { Text } = Typography;

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    id: i,
    sku: `${(i+'').repeat(10)}`,
    name: `Edrward ${i}`,
    category_id: `${i}`,
    description: `London Park no. ${i}`,
    is_del: i % 2 === 0 ? true : false,
  });
}

export default class GoodsManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      pageSize: 10,
    }
  }

  render() {
    const { current, pageSize } = this.state;
    const columns = [
      {
        title: '',
        width: '5%',
        key: 'index',
        render: (text,record,index)=>`${(current - 1) * pageSize + index + 1}`
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: '30%',
        key: 'name',
      },
      {
        title: 'SKU',
        dataIndex: 'sku',
        width: '20%',
        key: 'sku',
      },
      {
        title: '类目',
        dataIndex: 'category_id',
        width: '15%',
        key: 'category_id',
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: '15%',
        key: 'description',
      },
      {
        title: '操作',
        width: '15%',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <Switch checkedChildren="正常" unCheckedChildren="冻结" checked={!record.is_del} />
        ),
      },
    ];
    
    return (
      <>
        <Row>
          <div style={{float: 'right', marginBottom: 10,}}>
            <Input style={{width: 300}} placeholder="请输入搜索关键词：名称、SKU、类目" />
          </div>
        </Row>
        <Table
          rowKey={record => `row-${record.id}`}
          dataSource={data}
          columns={columns}
          scroll={{ y: 'calc(100vh - 270px)' }}
          onChange={({current, pageSize}) => {this.setState({current, pageSize})}}
        />
      </>
    )
  }
}