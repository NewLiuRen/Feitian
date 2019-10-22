import React, { Component } from 'react';
import { Layout, DatePicker, Form, Input, Divider } from 'antd';
import moment from 'moment';
import fileInfoObj from '../../constants/file'

class FileInfo extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    const date = moment(new Date(), 'YYYY-MM-DD');
    
    return (
      <Layout style={{background: '#fff'}}>
        <Divider orientation="left">基本信息</Divider>
        <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          {getFieldDecorator('id')(<Input type="hidden" />)}
          <Form.Item label="名称">
            {getFieldDecorator('name', {
              initialValue: `${date.format('YYYY.MM.DD')}入仓数fcs`,
              rules: [{
                required: true,
                whitespace: true,
                message: '请输入名称',
              }],
            })(<Input placeholder="请输入名称" />)}
          </Form.Item>
          <Form.Item label="创建时间">
            {getFieldDecorator('create_date', {
              initialValue: date,
              rules: [{ type: 'object', required: true, message: '请输入创建时间' }],
            })(<DatePicker style={{width: '100%'}} />)}
          </Form.Item>
          <Form.Item label="描述">
            {getFieldDecorator('description')(
              <Input placeholder="请输入描述" />,
            )}
          </Form.Item>
        </Form>
      </Layout>
    );
  }
}

const FileInfoForm = Form.create(fileInfoObj)(FileInfo);

export default FileInfoForm;
