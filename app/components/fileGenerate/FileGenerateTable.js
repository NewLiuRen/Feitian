import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Tabs, Button, Progress, message } from 'antd';
import { addFile, updateFile } from '../../db/file';
import FileInfoForm from './FileInfoForm';
import FileGoodsList from './FileGoodsList';
import FileDataInput from './FileDataInput';
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

  componentDidMount() {
    const { match: {params: {type} } } = this.props;
    if (type === 'edit') this.setState({activeTab: 'dataInput'})
  }

  // 创建文件
  createFile() {
    const { file, setFileInfo, initRecords, addToRecords, setAllGoodsExist, fileWarehouseList, warehouseList } = this.props;
    
    const { isCreate } = this.state;
    let goodsIdList = [];
    Promise.all([
      this.infoFormRef.props.form.validateFields(),
      this.goodsFormRef.props.form.validateFields(),
    ]).then(([infoRes, goodsRes]) => {
      goodsIdList = goodsRes.goods;
      const { create_date, name, description } = infoRes
      const fileInfo = Object.assign({}, file, {create_date, name, description});
      
      fileInfo.create_date = fileInfo.create_date.valueOf();
      
      if (isCreate) return addFile(fileInfo);
      else return updateFile(fileInfo);
    }).then(({success, data: file}) => {
      if (!success) {
        message.error(`文件${isCreate ? '创建' : '修改'}失败`);
        return false
      } 
      message.success(`文件${isCreate ? '创建' : '修改'}成功，请录入数据`);
      
      setFileInfo(file);
      // 如果redux的file中warehouse为空，否则为新建状态，仓库列表从redux的warehouse中获取
      const warehouseIdList = fileWarehouseList.length>0 ? fileWarehouseList : warehouseList.map(w => w.id);
      if (isCreate) return initRecords(file.id, {warehouseIdList, goodsIdList})
      else return addToRecords(file.id, {warehouseIdList, goodsIdList})
    }).then(() => {
      // const wList = fileWarehouseList.length>0 ? fileWarehouseList : warehouseList;
      setAllGoodsExist();
      this.setState({activeTab: 'dataInput'});
      return null;
    }).catch(err => {})
  }

  render() {
    const { warehouseList, fileWarehouseList, warehouseMap, } = this.props;
    const { activeTab, isCreate } = this.state;
    // const wList = fileWarehouseList.length>0 ? fileWarehouseList.map(wid => warehouseMap[wid]) : warehouseList;

    return (
      <>
        <Row style={{padding: 5, background: '#fff'}}>
          {/* <Col span={16}>
            <Progress percent={0} />
          </Col> */}
          <Col span={24} style={{paddingRight: 15, overflow: 'hidden', textAlign: 'right'}}>
            {/* <Button type="primary" ghost style={{marginRight: 5}}>数据预览</Button> */}
            <Button type="primary" disabled style={{marginRight: 5}}>导出数据</Button>
            <Button type="primary" disabled>输入箱贴</Button>
          </Col>
        </Row>
        <Tabs
          tabPosition="left"
          defaultActiveKey="baseInfo"
          activeKey={activeTab}
          style={{ height: '100%', background: '#fff', paddingRight: 20 }}
          onChange = {(key) => { this.setState({ activeTab: key }) }}
        >
          <TabPane tab="基本属性" key="baseInfo">
            <Row>
              <Col span={10}>
                <FileInfoForm isCreate={isCreate} wrappedComponentRef={form => {this.infoFormRef = form} } />
              </Col>
              <Col span={10} offset={2} style={{overflow: 'auto'}}>
                <FileGoodsList isCreate={isCreate} wrappedComponentRef={form => {this.goodsFormRef = form}} {...this.props}/>
              </Col>
              <Col span={22}><Button type="primary" block onClick={() => {this.createFile()}}>完 成</Button></Col>
            </Row>
          </TabPane>
          <TabPane tab="数据录入" disabled={isCreate} key="dataInput">
            <FileDataInput />
          </TabPane>
          {/* {
            wList.map(w => (
              <TabPane onClick={() => {console.log(w)}} disabled={isCreate} tab={`${w.name}`} key={`warehouse-${w.id}`}>
                <FileGoodsDetail warehouse={w} />
              </TabPane>
            ))
          } */}
        </Tabs>
      </>
    )
  }
}

const mapStateToProps = state => ({
  warehouseList: state.warehouse.list,
  warehouseMap: state.warehouse.map,
  records: state.fileRecord.records,
  file: state.fileRecord.file,
  fileGoods: state.fileRecord.goods,
  fileWarehouseList: state.fileRecord.warehouse,
})

const mapDispatchToProps = {
  setFileInfo: actions.setFile,
  setFileGoods: actions.setGoods,
  setAllGoodsExist: actions.setAllGoodsExist,
  updateFile: actions.fetchUpdateFile,
  initRecords: actions.fetchInitRecords,
  addToRecords: actions.fetchAddToRecords,
}

export default connect(mapStateToProps, mapDispatchToProps)(FileGenerateTable)