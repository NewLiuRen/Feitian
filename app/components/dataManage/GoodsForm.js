import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Input, InputNumber, Select } from 'antd';
import { getGoodsBySku } from '../../db/goods';
import goodsObj from '../../constants/goods';
import { TYPE_MAP } from './GoodsModalWrap';

const Option = Select.Option;

class Goods extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sku: ''
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { goods } = props;
    const { sku } = state;

    if (goods && goods.sku !== sku) return {sku: goods.sku};
    return null
  }

  // 校验sku，不能与库中重复
  checkSKU = (rule, value, callback) => {
    const { sku } = this.state;

    try {
      const { type } = this.props;
      // 若value中的sku值与原表单中的值相同，证明为编辑状态，且值未变化
      // 故不校验
      if (!value.trim() || value === sku) {
        callback();
        return;
      }
  
      getGoodsBySku(value).then(goods => {
        if (!goods) callback();
        else callback('SKU不能重复');
      })
    } catch(err) {
      callback();
    }
  };

  render() {
    const { form: { getFieldDecorator }, categoryList, goods } = this.props;

    return (
      <Form layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        {getFieldDecorator('id', {
          initialValue: goods && goods.id
        })(<Input type="hidden" />)}
        <Form.Item label="名称">
          {getFieldDecorator('name', {
            initialValue: goods && goods.name,
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
            initialValue: goods && goods.sku,
            rules: [{
              required: true,
              whitespace: true,
              message: '请输入SKU值',
            }, {
              validator: this.checkSKU
            }],
          })(
            <Input placeholder="请输入SKU值"/>,
          )}
        </Form.Item>
        <Form.Item label="个数/箱">
          {getFieldDecorator('max_count', {
            initialValue: goods && goods.max_count,
            rules: [{
              required: true,
              message: '请输入每箱个数',
            }],
          })(
            <InputNumber min={1} placeholder="请输入每箱个数" style={{width: '100%'}} />,
          )}
        </Form.Item>
        <Form.Item label="描述">
          {getFieldDecorator('description', {
            initialValue: goods && goods.description,
          })(
            <Input placeholder="请输入描述" />,
          )}
        </Form.Item>
        <Form.Item label="类目">
          {getFieldDecorator('category_id', {
            initialValue: goods && goods.category_id,
          })(
            <Select>
              <Option key="category-option-none" value={null}>-----无-----</Option>
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
