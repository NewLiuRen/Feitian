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
      activeTab: '',
    };
  }

  // 弹出新建订单号Modal
  addGoods = (warehouse_id, data) => {
    console.log('data :', data);
    this.setState({visible: true, warehouse_id, data, activeTab: data ? `order_${Object.keys(data)[0]}` : ''});
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
    const { visible, validate, warehouse_id, data, activeTab } = this.state;
    
    const dataSourceMap = {}
    console.log('data :', data);
    if (data) {
      Object.entries(data).forEach(d => {
        const { order_number } = d;
        if (!dataSourceMap[order_number]) dataSourceMap[order_number] = [];
        dataSourceMap[order_number].push(d);
      })
    }
console.log('dataSourceMap :', dataSourceMap);
    const columns = [
      {
        title: '商品',
        width: 150,
        key: 'goods',
        dataIndex: 'goods',
        // fixed: 'left',
      }, {
        title: '类目',
        width: 60,
        key: 'category',
        dataIndex: 'category',
        // fixed: 'left',
        filters: [],
        filterMultiple: true,
        onFilter: (value, record) => record.category === value,
        render: (text, record) => (<CategoryTag category_id={text} />)
      }, {
        title: '个数/箱',
        width: 50,
        key: 'max_count',
        dataIndex: 'max_count',
        // fixed: 'left',
        align: 'right',
      }, {
        title: '数量',
        width: 50,
        key: 'count',
        dataIndex: 'count',
        // fixed: 'left',
        align: 'right',
      }, {
        title: '采购订单号',
        width: 100,
        key: 'order_number',
        dataIndex: 'order_number',
        // fixed: 'left',
        align: 'right',
      }, {
        title: '箱号',
        width: 100,
        key: 'labels',
        dataIndex: 'labels',
        // fixed: 'left',
        align: 'right',
        render: (text, record) => record.labels.join('，')
      }
    ];
    
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
                  <span>{order_number}</span>
                  } key={`order_${order_number}`}
                >
                  <Table
                    dataSource={dataSourceMap[order_number]}
                    columns={columns}
                    scroll={{ x: '100%', y: 'calc(100vh - 440px)' }}
                    pagination={false}
                    size="small"
                  />
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
