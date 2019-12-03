import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Tabs, Button, Progress, Modal, message } from 'antd';
import { addFile, updateFile } from '../../db/file';
import FileInfoForm from './inputData/FileInfoForm';
import FileGoodsList from './inputData/FileGoodsList';
import FileDataInput from './inputData/FileDataInput';
import * as actions from '../../actions/fileRecord';
import { setSelectPathCommand } from '../dataManage/Config';
import routes from '../../constants/routes';

const { TabPane } = Tabs;
const { confirm } = Modal;

class FileGenerateTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'baseInfo',
      // 判断是否为创建状态：
      // redux中file的info中存在属性，且records中存在记录，则为创建状态
      isCreate: true,
      // 是否为录入完成状态
      isDone: false,
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { file, records } = props;
    return {
      isDone: records.length > 0 && !records.some(r => typeof r.count !== 'number'),
      isCreate: Object.keys(file).length === 0 && records.length === 0,
    }
  }

  componentDidMount() {
    const { match: {params: {type} } } = this.props;
    if (type === 'edit') this.setState({activeTab: 'dataInput'})
  }

  // 创建文件
  createFile = () => {
    const { file, fileGoods, setFileInfo, initRecords, addToRecords, setAllGoodsExist, fileWarehouseList, warehouseList, setAllFileWarehouse } = this.props;
    
    const { isCreate } = this.state;
    let goodsIdList = [];
    let warehouseIdList = [];
    Promise.all([
      this.infoFormRef.props.form.validateFields(),
      this.goodsFormRef.props.form.validateFields(),
    ]).then(([infoRes, goodsRes]) => {
      goodsIdList = goodsRes.goods;
      const { create_date, name, description } = infoRes
      const fileInfo = Object.assign({}, file, {create_date, name, description});
      
      fileInfo.create_date = fileInfo.create_date.valueOf();
      
      if (isCreate) return addFile(fileInfo);
      return updateFile(fileInfo);
    }).then(({success, data: file}) => {
      if (!success) {
        message.error(`文件${isCreate ? '创建' : '修改'}失败`);
        return false
      } 
      message.success(`文件${isCreate ? '创建' : '修改'}成功，请录入数据`);
      
      setFileInfo(file);
      // 如果redux的file中warehouse为空，否则为新建状态，仓库列表从redux的warehouse中获取
      warehouseIdList = fileWarehouseList.length>0 ? fileWarehouseList : warehouseList.map(w => w.id);
      if (isCreate) {
        return initRecords(file.id, {warehouseIdList, goodsIdList}) 
      } 
      if (fileGoods.some(g => !g.exist)) {
        return addToRecords(file.id, {warehouseIdList, goodsIdList: fileGoods.filter(g => !g.exist).map(g => g.id)})
      } 
      return null
    }).then(res => {
      // const wList = fileWarehouseList.length>0 ? fileWarehouseList : warehouseList;
      setAllFileWarehouse(warehouseIdList);
      setAllGoodsExist();
      this.setState({activeTab: 'dataInput'});
      return null;
    }).catch(err => {})
  }

  // 切换文件状态至输入箱贴
  changeFileState = () => {
    const { file, updateFileImport, generateFullBoxLabels, history } = this.props;
    confirm({
      title: '提示',
      content: '请确认是否输入箱贴？（更改此状态后，商品数量不可更改）',
      onOk() {
        updateFileImport(file);
        generateFullBoxLabels(file);
        history.replace(routes.FILE_GENERATE_ORDER);
      }
    });
  }

  // 导出文件
  exportData = () => {
    const { file, records, warehouseMap, goodsMap } = this.props;
    const dataSourceGoodsMap = {}
    records.forEach(r => {
      if (!dataSourceGoodsMap[r.goods_id]) dataSourceGoodsMap[r.goods_id] = {}
      dataSourceGoodsMap[r.goods_id][`warehouse_${r.warehouse_id}`] = r.count;
    })
    const dataSource = Object.entries(dataSourceGoodsMap).map(([gid, wobj]) => {
      const {name, sku, max_count} = goodsMap[gid]
      const g = {name, sku, max_count, value: []};
      g.value = Object.entries(wobj).map(([w, v]) => {
        const [prefix, wid] = w.split('_');
        return {name: warehouseMap[wid].name, id: wid, count: v};
      })
      return g
    })

    ipcRenderer.removeAllListeners('exportDataInputReply')
    const path = localStorage.getItem('exportPath');
    if (!path || path === 'null') {
      setSelectPathCommand(() => {
        ipcRenderer.send('exportDataInput', { path, dataSource, fileName: file.name })
      })
    } else {
      ipcRenderer.send('exportDataInput', { path, dataSource, fileName: file.name })
    }
    ipcRenderer.on('exportDataInputReply', (event, res) => {
      if (res.success) message.success(res.msg)
      else message.error(res.msg)
    })
  }

  render() {
    const { records, warehouseList, fileWarehouseList, warehouseMap, } = this.props;
    const { activeTab, isCreate, isDone } = this.state;
    // const wList = fileWarehouseList.length>0 ? fileWarehouseList.map(wid => warehouseMap[wid]) : warehouseList;

    const totalRecords = records.length;
    const currentRecords = records.filter(r => typeof r.count === 'number').length;

    return (
      <>
        <Row style={{padding: '5px 20px', background: '#fff'}}>
          <Col span={18}>
            <Progress status="normal" percent={Math.floor((currentRecords / totalRecords)*100)} />
          </Col>
          <Col span={5} offset={1} style={{overflow: 'hidden', textAlign: 'right'}}>
            {/* <Button type="primary" ghost style={{marginRight: 5}}>数据预览</Button> */}
            <Button type="primary" disabled={!isDone} style={{marginRight: 5}} onClick={this.exportData}>导出数据</Button>
            <Button type="primary" disabled={!isDone} onClick={this.changeFileState}>箱贴录入</Button>
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
              <Col span={22}><Button type="primary" block onClick={this.createFile}>完 成</Button></Col>
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
  goodsMap: state.goods.map,
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
  updateFileImport: actions.fetchUpdateFileImport,
  setAllFileWarehouse: actions.setAllWarehouse,
  generateFullBoxLabels: actions.fetchGenerateFullBoxLabels,
}

export default connect(mapStateToProps, mapDispatchToProps)(FileGenerateTable)
