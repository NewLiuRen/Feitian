import React, { Component } from 'react';
import { Form, Input, Select } from 'antd';
import goodsObj from '../../constants/goods';

class Goods extends React.Component {
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
        <Form.Item label="SKU">
          {getFieldDecorator('sku', {
            rules: [{
              required: true,
              whitespace: true,
              message: '请输入SKU值',
            }],
          })(
            <Input placeholder="请输入SKU值" />,
          )}
        </Form.Item>
        <Form.Item label="描述">
          {getFieldDecorator('description')(
            <Input placeholder="请输入描述" />,
          )}
        </Form.Item>
        <Form.Item label="类目">
          {getFieldDecorator('category_id', {
            initialValue: '1',
          })(
            <Select>
              <Option value="1">Option 1</Option>
              <Option value="2">Option 2</Option>
              <Option value="3">Option 3</Option>
            </Select>
          )}
        </Form.Item>
      </Form>
    );
  }
}

const CategoryForm = Form.create(goodsObj)(Goods);

export default CategoryForm;
