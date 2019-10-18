import React, { Component } from 'react';
import { Modal, Row, Button, Table } from 'antd';
import CategoryForm from './CategoryForm';

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    id: i,
    name: `Edrward ${i}`,
    description: `London Park no. ${i}`,
  });
}
const typeMap = {
  create: 1,
  update: 2,
}

export default class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      type: typeMap.create,
      current: 1,
      pageSize: 10,
    }
  }

  render() {
    const { visible, type, current, pageSize } = this.state;
    const columns = [
      {
        title: '序号',
        width: '8%',
        key: 'index',
        editable: false,
        render: (text,record,index)=>`${(current - 1) * pageSize + index + 1}`
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: '30%',
        key: 'name',
        editable: true,
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: '47%',
        key: 'description',
        editable: true,
      },
      {
        title: '操作',
        width: '15%',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
            <>
              <a onClick={() => {}} style={{marginRight: 15}}>
                编辑
              </a> 
              <a onClick={() => {}}>
                删除
              </a> 
            </>
          ),
      },
    ];
    
    return (
      <>
        <Modal
          title={`${type === typeMap.create ? '新建' : '编辑'}仓库`}
          width={400}
          visible={visible}
          onOk={this.submit}
          onCancel={this.hideModal}
          okText="确定"
          cancelText="取消"
          forceRender={true}
        >
          <CategoryForm />
        </Modal>
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
          columns={columns}
          scroll={{ x: false, y: 380 }}
          onChange={({current, pageSize}) => {this.setState({current, pageSize})}}
        />
      </>
    );
  }
}
