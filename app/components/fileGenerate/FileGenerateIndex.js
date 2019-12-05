import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Row, Col, Button, Modal, Alert, List, Typography, message, notification } from 'antd';
import { FILE } from '../../constants/file';
import { GOODS_TMP } from '../../constants/goods';
import { addFile } from '../../db/file';
import routes from '../../constants/routes.json';
import style from './FileGenerateIndex.scss';
import * as actions from '../../actions/fileRecord';

const { Text, Title } = Typography;

class FileGenerateIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      errorCount: 0,
      totalCount: 0,
      errorList: [],
    }
  }

  componentDidMount() {
    const { warehouse, goods, history, clearFile, setFileInfo, setFileGoods, setAllGoodsExist, setAllFileWarehouse, addRecords, addFileGoods } = this.props;
    
    ipcRenderer.on('importRecordsTemplateReply', (event, arg) => {
      if (arg.success) {
        message.success('导入成功');
        this.show();
      } else if (arg.msg) {
        message.error(`${arg.msg}`);
      }
    });
    ipcRenderer.on('importRecordsTemplateSendData', (event, arg) => {
      const { error, records } = arg;
      this.setState({errorList: error, errorCount: error.length, totalCount: records.length});
      if (records.length > 0) {
        const d = new Date();
        const fileInfo = Object.assign({}, FILE, {name: `${moment(d).format('YY.MM.DD')}入仓数fcs`, create_date: d.getTime(),})
        addFile(fileInfo).then(({success, data: file}) => {
          if (!success) {
            message.error('文件创建失败');
            return {success: false}
          } 
          setFileInfo(file);
          setAllFileWarehouse(warehouse.map(w => w.id));
          return addRecords(file.id, records)
        }).then(({success}) => {
          if (success !== false) {
            const fileGoods = [...new Set(records.map(d => d.goods_id))].forEach((goods_id, index) => {
              if (index > 0) addFileGoods();
              setFileGoods({index, goods_id})
            });
            setAllGoodsExist();
          }
        })
      }
    });

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

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('importRecordsTemplateReply');
    ipcRenderer.removeAllListeners('importRecordsTemplateSendData');
  }

  // 导入模板 
  importTemplate = () => {
    const { warehouse: warehouseList, goods: goodsList } = this.props;
    if (warehouseList.length === 0 || goodsList.length === 0) return
    
    ipcRenderer.send('importRecordsTemplate', {warehouseList, goodsList});
  }

  // 打开提示Modal
  show = () => {
    this.setState({visible: true});
  }

  // 关闭提示Modal
  hide = () => {
    const { history } = this.props;
    this.setState({visible: false});
    history.replace(`${routes.FILE_GENERATE_TABLE}/edit`);
  }

  render() {
    const { warehouse, goods } = this.props;
    const { visible, errorCount, totalCount, errorList } = this.state;

    const titleComp = (
      <div className={style['file-generate-btn']}>
        <h3>新建数据文件</h3>
        <p>创建流程为：选择商品 -> 录入商品数据 -> 导出入仓数 -> 输入订单号 -> 选择拼箱 -> 导出箱贴</p>
      </div>
    )

    return (
      <>
        <Modal
          title="数据导入"
          width={400}
          visible={visible}
          onCancel={this.hide}
          footer={null}
          forceRender
        >
          <Row>
            <Alert message={`导入结束：成功（${totalCount - errorCount}/${totalCount}），失败（${errorCount}/${totalCount}）`} type="info" style={{marginBottom: 15}} />
          </Row>
          {
            errorList.length > 0 ? (
              <Row>
                <List
                  size="small"
                  style={{height: 300, overflow: 'auto'}}
                  bordered
                  dataSource={errorList}
                  renderItem={({sku, rowNumber}) => (
                    <List.Item>
                      <Text type="danger">{`不存在SKU为: ${sku}的数据(行号: ${rowNumber})`}</Text>
                    </List.Item>
                  )}
                />
              </Row>
            ) : null
          }
        </Modal>
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
      </>
    )
  }

}

const mapStateToProps = state => ({
  warehouse: state.warehouse.list,
  goods: state.goods.list,
})

const mapDispatchToProps = {
  setFileInfo: actions.setFile,
  setFileGoods: actions.setGoods,
  addFileGoods: actions.addGoods,
  setAllGoodsExist: actions.setAllGoodsExist,
  addRecords: actions.fetchAddRecords,
  setAllFileWarehouse: actions.setAllWarehouse,
  clearFile: actions.clearFileRecord
}

export default connect(mapStateToProps, mapDispatchToProps)(FileGenerateIndex)
