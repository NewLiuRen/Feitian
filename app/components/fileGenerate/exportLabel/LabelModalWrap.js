import React, { Component } from 'react';
import { Tabs, Modal, Table, Input, message } from 'antd';

const { TabPane } = Tabs;

const OrderModalWrap = (WrappedComponent) => class OrderModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      validate: false,
      data: null,
      warehouse_id: null,
    };
  }

  // 弹出新建订单号Modal
  addGoods = (warehouse_id, data) => {
    this.setState({visible: true, warehouse_id, data});
  }
  
  // 隐藏Modal
  hideModal = () => {
    this.setState({visible: false, validate: false,  warehouse_id: null, data: null});
  }

  // 提交Modal
  submit = () => {
    const { fileInfo, addRecordsOrderNumber, updateRecordsOrderNumber } = this.props;
    const { warehouse_id, } = this.state;
    this.setState({validate: true}, () => {
      this.hideModal()
    });
  }

  render() {
    const { warehouseMap } = this.props;
    const { visible, validate, warehouse_id, data } = this.state;

    const dataSource = data.map()
    
    return (
      <>
        <Modal
          title="新建拼箱"
          width={1000}
          visible={visible}
          onOk={this.submit}
          onCancel={this.hideModal}
          okText="确定"
          cancelText="取消"
          centered
          forceRender
        >
          <Tabs
            tabPosition="top"
            activeKey={activeTab}
            style={{ height: '100%', background: '#fff', paddingRight: 20 }}
            onChange = {(key) => { this.setState({ activeTab: key }) }}
          >
            {
              data ? data.map(order_number => (
                <TabPane onClick={() => {console.log(w)}} tab={
                  <span>
                    {surplusMap[wid] && surplusMap[wid].every(s => s.count === 0) ? <Icon type="check" /> : <Icon type="" />}
                    {`${warehouseMap[wid].name}`}
                  </span>
                  } key={`warehouse_${wid}`
                }>
                  <Table dataSource={dataSource} />
                </TabPane>
              )) : null
            }
          </Tabs>
        </Modal>
        <WrappedComponent add={this.addGoods} {...this.props} />
      </>
    )
  }
}

export default OrderModalWrap;
