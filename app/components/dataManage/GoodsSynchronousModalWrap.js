import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import { Typography, Row, Modal, Progress, Statistic, message } from 'antd';
import * as actions from '../../actions/goods';
import { getGoodsBySku, addGoods } from '../../db/goods';

const { Text, Title } = Typography;

const GoodsSynchronousModalWrap = (WrappedComponent) => class GoodsSynchronousModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      goods: [],
      over: false,
      // 当前条数
      current: 0,
      // 导入提示
      alert: {level: null, msg: ''},
      // 导入错误列表
      errorList: []
    };
    // 导入的数据列表缓存
    this.list = [];
  }

  // 显示数据导入Modal
  show = () => {
    const { goods } = this.state;
    const list = [];
    this.setState({visible: true});
    // 收到导入的结束指令    
    ipcRenderer.on('importGoodsTemplateReply', (event, res) => {
      if (!res.success) {
        this.hide();
        if (res.msg) message.error(res.msg);
      } else {
        this.setState({over: true}, () => {this.over();})
      }
    })
    // 接收数据
    ipcRenderer.on('importGoodsTemplateSendData', (event, {list}) => {
      this.setState({goods: list})
    })
  }
  
  // 隐藏Modal
  hide = () => {
    this.setState({visible: false}, () => {
      this.setState({goods: [], current: 0, over: false})
    });
    this.list = [];
    ipcRenderer.removeAllListeners('importGoodsTemplateReply')
  }

  // 数据导入结束，开始入库
  over = () => {
    const { addGoodsToRedex, fetchGoodsMap, categoryMap } = this.props;
    const { goods, errorList } = this.state;
    const rules = {name: '商品名称', sku: 'SKU', max_count: '个数/箱'};
    const m = '';
    // 获取类目名称同类目的映射关系
    const categoryNameMap = {};
    Object.values(categoryMap).forEach(c => {
      categoryNameMap[c.name] = c;
    })
    console.log('categoryNameMap :', categoryNameMap);
    console.log('goods :', goods);
    goods.forEach(g => {
      const validate = Object.keys(rules).filter(r => !g[r])
      console.log('validate :', validate);
      if (validate.length > 0) {
        this.setState({alert: {level: 'error', msg: `必填项：${validate.map(v => rules[v]).join('，')}为空`}})
      } else {
        const goods = Object.assign({}, g);
        delete goods.category;
        delete goods.index;
        goods.category_id = categoryNameMap[g.category].id;

        console.log('g :', g);
        addGoods(goods).then(res => {
          console.log('res :', res);
        })
      }
    })
  }

  render() {
    const { visible, goods, current, over } = this.state;

    return (
      <>
        <Modal
          title="数据导入"
          width={400}
          visible={visible}
          onCancel={this.hide}
          footer={null}
          forceRender
        >
          <Row>{
            over ? (
              <Statistic title="数据条数" value={current} suffix={`/ ${goods.length}`} style={{float: 'right'}} />
            ) : (
              <Text>数据加载中...</Text>
            )
          }
          </Row>
          <Row>
            <Progress percent={0} />
          </Row>
        </Modal>
        <WrappedComponent showSynchronousModal={this.show} {...this.props} />
      </>
    )
  }
}

export default GoodsSynchronousModalWrap;
