import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Drawer, Layout,  Alert, Icon, Row, Col, Progress, Tabs, Button, } from 'antd';
import FileLabelInput from './exportLabel/FileLabelInput';
import FilePreviewTable from './exportLabel/FilePreviewTable';

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

  render() {
    const { fileWarehouseList, warehouseMap, records, surplus, share } = this.props;
    const { activeTab, visible } = this.state;
    const recordsMap = {};
    const surplusMap = {};
    const shareMap = {};

    records.forEach(r => {
      const wid = r.warehouse_id;
      if (!recordsMap[wid]) recordsMap[wid] = [];
      recordsMap[wid].push(r)
    })
    surplus.forEach(s => {
      const wid = s.warehouse_id;
      if (!surplusMap[wid]) surplusMap[wid] = [];
      surplusMap[wid].push(s)
    })
    share.forEach(s => {
      const wid = s.warehouse_id;
      if (!shareMap[wid]) shareMap[wid] = [];
      shareMap[wid].push(s)
    })

    return (
      <>
        <Row style={{padding: '5px 20px', background: '#fff'}}>
          {/* <Col span={18}>
            <Progress status="normal" percent={0} />
          </Col> */}
          <Col span={24} style={{overflow: 'hidden', textAlign: 'right'}}>
            <Button type="primary" ghost style={{marginRight: 5}} onClick={this.showPreview}>数据预览</Button>
            <Button type="primary" onClick={this.changeFileState}>箱贴导出</Button>
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
          <Alert style={{marginBottom: 20}} type="info" message="仓库内数值为该仓库下未成整箱商品的剩余数量(“-”表示该商品全部为整箱，不含剩余数量)" showIcon />
          <Layout style={{height: 'calc(100vh - 220px)', background: '#ffffff'}}>
            <FilePreviewTable />
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
                  {surplusMap[wid] && surplusMap[wid].every(s => s.count === 0) ? <Icon type="check" /> : null}
                  {`${warehouseMap[wid].name}`}
                </span>
                } key={`warehouse_${wid}`
              }>
                <FileLabelInput records={recordsMap[wid]} surplus={surplusMap[wid]} share={shareMap[wid] || []} warehouse_id={wid} gotoNextTab={this.gotoNextTab} />
              </TabPane>
            )) : null
          }
        </Tabs>
      </>
    )
  }
}

const mapStateToProps = state => ({
  warehouseMap: state.warehouse.map,
  records: state.fileRecord.records,
  surplus: state.fileRecord.surplus,
  share: state.fileRecord.share,
  fileGoods: state.fileRecord.goods,
  fileWarehouseList: state.fileRecord.warehouse,
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(FileGenerateOrder)
