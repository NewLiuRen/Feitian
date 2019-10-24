import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Tabs, Button, Progress } from 'antd';
import FileInfoForm from './FileInfoForm';
import FileGoodsForm from './FileGoodsForm';
import FileGoodsTable from './FileGoodsTable';
import * as actions from '../../actions/fileRecord';

const { TabPane } = Tabs;

class FileGenerateTable extends Component {
  // 创建文件
  createFile() {
    Promise.all([
      this.infoFormRef.props.form.validateFields(),
      this.goodsFormRef.props.form.validateFields(),
    ]).then(([infoRes, goodsRes]) => {
      console.log('infoRes :', infoRes);
      console.log('goodsRes :', goodsRes);
    }).catch(err => {})
  }

  render() {
    const { warehouseList, file, fileGoods } = this.props;
    const isCreateFile = Object.keys(file).length !== 0 && fileGoods.length > 0;

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
          style={{ height: '100%', background: '#fff' }}
        >
          <TabPane tab="基本属性" key="baseInfo">
            <Row>
              <Col span={10}>
                <FileInfoForm wrappedComponentRef={form => {this.infoFormRef = form} } />
              </Col>
              <Col span={10} offset={2} style={{overflow: 'auto'}}>
                <FileGoodsForm wrappedComponentRef={form => {this.goodsFormRef = form}}/>
              </Col>
              <Col span={22}><Button type="primary" block onClick={() => {this.createFile()}}>完 成</Button></Col>
            </Row>
          </TabPane>
          {
            warehouseList.map(w => (
              <TabPane disabled={!isCreateFile} tab={`${w.name}`} key={`warehouse-${w.id}`}>
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
  file: state.fileRecord.file,
  fileGoods: state.fileRecord.goods,
})

const mapDispatchToProps = {
  setFileInfo: actions.setFile,
  setFileGoods: actions.setGoods,
  addFile: actions.fetchAddFile,
  updateFile: actions.fetchUpdateFile,
}

export default connect(mapStateToProps, mapDispatchToProps)(FileGenerateTable)