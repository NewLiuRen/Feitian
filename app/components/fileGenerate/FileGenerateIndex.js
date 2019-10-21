import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'antd';
import routes from '../../constants/routes.json';
import style from './FileGenerateIndex.scss';

export default class FileGenerateIndex extends Component {
  render() {
    return (
      <Row style={{height: '100%', margin: 0,}} align="middle" justify="space-around" type="flex" gutter={16}>
        <Col span={3}></Col>
        <Col span={6}><Link to={routes.File_GENERATE_TABLE}><div className={style['file-generate-btn']}>新建数据文件</div></Link></Col>
        <Col span={6}><Link to={routes.File_VIEW_TABLE}><div className={style['file-generate-btn']}>模板新建文件</div></Link></Col>
        <Col span={6}><div className={style['file-generate-btn']}>文件导入合并</div></Col>
        <Col span={3}></Col>
      </Row>
    )
  }
}