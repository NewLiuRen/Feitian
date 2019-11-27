import React, { Component } from 'react';
import { Tabs, Modal, Table, Slider, message } from 'antd';
import CategoryTag from '../../common/CategoryTag';
import { debounce } from '../../../utils';

const { TabPane } = Tabs;

const OrderModalWrap = (WrappedComponent) => class OrderModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      validate: false,
      // {order_number: {count: 0, goods_id: null, category_id: null}}
      data: null,
      warehouse_id: null,
      activeTab: '',
      label: null,
      // [{goods_id: null, count: 0}]
      goods: null,
    };
  }

  // 弹出新建订单号Modal
  addGoods = (warehouse_id, label, data) => {
    const { goodsMap, differ } = this.props;
    const dataFormat = {};

    differ.forEach(d => {
      const { goods_id, order_number, count } = d;
      if (count > 0) {
        if (!dataFormat[order_number]) dataFormat[order_number] = [];
        dataFormat[order_number].push({
          goods_id: parseInt(goods_id, 10),
          count: parseInt(count, 10),
          category_id: goodsMap[goods_id].category_id,
        })
      }
    })

    this.setState({ visible: true, warehouse_id, label, data: dataFormat, activeTab: Object.keys(dataFormat).length > 0 ? `order_${Object.keys(dataFormat)[0]}` : '', goods: [] });
  }
  
  // 隐藏Modal
  hideModal = () => {
    this.setState({visible: false, validate: false,  warehouse_id: null, data: null, goods: null});
  }

  // 存储选择的商品数量
  goodsChange = (count, goods_id) => {
    const { goods } = this.state;
    let newGoods = [];

    // {goods_id: null, count: 0}
    if (goods.find(g => parseInt(g.goods_id, 10) === parseInt(goods_id, 10))) {
      newGoods = goods.map(g => {
        if (parseInt(g.goods_id, 10) === parseInt(goods_id, 10)) {
          return {goods_id, count};
        }
        return g;
      })
    } else {
      newGoods = goods.concat({goods_id, count});
    }

    this.setState({goods: newGoods});
  }

  // 提交Modal
  submit = () => {
    const { addLabel, fileInfo } = this.props;
    const { warehouse_id, label, goods, activeTab } = this.state;
    const order_number = activeTab.split('_')[1];
    if (goods.every(g => g.count === 0)) {
      message.error('商品数量不能全部为0')
      return;
    }

    addLabel(fileInfo.id, {label, order_number, warehouse_id, goods: goods.filter(g => g.count !== 0)});
    this.hideModal();
  }

  render() {
    const { warehouseMap, goodsMap } = this.props;
    const { visible, validate, warehouse_id, data, activeTab, goods } = this.state;

    const columns = [
      {
        title: '商品',
        width: 100,
        key: 'goods_id',
        dataIndex: 'goods_id',
        render: (text, record) => (<span>{goodsMap[text].name}</span>)
        // fixed: 'left',
      }, {
        title: '类目',
        width: 60,
        key: 'category_id',
        dataIndex: 'category_id',
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
        render: (text, record) => (<span>{goodsMap[record.goods_id].max_count}</span>)
      }, {
        title: '数量',
        width: 120,
        key: 'count',
        dataIndex: 'count',
        // fixed: 'left',
        align: 'right',
        render: (text, record) => {
          const flag = Object.keys(goods).length > 0;
          let count = 0;

          if (flag) {
            const g = goods.find(g => parseInt(g.goods_id, 10) === parseInt(record.goods_id, 10))
            if (g) count = g.count;
          }

          return (
            <>
              <div style={{display: 'inline-block', width: '70%', marginRight: 20, verticalAlign: 'middle',}}>
                <Slider value={count} defaultValue={0} max={text} style={{margin: '0'}} onChange={val => {this.goodsChange(val, record.goods_id)}} />
              </div>
              <span style={{display: 'inline-block', width: 40,}}>{`${count}/${text}`}</span>
            </>
          )
        }
      }
    ];

    return (
      <>
        <Modal
          className="label-modal"
          title="新建拼箱"
          width={800}
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
            style={{ height: '100%', background: '#fff' }}
            onChange = {(key) => { this.setState({ activeTab: key, goods: [] }) }}
          >
            {
              data ? Object.entries(data).map(([order_number, dataSource]) => (
                <TabPane onClick={() => {console.log(w)}} tab={
                  <span>{order_number}</span>
                  } key={`order_${order_number}`}
                >
                  <Table
                    dataSource={dataSource}
                    columns={columns}
                    scroll={{ x: '100%', y: 'calc(100vh - 440px)' }}
                    pagination={false}
                    rowKey={r => `${r.order_number}_${r.goods_id}`}
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
