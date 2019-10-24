import React, { Component } from 'react';
import { Row, Col, Skeleton, Card, Icon, Tooltip, Modal, } from 'antd';
import { connect } from 'react-redux';
import * as actions from '../../actions/warehouse';

import style from './Warehouse.scss';

import ModalDelete from '../common/ModalDelete';
import WarehouseForm from './WarehouseForm';

const { Meta } = Card;
const typeMap = {
  create: 1,
  update: 2,
}

class Warehouse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      type: typeMap.create,
    }
  }
  
  // 弹出新建仓库Modal
  addWarehouse = () => {
    this.setState({visible: true, type: typeMap.create});
  }
  
  // 弹出编辑仓库Modal
  editWarehouse = (warehouse) => {
    const self = this;
    this.setState({visible: true, type: typeMap.update}, () => {
      self.formRef.props.form.setFieldsValue({...warehouse});
    });
  }

  // 冻结仓库
  freezeWarehouse = (warehouse) => {
    const { freezeWarehouse } = this.props;

    ModalDelete(`仓库：${warehouse.name}`, () => {
      freezeWarehouse(warehouse.id);
    })
  }

  // 隐藏Modal
  hideModal = () => {
    this.setState({visible: false});
    this.formRef.props.form.resetFields();
  }

  // 提交Modal
  submit = () => {
    const form = this.formRef.props.form;
    const { addWarehouse, editWarehouse } = this.props;
    const { type } = this.state;

    form.validateFields((errors, warehouse) => {
      if (type === typeMap.create) {
        addWarehouse(warehouse);
      } else if (type === typeMap.update) {
        editWarehouse(warehouse);
      }
      this.hideModal();
    })
  }

  render() {
    const { visible, type } = this.state;
    const { warehouseList } = this.props;

    const warehouseCard = (warehouse) => (
        <Card
          style={{ marginBottom: 15 }}
          actions={[
            <Tooltip placement="bottom" title="编辑" onClick={() => this.editWarehouse(warehouse)}><Icon type="edit" key="edit" /></Tooltip>,
            <Tooltip placement="bottom" title="删除" onClick={() => this.freezeWarehouse(warehouse)}><Icon type="delete" key="delete" /></Tooltip>,
          ]}
        >
          <Skeleton loading={false} avatar active>
            <Meta
              avatar={<Icon type="bank" style={{color: '#79b2ea'}} />}
              title={warehouse.name}
              description={
                <Tooltip placement="bottomLeft" title={warehouse.description}><div className={style['card-description']}>{warehouse.description}</div></Tooltip>
              }
              style={{color: 'blue'}}
            />
          </Skeleton>
        </Card>
      )

    return (
      <>
        <Modal
          title={`${type === typeMap.create ? '新建' : '编辑'}仓库`}
          width={400}
          visible={visible}
          onOk={this.submit}
          onCancel={this.hideModal}
          okText="确定"
          cancelText="取消"
          forceRender
        >
          <WarehouseForm wrappedComponentRef={(form) => this.formRef = form} />
        </Modal>
        <Row gutter={16}>
          {
            warehouseList.map(w => (
              <Col span={6} key={`warehouse-${w.id}`}>{ warehouseCard(w) }</Col>
            ))
          }
          <Col span={6}>
            <div className={style['add-btn']} onClick={this.addWarehouse}>
              <Icon type="plus" style={{fontSize: 48, fontWeight: 'bold', color: '#1890ff'}}/>
            </div>
          </Col>
        </Row>
      </>
    )
  }
}

const mapStateToProps = state => ({ warehouseList: state.warehouse.list })

const mapDispatchToProps = { 
  addWarehouse: actions.fetchAddWarehouse,
  editWarehouse: actions.fetchUpdateWarehouse,
  freezeWarehouse: actions.fetchFreezeWarehouse,
};

export default connect(mapStateToProps, mapDispatchToProps)(Warehouse)
