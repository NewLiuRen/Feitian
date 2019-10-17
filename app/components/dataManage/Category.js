import React, { Component } from 'react';
import { Row, Button, Table } from 'antd';

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    id: i,
    name: `Edrward ${i}`,
    description: `London Park no. ${i}`,
  });
}
export default class Category extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '序号',
        width: '8%',
        editable: false,
        title: '序号',
        render: (text,record,index)=>`${index+1}`
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: '30%',
        editable: true,
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: '47%',
        editable: true,
      },
      {
        title: '操作',
        width: '15%',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <>
              <a onClick={() => {}} style={{marginRight: 15}}>
                编辑
              </a> 
              <a onClick={() => {}}>
                删除
              </a> 
            </>
          )
        },
      },
    ];
  }

  render() {
    return (
      <>
        <Row>
          <div style={{float: 'right'}}>
            <Button onClick={this.handleAdd} type="primary" style={{marginBottom: 15}}>
              添加类目
            </Button>
          </div>
        </Row>
        <Table
          rowKey={record => `row-${record.id}`}
          dataSource={data}
          columns={this.columns}
          scroll={{ x: false, y: 400 }}
        />
      </>
    );
  }
}
