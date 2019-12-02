import React, { Component } from 'react';
import { Modal, Form, Input, message } from 'antd';
import TransferGoods from '../../common/TransferGoods';

const InputModalWrap = (WrappedComponent) => class InputModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      validate: false,
      warehouse_id: null,
      order_number: '',
      fileGoodsIdList: [],
      targetKeys: [],
      cb: null,
    };
  }

  // 选择商品
  changeGoodsIdList = goodsIdList => {
    this.setState({targetKeys: goodsIdList})
  }

  // 弹出新建订单号Modal
  addGoods = (warehouse_id, fileGoodsIdList) => {
    this.setState({visible: true, warehouse_id, fileGoodsIdList});
  }
  
  // 隐藏Modal
  hideModal = () => {
    this.setState({visible: false, validate: false,  warehouse_id: null, order_number: '', fileGoodsIdList: [], targetKeys: [], cb: null});
  }

  // 提交Modal
  submit = () => {
    const { fileInfo } = this.props;
    const { targetKeys } = this.state;
    if (targetKeys.length === 0) {
      message.error('请选择商品');
      return
    }
    console.log('targetKeys :', targetKeys.sort());
    console.log('props :', this.props);
  }

  render() {
    const { warehouseMap } = this.props;
    const { type, visible, targetKeys, order_number, validate, fileGoodsIdList, warehouse_id, } = this.state;
    
    return (
      <>
        <Modal
          title="批量新建商品"
          width={1000}
          visible={visible}
          onOk={this.submit}
          onCancel={this.hideModal}
          okText="确定"
          cancelText="取消"
          centered
          destroyOnClose
        >
          <TransferGoods fileGoodsIdList={fileGoodsIdList} onChange={this.changeGoodsIdList} targetKeys={targetKeys} />
        </Modal>
        <WrappedComponent batchAdd={this.addGoods} {...this.props} />
      </>
    )
  }
}

export default InputModalWrap;
