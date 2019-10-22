import React, { Component } from 'react';
import { Row, Col, Tabs, Button, Progress } from 'antd';
import FileInfoForm from './FileInfoForm';
import FileGoodsForm from './FileGoodsForm';
import FileGoodsTable from './FileGoodsTable';

const { TabPane } = Tabs;

export default class FileGenerateTable extends Component {
  render() {
    const goods = ['goods-1', 'goods-2', 'goods-3', 'goods-4', 'goods-5'];
    const tabs = [
      {name: 'warehouse1', goods,},
      {name: 'warehouse2', goods,},
      {name: 'warehouse3', goods,},
      {name: 'warehouse4', goods,},
      {name: 'warehouse5', goods,},
    ]
    return (
      <>
        <Row style={{padding: 5, background: '#fff'}}>
          <Col span={16}>
            <Progress percent={30} />
          </Col>
          <Col span={3} offset={1} style={{overflow: 'hidden', textAlign: 'right'}}><Button type="primary" ghost>数据预览</Button></Col>
          <Col span={3} offset={1}><Button type="primary">输入箱贴</Button></Col>
        </Row>
        <Tabs
          tabPosition="left"
          defaultActiveKey="baseInfo"
          style={{ height: '100%', background: '#fff' }}
        >
          <TabPane tab="基本属性" key="baseInfo">
            <Row>
              <Col span={10}>
                <FileInfoForm />
              </Col>
              <Col span={10} offset={2} style={{overflow: 'auto'}}>
                <FileGoodsForm />
              </Col>
              <Col span={22}><Button type="primary" block>完 成</Button></Col>
            </Row>
          </TabPane>
          {
            tabs.map(tab => (
              <TabPane tab={`${tab.name}`} key={`${tab.name}`}>
                <FileGoodsTable goods={tab.goods} />
              </TabPane>
            ))
          }
        </Tabs>
      </>
    )
  }
}
