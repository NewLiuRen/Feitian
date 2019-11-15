import React, { Component } from 'react';
import { Row, Col, Progress, Tabs, Table, Input, Button, Popconfirm, Form } from 'antd';

const { TabPane } = Tabs;

export default class FileGenerateOrder extends Component {
  render() {
    return (
      <>
        <Row style={{padding: '5px 20px', background: '#fff'}}>
          <Col span={18}>
            <Progress status="normal" percent={Math.floor((currentRecords / totalRecords)*100)} />
          </Col>
          <Col span={5} offset={1} style={{overflow: 'hidden', textAlign: 'right'}}>
            {/* <Button type="primary" ghost style={{marginRight: 5}}>数据预览</Button> */}
            <Button type="primary" disabled={!isDone} style={{marginRight: 5}} onClick={this.exportData}>导出数据</Button>
            <Button type="primary" disabled={!isDone} onClick={this.changeFileState}>输入箱贴</Button>
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