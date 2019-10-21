import React, { Component } from 'react';
import { Layout, Divider, Form, TreeSelect, Icon, Button } from 'antd';
import style from './FileGoodsForm.scss';

const { TreeNode } = TreeSelect;

let id = 1;

class FileGoods extends Component {
  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    const layout = this.refs.goodsLayout;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    }, () => layout.scrollTop = layout.scrollHeight);
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names } = values;
        console.log('Received values of form: ', values);
        console.log('Merged values:', keys.map(key => names[key]));
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    getFieldDecorator('keys', { initialValue: [0] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? '商品' : ''}
        required={false}
        key={k}
      >
        {getFieldDecorator(`names[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              message: "请选择商品",
            },
          ],
        })(
          <TreeSelect
            showSearch
            style={{ width: '90%', marginRight: 8 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择商品"
            allowClear
            treeDefaultExpandAll
          >
            <TreeNode value="parent 1" title="parent 1" key="0-1">
              <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
                <TreeNode value="leaf1" title="my leaf" key="random" />
                <TreeNode value="leaf2" title="your leaf" key="random1" />
              </TreeNode>
              <TreeNode value="parent 1-1" title="parent 1-1" key="random2">
                <TreeNode value="sss" title={<b style={{ color: '#08c' }}>sss</b>} key="random3" />
              </TreeNode>
            </TreeNode>
          </TreeSelect>
        )}
        {keys.length > 1 ? (
          <Icon
            className={style['delete-button']}
            type="minus-circle-o"
            onClick={() => this.remove(k)}
            style={{fontSize: 16, color: '#F04A4A'}}
          />
        ) : null}
      </Form.Item>
    ));
    return (
      <Layout>
        <Divider orientation="left">商品列表</Divider>
        <div ref="goodsLayout" style={{height: 'calc(100vh - 250px)', marginBottom: 30,  overflow: 'auto'}}>
          <Form onSubmit={this.handleSubmit}>
            {formItems}
            <Form.Item {...formItemLayoutWithOutLabel}>
              <Button type="dashed" onClick={this.add} style={{ width: '90%' }}>
                <Icon type="plus" /> 添加商品
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Layout>
    );
  }
}

const FileGoodsForm = Form.create()(FileGoods);

export default FileGoodsForm;
