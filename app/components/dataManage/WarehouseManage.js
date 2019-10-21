import React, { Component } from 'react';
import { Row, Table, Switch, Input, Typography } from 'antd';

const { Text } = Typography;

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    id: i,
    name: `${(i+'').repeat(5)}`,
    description: `${(i+'').repeat(5)}.description`,
    is_del: i % 2 === 0 ? true : false,
  });
}
export default class WarehouseManage extends Component {
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
        width: '35%',
        key: 'name',
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: '25%',
        key: 'description',
      },
      {
        title: '创建时间',
        dataIndex: 'create_date',
        width: '20%',
        key: 'create_date',
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
            <Input placeholder="请输入搜索关键词：名称" />
          </div>
        </Row>
        <Table
          rowKey={record => `row-${record.id}`}
          dataSource={data}
          columns={columns}
          scroll={{ x: false, y: 400 }}
          onChange={({current, pageSize}) => {this.setState({current, pageSize})}}
        />
      </>
    )
  }
}