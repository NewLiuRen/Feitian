import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'antd';
import style from './FileGenerateIndex.scss';

export default class FileGenerateIndex extends Component {
  render() {
    const newButton = (name) => {
      return (
        <div className={style['file-generate-btn']}>{name}</div>
      )
    }

    return (
      <Row style={{height: '100%', margin: 0,}} align="middle" justify="space-around" type="flex" gutter={16}>
        <Col span={3}></Col>
        <Col span={6}>{newButton('新建数据文件')}</Col>
        <Col span={6}>{newButton('模板新建文件')}</Col>
        <Col span={6}>{newButton('文件导入合并')}</Col>
        <Col span={3}></Col>
      </Row>
    )
  }
}