import React, { Component } from 'react';
import { Table, Button } from 'antd';

export default class FilePreviewTable extends Component {

  render() {
    const columns = [
      {
        title: 'Full Name',
        width: 100,
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
      },
    ]

    return (
      <Table columns={columns} dataSource={data} scroll={{ x: 1500, y: 300 }} />
    )
  }
}