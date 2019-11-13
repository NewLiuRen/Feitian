import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Button, notification } from 'antd';
import routes from '../../constants/routes.json';
import style from './FileGenerateIndex.scss';
import * as actions from '../../actions/fileRecord';

class FileGenerateIndex extends Component {
  componentDidMount() {
    const { warehouse, goods, history, clearFile } = this.props;

    // 进入新建时清空数据
    clearFile();

    const notificationGenerate = ({description, key, fn}) => {
      notification.info({
        message: '注意',
        description,
        duration: 0,
        key,
        btn: (
          <Button type="primary" size="small" onClick={() => {
            notification.close(key)
            fn();
          }}>
            点击前往录入
          </Button>
        )
      })
    }

    if (warehouse.length === 0) {
      notificationGenerate({
        description: '您还没有仓库记录，无法新建数据文件',
        key: 'warehouse-key',
        fn: () => history.replace(routes.DATA_MANAGE_WAREHOUSE)
      })
    }
    
    setTimeout(() => {
      if (goods.length === 0) {
        notificationGenerate({
          description: '您还没有商品记录，无法新建数据文件',
          key: 'goods-key',
          fn: () => history.replace(routes.DATA_MANAGE_GOODS)
        })
      }
    }, 0)
  }

  render() {
    const { warehouse, goods } = this.props;
    return (
      <Row style={{height: '100%', margin: 0,}} align="middle" justify="space-around" type="flex" gutter={16}>
        <Col span={3}></Col>
        <Col span={6}>{
          (warehouse.length>0 && goods.length>0) ?
          (<Link to={`${routes.File_GENERATE_TABLE}/new`}><div className={style['file-generate-btn']}>新建数据文件</div></Link>) :
          (<div className={style['file-generate-btn']}>新建数据文件</div>)
        }</Col>
        <Col span={6}><Link to={routes.File_VIEW_TABLE}><div className={style['file-generate-btn']}>模板新建文件</div></Link></Col>
        <Col span={6}><div className={style['file-generate-btn']}>文件导入合并</div></Col>
        <Col span={3}></Col>
      </Row>
    )
  }

}

const mapStateToProps = state => ({
  warehouse: state.warehouse.list,
  goods: state.goods.list,
})

const mapDispatchToProps = {
  clearFile: actions.clearFileRecord
}

export default connect(mapStateToProps, mapDispatchToProps)(FileGenerateIndex)
