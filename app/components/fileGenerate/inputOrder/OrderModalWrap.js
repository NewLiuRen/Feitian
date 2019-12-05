import React, { Component } from 'react';
import { Modal, Form, Input, message } from 'antd';
import TransferGoods from '../../common/TransferGoods';

export const TYPE_MAP = {
  create: 1,
  update: 2,
}

const OrderModalWrap = (WrappedComponent) => class OrderModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      type: TYPE_MAP.create,
      validate: false,
      warehouse_id: null,
      old_order_number: '',
      order_number: '',
      fileGoodsIdList: [],
      targetKeys: [],
    };
  }

  // 输入采购订单号
  inputOrderNumber = e => {
    const { value } = e.target;
    this.setState({validate: false, order_number: value})
  }

  // 选择商品
  changeGoodsIdList = goodsIdList => {
    this.setState({targetKeys: goodsIdList})
  }

  // 弹出新建订单号Modal
  addGoods = (warehouse_id, fileGoodsIdList) => {
    this.setState({visible: true, type: TYPE_MAP.create, warehouse_id, fileGoodsIdList});
  }
  
  // 弹出编辑订单号Modal
  editGoods = (warehouse_id, fileGoodsIdList, targetKeys, old_order_number) => {
    this.setState({visible: true, type: TYPE_MAP.update, old_order_number, warehouse_id, order_number: old_order_number, fileGoodsIdList, targetKeys,});
  }

  // 隐藏Modal
  hideModal = () => {
    this.setState({visible: false, validate: false,  warehouse_id: null, old_order_number: '', order_number: '', fileGoodsIdList: [], targetKeys: []});
  }

  // 提交Modal
  submit = () => {
    const { fileInfo, addRecordsOrderNumber, updateRecordsOrderNumber } = this.props;
    const { type, order_number, old_order_number, warehouse_id, targetKeys } = this.state;
    
    this.setState({validate: true}, () => {
      if (!order_number.trim()) return
      if (type === TYPE_MAP.create && targetKeys.length === 0) {
        message.error('请选择商品');
        return
      }
      if (type === TYPE_MAP.create) addRecordsOrderNumber(fileInfo.id, {warehouse_id, goodsIdList: targetKeys, order_number})
      if (type === TYPE_MAP.update) updateRecordsOrderNumber(fileInfo.id, {warehouse_id, goodsIdList: targetKeys, order_number, old_order_number})
      this.hideModal()
    });
  }

  render() {
    const { warehouseMap } = this.props;
    const { type, visible, targetKeys, order_number, validate, fileGoodsIdList, warehouse_id, } = this.state;
    
    return (
      <>
        <Modal
          title={`${type === TYPE_MAP.create ? '新建' : '编辑'}采购订单号（${warehouse_id && warehouseMap[warehouse_id].name}）`}
          width={1000}
          visible={visible}
          onOk={this.submit}
          onCancel={this.hideModal}
          okText="确定"
          cancelText="取消"
          centered
          destroyOnClose
        >
          <Form labelCol={{sm: { span: 3 }}} wrapperCol={{sm: { span: 21 }}}>
            <Form.Item
              label="采购订单号"
              validateStatus={validate && !order_number.trim() ? 'error' : ''}
              help={validate && !order_number.trim() ? '请输入采购订单号' : ''}
            >
              <Input autoFocus placeholder="请输入采购订单号" value={order_number} onChange={e => this.inputOrderNumber(e)}/>
            </Form.Item>
          </Form>
          <TransferGoods fileGoodsIdList={fileGoodsIdList} onChange={this.changeGoodsIdList} targetKeys={targetKeys} />
        </Modal>
        <WrappedComponent add={this.addGoods} edit={this.editGoods} {...this.props} />
      </>
    )
  }
}

export default OrderModalWrap;
