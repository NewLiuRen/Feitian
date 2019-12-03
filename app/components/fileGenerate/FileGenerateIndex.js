import { ipcRenderer } from 'electron';
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

  // 导入模板 
  importTemplate = () => {
    const { warehouse: warehouseList, goods: goodsList } = this.props;
    if (warehouseList.length === 0 || goodsList.length === 0) return
    ipcRenderer.removeAllListeners('importRecordsTemplateReply');
    ipcRenderer.removeAllListeners('importRecordsTemplateSendData');
    ipcRenderer.send('importRecordsTemplate', {warehouseList, goodsList});
    ipcRenderer.on('importRecordsTemplateReply', (event, arg) => {
      console.log('arg :', arg);
    });
    ipcRenderer.on('importRecordsTemplateSendData', (event, arg) => {
      console.log('arg :', arg);
    });
  }

  render() {
    const { warehouse, goods } = this.props;
    const titleComp = (
      <div className={style['file-generate-btn']}>
        <h3>新建数据文件</h3>
        <p>创建流程为：选择商品 -> 录入商品数据 -> 导出入仓数 -> 输入订单号 -> 选择拼箱 -> 导出箱贴</p>
      </div>
    )

    return (
      <Row style={{height: '100%', margin: 0,}} align="middle" justify="space-around" type="flex" gutter={16}>
        <Col span={8} offset={2}>{
          (warehouse.length>0 && goods.length>0) ?
          (<Link to={`${routes.FILE_GENERATE_TABLE}/new`}>{titleComp}</Link>) :
          (titleComp)
        }</Col>
        <Col span={8} offset={2}>
          <div className={style['file-generate-btn']} onClick={this.importTemplate}>
            <h3>入仓数文件导入</h3>
            <p>创建流程为：入仓文件导入(excel文件中需将待导入的sheet放在首个位置, 且必须包含名为“SKU”的列) -> 输入订单号 -> 选择拼箱 -> 导出箱贴</p>
          </div>
        </Col>
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
