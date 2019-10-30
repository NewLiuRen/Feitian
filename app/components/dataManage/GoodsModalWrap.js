import React, { Component } from 'react';
import { Modal } from 'antd';
import GoodsForm from './GoodsForm';

export const TYPE_MAP = {
  create: 1,
  update: 2,
}

const GoodsModalWrap = (WrappedComponent) => {
  return class GoodsModal extends Component {
    constructor(props) {
      super(props);
      this.formRef = null;
      this.state = {
        visible: false,
        type: TYPE_MAP.create,
      };
    }
  
    // 弹出新建仓库Modal
    addGoods = () => {
      this.setState({visible: true, type: TYPE_MAP.create});
    }
    
    // 弹出编辑仓库Modal
    editGoods = (category) => {
      const params = Object.assign({}, category);
      delete params.key;
      const self = this;
      this.setState({visible: true, type: TYPE_MAP.update}, () => {
        self.formRef.props.form.setFieldsValue({...params});
      });
    }
  
    // 隐藏Modal
    hideModal = () => {
      this.setState({visible: false});
      this.formRef.props.form.resetFields();
    }
  
    // 提交Modal
    submit = () => {
      const { addGoods, editGoods } = this.props;
      const { type } = this.state;
      const form = this.formRef.props.form;
  
      form.validateFields((errors, category) => {
        if (errors) return
        if (type === TYPE_MAP.create) {
          addGoods(category);
        } else if (type === TYPE_MAP.update) {
          editGoods(category);
        }
        this.hideModal();
      })
    }
  
    render() {
      const { type, visible } = this.state;

      return (
        <>
          <Modal
            title={`${type === TYPE_MAP.create ? '新建' : '编辑'}商品`}
            width={400}
            visible={visible}
            onOk={this.submit}
            onCancel={this.hideModal}
            okText="确定"
            cancelText="取消"
            forceRender
          >
            <GoodsForm type={type} wrappedComponentRef={form => this.formRef = form} />
          </Modal>
          <WrappedComponent add={this.addGoods} edit={this.editGoods} {...this.props} />
        </>
      )
    }
  }
}

export default GoodsModalWrap;