import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import { Row, Modal, Progress, Statistic, message } from 'antd';
import { connect } from 'react-redux';
import * as actions from '../../actions/goods';
import { getGoodsBySku, addGoods } from '../../db/goods';

const GoodsSynchronousModalWrap = (WrappedComponent) => class GoodsSynchronousModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      over: false,
      goods: [],
      // 当前条数
      current: 0,
    };
  }

  // 显示数据导入Modal
  show = () => {
    const { goods } = this.state;
    this.setState({visible: true});
    // 收到导入的结束指令    
    ipcRenderer.on('importGoodsTemplateReply', (event, res) => {
      console.log('res :', res);
      if (!res.success) {
        this.hide();
        message.error(res.msg);
      } else {
        this.setState({over: true});
      }
    })
    // 接收数据
    ipcRenderer.on('importGoodsTemplateSendData', (event, g) => {
      console.log('res :', g);
      this.setState({goods: goods.concat(g)})
    })
  }
  
  // 隐藏Modal
  hide = () => {
    this.setState({visible: false, goods: [], current: 0});
    ipcRenderer.removeAllListeners('importGoodsTemplateSendData')
  }

  // 数据导入结束
  over = () => {
    const { addGoodsToRedex, fetchGoodsMap, categoryMap } = this.props;
    const { goods } = this.state;
    // 获取类目名称同类目的映射关系
    const categoryNameMap = {};
    Object.values(categoryMap).forEach(c => {
      categoryNameMap[c.name] = c;
    })
    console.log('categoryNameMap :', categoryNameMap);
    console.log('goods :', goods);
    // goods.forEach(g => {

    // })
  }

  render() {
    const { visible, goods, current } = this.state;

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
          <Row>
            <Statistic title="数据条数" value={current} suffix={`/ ${goods.length}`} />
          </Row>
          <Row>
            <Progress percent={0} />
          </Row>
        </Modal>
        <WrappedComponent showSynchronousModal={this.show} overSynchronous={this.over} {...this.props} />
      </>
    )
  }
}

export default GoodsSynchronousModalWrap;
