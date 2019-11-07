import React, { Component } from 'react';
import { Row, Table, Typography, DatePicker } from 'antd';
import ModalDelete from '../common/ModalDelete';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    id: i,
    name: `${(i+'').repeat(5)}`,
    description: `${(i+'').repeat(5)}.description`,
    create_date: Date.now(),
    is_import: i % 2 === 0 ? true : false,
  });
}
export default class FileManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      pageSize: 10,
    }
  }

  // 删除文件
  deleteFile = (file) => {
    ModalDelete(`文件：${file.name}（箱贴${file.is_import ? '已' : '未'}生成）删除后无法恢复！`, () => {
      console.log('file :', file);
    })
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
        width: '40%',
        key: 'name',
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: '15%',
        key: 'description',
      },
      {
        title: '创建时间',
        dataIndex: 'create_date',
        width: '15%',
        key: 'create_date',
      },
      {
        title: '箱贴',
        dataIndex: 'is_import',
        width: '15%',
        key: 'is_import',
        render: (text, record) => {
          return (
            record.is_import ? <Text>已生成</Text> : <Text mark>未生成</Text>
          )
        }
      },
      {
        title: '操作',
        width: '10%',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
            <a onClick={() => {this.deleteFile(record)}}>
              删除
            </a> 
          ),
      },
    ];
    
    return (
      <div style={{overflow: 'hidden'}}>
        <Row>
          <div style={{float: 'right', marginBottom: 10,}}>
            <RangePicker format={'YYYY-MM-DD'} />
          </div>
        </Row>
        <Table
          rowKey={record => `row-${record.id}`}
          dataSource={data}
          columns={columns}
          scroll={{ y: 'calc(100vh - 270px)' }}
          onChange={({current, pageSize}) => {this.setState({current, pageSize})}}
        />
      </div>
    )
  }
}