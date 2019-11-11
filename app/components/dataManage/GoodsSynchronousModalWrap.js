import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import { Alert, List, Typography, Row, Modal, Progress, Statistic, message } from 'antd';
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
      feedback: {level: null, msg: ''},
    };
    // 导入错误列表
    this.feedbackList = [];
  }

  // 显示数据导入Modal
  show = () => {
    const { goods } = this.state;
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
      this.setState({goods: [], current: 0, over: false, feedback: {level: null, msg: ''}})
    });
    this.feedbackList = [];
    this.props.fetchGetGoodsList()
    ipcRenderer.removeAllListeners('importGoodsTemplateReply')
  }

  // 数据导入结束，开始入库
  over = () => {
    const { fetchGetGoodsList, categoryMap } = this.props;
    const { goods, feedbackList } = this.state;
    const rules = {name: '商品名称', sku: 'SKU', max_count: '个数/箱'};
    const feedbackHandle = (feedback) => {
      this.setState({feedback})
      this.feedbackList.push(feedback)
    }

    // 获取类目名称同类目的映射关系
    const categoryNameMap = {};
    Object.values(categoryMap).forEach(c => {
      categoryNameMap[c.name] = c;
    })
    goods.forEach((g, i) => {
      const validate = Object.keys(rules).filter(r => !g[r])
      this.setState({current: i+1})
      if (validate.length > 0) {
        feedbackHandle({level: 'danger', msg: `第${i+1}行，必填项：${validate.map(v => rules[v]).join('，')}为空`})
      } else {
        const goodsClone = Object.assign({}, g);
        delete goodsClone.category;
        delete goodsClone.index;
        goodsClone.category_id = categoryNameMap[g.category] ? categoryNameMap[g.category].id : null;
        goodsClone.sku += '';

        // 查找是否存在该sku
        getGoodsBySku(goodsClone.sku).then(res => {
          if (res) {
            feedbackHandle({level: 'warning', msg: `商品：${g.name}（${g.sku}），已存在`})
          } else {
            addGoods(goodsClone).then(res => {
              if (res.success) {
                feedbackHandle({level: 'normal', msg: `商品：${g.name}（${g.sku}），导入成功`})
              } else {
                feedbackHandle({level: 'danger', msg: `商品：${g.name}（${g.sku}），导入失败`})
              }
              return null;
            })
          }
          return null;
        })
      }
    })
  }

  render() {
    const { visible, goods, current, over, feedback: {level, msg} } = this.state;
    const per = isNaN(current/goods.length) ? 0 : Math.floor(current/goods.length * 100 / 100);
    const successCount = this.feedbackList.filter(f => f.level === 'normal').length;
    const totalCount = this.feedbackList.length;
    
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
            {
              per !== 1 ? (
                <>
                  <Text type={(level === 'danger' || level === 'warning') ? level : ''}>
                    {msg}
                  </Text>
                  {
                    over ? (
                      <Statistic title="数据条数" value={current} suffix={`/ ${goods.length}`} style={{float: 'right'}} />
                    ) : (
                      <Text>数据加载中...</Text>
                    )
                  }
                </>
              ) : (
                <Alert message={`导入结束：成功（${successCount}/${totalCount}），失败（${totalCount-successCount}/${totalCount}）`}type="info" style={{marginBottom: 15}} />
              )
            }
          </Row>
          <Row>
            {
              per === 1 ? (
                <List
                  size="small"
                  style={{height: 300, overflow: 'auto'}}
                  bordered
                  dataSource={this.feedbackList}
                  renderItem={({level, msg}) => (
                    <List.Item>
                      <Text type={(level === 'danger' || level === 'warning') ? level : ''}>{msg}</Text>
                    </List.Item>
                  )}
                />
              ) : (
                <Progress percent={per*100} />
              )
            }
          </Row>
        </Modal>
        <WrappedComponent showSynchronousModal={this.show} {...this.props} />
      </>
    )
  }
}

export default GoodsSynchronousModalWrap;
