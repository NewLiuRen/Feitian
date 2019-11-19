import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Row, Col, Progress, Tabs, Table, Input, Button, Popconfirm, Form } from 'antd';
import FileOrderInput from './inputOrder/FileOrderInput';
import * as actions from '../../actions/fileRecord';

const { TabPane } = Tabs;

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

  gotoNextTab = (warehouse_id) => {
    const { fileWarehouseList } = this.props;
    const index = fileWarehouseList.findIndex(wid => parseInt(wid, 10) === parseInt(warehouse_id, 10));
    const active = index === fileWarehouseList.length - 1 ? index : index + 1;
    this.setState({activeTab: `warehouse_${fileWarehouseList[active]}`})
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
      <>
        <Row style={{padding: '5px 20px', background: '#fff'}}>
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
              <TabPane onClick={() => {console.log(w)}} tab={
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
      </>
    )
  }
}

const mapStateToProps = state => ({
  warehouseMap: state.warehouse.map,
  records: state.fileRecord.records,
  fileGoods: state.fileRecord.goods,
  fileWarehouseList: state.fileRecord.warehouse,
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(FileGenerateOrder)
