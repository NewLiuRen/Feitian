import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Select } from 'antd';
import goodsObj from '../../constants/goods';

const Option = Select.Option;

class Goods extends React.Component {
  render() {
    const { form: { getFieldDecorator }, categoryList } = this.props;

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
            initialValue: null
          })(
            <Select>
              <Option key={'category-option-none'} value={null}>-----无-----</Option>
              {
                categoryList.map(c => (
                  <Option key={`category-option-${c.id}`} value={c.id}>{c.name}</Option>
                ))
              }
            </Select>
          )}
        </Form.Item>
      </Form>
    );
  }
}

const CategoryForm = Form.create(goodsObj)(Goods);

const mapStateToProps = state => ({
  categoryList: state.category.list
})

export default connect(mapStateToProps)(CategoryForm);
