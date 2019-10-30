import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Select } from 'antd';
import { getGoodsBySku } from '../../db/goods';
import goodsObj from '../../constants/goods';
import { TYPE_MAP } from './GoodsModalWrap';

const Option = Select.Option;

class Goods extends React.Component {
  // 校验sku，不能与库中重复
  checkSKU = (rule, value, callback) => {
    const { type } = this.props;
    if (type === TYPE_MAP.update) {
      callback();
      return;
    }
    
    getGoodsBySku(value).then(goods => {
      if (!goods) callback();
      else callback('SKU不能重复');
    })
  };

  render() {
    const { form: { getFieldDecorator }, categoryList, type } = this.props;

    return (
      <Form layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        {getFieldDecorator('id')(<Input type="hidden" />)}
        <Form.Item label="名称">
          {getFieldDecorator('name', {
            rules: [{
              required: true,
              whitespace: true,
              message: '请输入名称',
            }
          ],
          })(<Input placeholder="请输入名称" />)}
        </Form.Item>
        <Form.Item label="SKU">
          {getFieldDecorator('sku', {
            rules: [{
              required: true,
              whitespace: true,
              message: '请输入SKU值',
            }, {
              validator: this.checkSKU
            }],
          })(
            <Input placeholder="请输入SKU值" disabled={type === TYPE_MAP.update} />,
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
