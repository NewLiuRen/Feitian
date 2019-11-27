import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Row, Col, Progress, Tabs, Table, Input, Button, Popconfirm, Modal } from 'antd';
import FileOrderInput from './inputOrder/FileOrderInput';
import routes from '../../constants/routes';
import * as actions from '../../actions/fileRecord';

const { TabPane } = Tabs;
const { confirm } = Modal;

class FileGenerateOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: '',
    }
  }

  componentDidMount() {
    const { fileWarehouseList } = this.props;
    if (fileWarehouseList) this.setState({activeTab: `warehouse_${fileWarehouseList[0]}`})
  }

  // 切换至下一页签
  gotoNextTab = (warehouse_id) => {
    const { fileWarehouseList } = this.props;
    const index = fileWarehouseList.findIndex(wid => parseInt(wid, 10) === parseInt(warehouse_id, 10));
    const active = index === fileWarehouseList.length - 1 ? index : index + 1;
    this.setState({activeTab: `warehouse_${fileWarehouseList[active]}`})
    if (active === index) this.changeFileState();
  }

  // 跳转至拼箱录入
  changeFileState = () => {
    const { fileInfo, updateFileOrder, clearLabel, history } = this.props;
    console.log('file', fileInfo)
    confirm({
      title: '提示',
      content: `请确认是否输入拼箱箱贴？${fileInfo.is_order ? '(从此进入后已存在拼箱箱贴数据将会清空)' : ''}`,
      onOk() {
        updateFileOrder(fileInfo);
        if (fileInfo.is_order) clearLabel(fileInfo.id);
        history.replace(routes.FILE_GENERATE_LABEL);
      }
    });
  }

  render() {
    const { fileWarehouseList, warehouseMap, records } = this.props;
    const { activeTab } = this.state;
    const recordsMap = {};
    const percent = Math.floor(records.filter(r => r.order_number).length / records.length * 100);

    records.forEach(r => {
      const wid = r.warehouse_id;
      if (!recordsMap[wid]) recordsMap[wid] = [];
      recordsMap[wid].push(r)
    })

    return (
      <div className="generate-order-wrap">
        <Row className="generate-order-header" style={{padding: '5px 20px', background: '#fff'}}>
          <Col span={18}>
            <Progress status="normal" percent={percent} />
          </Col>
          <Col span={5} offset={1} style={{overflow: 'hidden', textAlign: 'right'}}>
            {/* <Button type="primary" ghost style={{marginRight: 5}}>数据预览</Button> */}
            <Button type="primary" disabled={percent !== 100} onClick={this.changeFileState}>拼箱录入</Button>
          </Col>
        </Row>
        <Tabs
          tabPosition="left"
          defaultActiveKey={`warehouse_${fileWarehouseList ? fileWarehouseList[0] : ''}`}
          activeKey={activeTab}
          style={{ height: '100%', background: '#fff', paddingRight: 20 }}
          onChange = {(key) => { this.setState({ activeTab: key }) }}
        >
          {
            fileWarehouseList ? fileWarehouseList.map(wid => (
              <TabPane tab={
                <span>
                  {recordsMap[wid].filter(g => !g.order_number).length === 0 ? <Icon type="check" /> : null}
                  {`${warehouseMap[wid].name}`}
                </span>
                } key={`warehouse_${wid}`
              }>
                <FileOrderInput data={recordsMap[wid]} warehouse_id={wid} gotoNextTab={this.gotoNextTab} />
              </TabPane>
            )) : null
          }
        </Tabs>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  warehouseMap: state.warehouse.map,
  records: state.fileRecord.records,
  fileInfo: state.fileRecord.file,
  fileGoods: state.fileRecord.goods,
  fileWarehouseList: state.fileRecord.warehouse,
})

const mapDispatchToProps = {
  updateFileOrder: actions.fetchUpdateFileOrder,
  clearLabel: actions.fetchClearLabel,
}

export default connect(mapStateToProps, mapDispatchToProps)(FileGenerateOrder)
