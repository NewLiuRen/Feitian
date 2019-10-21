import React, { Component } from 'react';
import { Row, Col, Skeleton, Card, Icon, Tooltip, Modal, } from 'antd';
import style from './Warehouse.scss';

import ModalDelete from '../common/ModalDelete';
import WarehouseForm from './WarehouseForm';

const { Meta } = Card;
const typeMap = {
  create: 1,
  update: 2,
}

export default class Warehouse extends Component {
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
    ModalDelete(`仓库：${warehouse.name}`, () => {
      console.log('freeze warehouse success');
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
    const { type } = this.state;

    form.validateFields((errors, values) => {
      console.log('errors :', errors);
      console.log('values :', values);
      if (type === typeMap.create) {
        console.log('create');
      } else if (type === typeMap.update) {
        console.log('update');
      }
    })
  }

  render() {
    const { visible, type } = this.state;

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
          <Col span={6}>
            {
              warehouseCard({id: 1, name: '1', description: '1-desc,1-desc,1-desc,1-desc,1-desc,1-desc,'})
            }
          </Col>
          <Col span={6}>
            {
              warehouseCard({name: '2', description: '2-desc'})
            }
          </Col>
          <Col span={6}>
            {
              warehouseCard({name: '3', description: '3-desc'})
            }
          </Col>
          <Col span={6}>
            {
              warehouseCard({name: '4', description: '4-desc'})
            }
          </Col>
          <Col span={6}>
            {
              warehouseCard({name: '5', description: '5-desc'})
            }
          </Col>
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
