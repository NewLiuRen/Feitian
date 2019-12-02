import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Drawer, Layout,  Alert, Icon, Row, Col, Modal, Tabs, Button, message, } from 'antd';
import FileLabelInput from './exportLabel/FileLabelInput';
import FilePreviewTable from './exportLabel/FilePreviewTable';

const { confirm } = Modal;
const { TabPane } = Tabs;

class FileGenerateOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: '',
      visible: false,
    }
  }

  componentDidMount() {
    const { fileWarehouseList } = this.props;
    if (fileWarehouseList) this.setState({activeTab: `warehouse_${fileWarehouseList[0]}`})
    ipcRenderer.on('exportOrderLabelReply', (event, res) => {
      if (res.success) message.success(res.msg)
      else message.error(res.msg)
    })
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('exportOrderLabelReply')
  }

  gotoNextTab = (warehouse_id) => {
    const { fileWarehouseList } = this.props;
    const index = fileWarehouseList.findIndex(wid => parseInt(wid, 10) === parseInt(warehouse_id, 10));
    const active = index === fileWarehouseList.length - 1 ? index : index + 1;
    this.setState({activeTab: `warehouse_${fileWarehouseList[active]}`})
  }

  // 显示预览表格
  showPreview = () => {
    this.setState({ visible: true, });
  }

  // 隐藏预览表格
  hidePreview = () => {
    this.setState({ visible: false, });
  }

  // 导出箱贴
  exportLabel = (differMap) => {
    const totalSurplusCount = Object.entries(differMap).reduce((p, c) => {
      const [wid, dArr] = c;
      return p + dArr.reduce((p, c) => p + c.count, 0);
    }, 0)
    
    if (totalSurplusCount > 0) {
      this.setState({visible: true}, () => {
        confirm({
          title: '提示',
          content: '当前还有未进行拼箱的商品，是否继续导出箱贴？',
          onOk() {
            this.sendDataToMain();
          },
        });
      });
    } else {
      this.sendDataToMain();
    }
  }

  // 向主进程发送数据
  sendDataToMain = () => {
    const { warehouseMap, goodsMap, records, share, fileInfo } = this.props;
    const fileLabelMap = {};

    records.forEach(r => {
      const { count, order_number, goods_id, warehouse_id, labels } = r;
      if (!fileLabelMap[warehouse_id]) fileLabelMap[warehouse_id] = {name: warehouseMap[warehouse_id].name, warehouse_id, full: [], share: []}
      if (labels.length > 0) fileLabelMap[warehouse_id].full.push({count, order_number, goods_id, name: goodsMap[goods_id].name, labels})
    })
    share.forEach(s => {
      const { label, order_number, warehouse_id, goods } = s;
      fileLabelMap[warehouse_id].share.push({ label, order_number, goods: goods.map(({count, goods_id}) => ({count, goods_id, name: goodsMap[goods_id].name})) })
    })

    ipcRenderer.send('exportOrderLabel', { path: localStorage.getItem('exportPath'), create_date: fileInfo.create_date, dataSource: fileLabelMap })
  }

  render() {
    const { fileWarehouseList, warehouseMap, records, surplus, share } = this.props;
    const { activeTab, visible } = this.state;
    const recordsMap = {};
    const surplusMap = {};
    const shareMap = {};
    const differMap = {};
    const orderMap = {};

    records.forEach(r => {
      const wid = r.warehouse_id;
      if (!recordsMap[wid]) recordsMap[wid] = [];
      recordsMap[wid].push(r)
      if (!orderMap[wid]) orderMap[wid] = {};
      orderMap[wid][r.goods_id] = r.order_number
    })

    surplus.forEach(s => {
      const wid = s.warehouse_id;
      if (!surplusMap[wid]) surplusMap[wid] = [];
      surplusMap[wid].push(s)
      if (!differMap[wid]) differMap[wid] = [];
      differMap[wid].push(Object.assign({}, s, {order_number: orderMap[wid][s.goods_id]}))
    })

    share.forEach(s => {
      const wid = s.warehouse_id;
      if (!shareMap[wid]) shareMap[wid] = [];
      shareMap[wid].push(s)
      s.goods.forEach(g => {
        const obj = differMap[wid].find(d => parseInt(d.goods_id, 10) === parseInt(g.goods_id, 10))
        if (obj) {
          obj.count -= g.count;
        }
      })
    })

    return (
      <div className="generate-label-wrap">
        <Row className="generate-label-header" style={{padding: '5px 20px', background: '#fff'}}>
          {/* <Col span={18}>
            <Progress status="normal" percent={0} />
          </Col> */}
          <Col span={24} style={{overflow: 'hidden', textAlign: 'right'}}>
            <Button type="primary" ghost style={{marginRight: 5}} onClick={this.showPreview}>数据预览</Button>
            <Button type="primary" onClick={() => this.exportLabel(differMap)}>箱贴导出</Button>
          </Col>
        </Row>
        <Drawer
          title="剩余商品数量一览"
          style={{overflow: 'hidden'}}
          placement="right"
          width="80%"
          onClose={this.hidePreview}
          visible={this.state.visible}
        >
          <Alert style={{marginBottom: 20}} type="info" message="仓库内数值为该仓库下未成整箱商品的剩余数量(“-”表示该商品全部为整箱或数量为0，无剩余数量)" showIcon />
          <Layout style={{height: 'calc(100vh - 220px)', background: '#ffffff'}}>
            <FilePreviewTable differ={differMap} />
          </Layout>
          <Row style={{marginTop: 20}}>
            <Button type="primary" ghost block onClick={this.hidePreview}>关闭</Button>
          </Row>
        </Drawer>
        <Tabs
          tabPosition="left"
          defaultActiveKey={`warehouse_${fileWarehouseList ? fileWarehouseList[0] : ''}`}
          activeKey={activeTab}
          style={{ height: '100%', background: '#fff', paddingRight: 20 }}
          onChange = {(key) => { this.setState({ activeTab: key }) }}
        >
          {
            fileWarehouseList ? fileWarehouseList.map(wid => (
              <TabPane onClick={() => {console.log(w)}} tab={
                <span>
                  {!differMap[wid] || differMap[wid].every(d => d.count === 0) ? <Icon type="check" /> : null}
                  {`${warehouseMap[wid].name}`}
                </span>
                } key={`warehouse_${wid}`
              }>
                <FileLabelInput records={recordsMap[wid]} surplus={surplusMap[wid]} share={shareMap[wid] || []} differ={differMap[wid]} warehouse_id={wid} gotoNextTab={this.gotoNextTab} />
              </TabPane>
            )) : null
          }
        </Tabs>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  fileInfo: state.fileRecord.file,
  warehouseMap: state.warehouse.map,
  goodsMap: state.goods.map,
  records: state.fileRecord.records,
  surplus: state.fileRecord.surplus,
  share: state.fileRecord.share,
  fileGoods: state.fileRecord.goods,
  fileWarehouseList: state.fileRecord.warehouse,
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(FileGenerateOrder)
