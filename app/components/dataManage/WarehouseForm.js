import React, { Component } from 'react';
import { Form, Icon, Input, } from 'antd';
import warehouseObj from '../../constants/warehouse';

class Warehouse extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        {getFieldDecorator('id')(<Input type="hidden" />)}
        <Form.Item label="名称">
          {getFieldDecorator('name', {
            rules: [{
              required: true,
              whitespace: true,
              message: '请输入名称',
            }],
          })(<Input placeholder="请输入名称" />)}
        </Form.Item>
        <Form.Item label="描述">
          {getFieldDecorator('description')(
            <Input placeholder="请输入描述" />,
          )}
        </Form.Item>
      </Form>
    );
  }
}

const WarehouseForm = Form.create(warehouseObj)(Warehouse);

export default WarehouseForm;
