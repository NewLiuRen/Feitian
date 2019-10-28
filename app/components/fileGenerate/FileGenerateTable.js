import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Tabs, Button, Progress, message } from 'antd';
import { addFile } from '../../db/file';
import FileInfoForm from './FileInfoForm';
import FileGoodsForm from './FileGoodsForm';
import FileGoodsTable from './FileGoodsTable';
import * as actions from '../../actions/fileRecord';

const { TabPane } = Tabs;

class FileGenerateTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'baseInfo',
      // 判断是否为创建状态：
      // redux中file的info中存在属性，且records中存在记录，则为创建状态
      isCreate: true,
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { file, records } = props;
    return {
      isCreate: Object.keys(file).length === 0 && records.length === 0,
    }
  }

  // 创建文件
  createFile() {
    const { setFileInfo, initRecords, fileWarehouseList, warehouseList } = this.props;
    let goodsIdList = [];
    Promise.all([
      this.infoFormRef.props.form.validateFields(),
      this.goodsFormRef.props.form.validateFields(),
    ]).then(([infoRes, goodsRes]) => {
      goodsIdList = goodsRes.goods;
      const fileInfo = Object.assign({}, infoRes);
      fileInfo.create_date = fileInfo.create_date.valueOf();
      return addFile(fileInfo)
    }).then(({success, data: file}) => {
      if (!success) {
        message.error('文件创建失败');
        return false
      } 
        message.success('文件创建成功，请录入数据');
      
      setFileInfo(file);
      // 如果redux的file中warehouse为空，否则为新建状态，仓库列表从redux的warehouse中获取
      return initRecords(file.id, {warehouseIdList: fileWarehouseList.length>0 ? fileWarehouseList : warehouseList.map(w => w.id), goodsIdList})

    }).then(() => {
      const wList = fileWarehouseList.length>0 ? fileWarehouseList : warehouseList;
      this.setState({activeTab: `warehouse-${wList[0].id}`})
    }).catch(err => {})
  }

  render() {
    const { warehouseList, fileWarehouseList, } = this.props;
    const { activeTab, isCreate } = this.state;
    const wList = fileWarehouseList.length>0 ? fileWarehouseList : warehouseList;

    return (
      <>
        <Row style={{padding: 5, background: '#fff'}}>
          <Col span={16}>
            <Progress percent={0} />
          </Col>
          <Col span={7} offset={1} style={{overflow: 'hidden', textAlign: 'right'}}>
            <Button type="primary" ghost style={{marginRight: 5}}>数据预览</Button>
            <Button type="primary" disabled style={{marginRight: 5}}>导出数据</Button>
            <Button type="primary" disabled>输入箱贴</Button>
          </Col>
        </Row>
        <Tabs
          tabPosition="left"
          defaultActiveKey="baseInfo"
          activeKey={activeTab}
          style={{ height: '100%', background: '#fff' }}
          onChange = {(key) => { this.setState({ activeTab: key }) }}
        >
          <TabPane tab="基本属性" key="baseInfo">
            <Row>
              <Col span={10}>
                <FileInfoForm isCreate={isCreate} wrappedComponentRef={form => {this.infoFormRef = form} } />
              </Col>
              <Col span={10} offset={2} style={{overflow: 'auto'}}>
                <FileGoodsForm isCreate={isCreate} wrappedComponentRef={form => {this.goodsFormRef = form}}/>
              </Col>
              <Col span={22}><Button type="primary" block onClick={() => {this.createFile()}}>完 成</Button></Col>
            </Row>
          </TabPane>
          {
            wList.map(w => (
              <TabPane onClick={() => {console.log(w)}} disabled={isCreate} tab={`${w.name}`} key={`warehouse-${w.id}`}>
                <FileGoodsTable warehouse={w} />
              </TabPane>
            ))
          }
        </Tabs>
      </>
    )
  }
}

const mapStateToProps = state => ({
  warehouseList: state.warehouse.list,
  records: state.fileRecord.records,
  file: state.fileRecord.file,
  fileGoods: state.fileRecord.goods,
  fileWarehouseList: state.fileRecord.warehouse,
})

const mapDispatchToProps = {
  setFileInfo: actions.setFile,
  setFileGoods: actions.setGoods,
  updateFile: actions.fetchUpdateFile,
  initRecords: actions.fetchInitRecords,
}

export default connect(mapStateToProps, mapDispatchToProps)(FileGenerateTable)