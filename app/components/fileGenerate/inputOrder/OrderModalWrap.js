import React, { Component } from 'react';
import { Modal, Form,  Input } from 'antd';
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
      order_number: '',
      goodsIdList: [],
    };
  }

  // 输入采购订单号
  inputOrderNumber = e => {
    const { value } = e.target;
    this.setState({validate: false, order_number: value})
  }

  // 选择商品
  changeGoodsIdList = goodsIdList => {
    this.setState({goodsIdList})
  }

  // 弹出新建订单号Modal
  addGoods = (warehouse_id) => {
    this.setState({visible: true, type: TYPE_MAP.create, warehouse_id});
  }
  
  // 弹出编辑订单号Modal
  editGoods = (order_number) => {
    this.setState({visible: true, type: TYPE_MAP.update, order_number});
  }

  // 隐藏Modal
  hideModal = () => {
    this.setState({visible: false});
  }

  // 提交Modal
  submit = () => {
    const { fileInfo, addRecordsOrderNumber } = this.props;
    const { type, order_number, warehouse_id, goodsIdList } = this.state;
    this.setState({validate: true}, () => {
      if (!order_number.trim()) false
      console.log('order_number :', order_number);
      if (type === TYPE_MAP.create) addRecordsOrderNumber(fileInfo.id, {warehouse_id, goodsIdList, order_number})
    });
  }

  render() {
    const { type, visible, order_number, validate } = this.state;
    const goodsIdList = this.props.fileGoodsList.map(g => g.id)

    return (
      <>
        <Modal
          title={`${type === TYPE_MAP.create ? '新建' : '编辑'}商品`}
          width={1000}
          visible={visible}
          onOk={this.submit}
          onCancel={this.hideModal}
          okText="确定"
          cancelText="取消"
          centered
          forceRender
        >
          <Form labelCol={{sm: { span: 3 }}} wrapperCol={{sm: { span: 21 }}}>
            <Form.Item
              label="采购订单号"
              validateStatus={validate && !order_number.trim() ? 'error' : ''}
              help={validate && !order_number.trim() ? '请输入采购订单号' : ''}
            >
              <Input placeholder="请输入采购订单号" value={order_number} onChange={e => this.inputOrderNumber(e)}/>
            </Form.Item>
          </Form>
          <TransferGoods goodsIdList={goodsIdList} onChange={this.changeGoodsIdList} />
        </Modal>
        <WrappedComponent add={this.addGoods} edit={this.editGoods} {...this.props} />
      </>
    )
  }
}

export default OrderModalWrap;
