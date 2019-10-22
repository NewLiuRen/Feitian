import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Button, Table, Popconfirm } from 'antd';
import * as actions from '../../actions/goods';

import GoodsForm from './GoodsForm';

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    id: i,
    sku: `${(i+'').repeat(10)}`,
    name: `Edrward ${i}`,
    category_id: `${i}`,
    description: `London Park no. ${i}`,
  });
}
const typeMap = {
  create: 1,
  update: 2,
}

class Goods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      type: typeMap.create,
      current: 1,
      pageSize: 10,
    }
  }

  // 弹出新建仓库Modal
  addGoods = () => {
    this.setState({visible: true, type: typeMap.create});
  }
  
  // 弹出编辑仓库Modal
  editGoods = (category) => {
    const params = Object.assign({}, category);
    delete params.key;
    const self = this;
    this.setState({visible: true, type: typeMap.update}, () => {
      self.formRef.props.form.setFieldsValue({...params});
    });
  }

  // 冻结仓库
  freezeGoods = (category) => {
    console.log('category :', category);
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
    const { goodsList } = this.props;
    const { visible, type, current, pageSize } = this.state;
    const columns = [
      {
        title: '',
        width: '5%',
        key: 'index',
        render: (text,record,index)=>`${(current - 1) * pageSize + index + 1}`
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: '30%',
        key: 'name',
      },
      {
        title: 'SKU',
        dataIndex: 'sku',
        width: '20%',
        key: 'sku',
      },
      {
        title: '类目',
        dataIndex: 'category_id',
        width: '15%',
        key: 'category_id',
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: '15%',
        key: 'description',
      },
      {
        title: '操作',
        width: '15%',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
            <>
              <a onClick={() => this.editGoods(record)} style={{marginRight: 15}}>
                编辑
              </a> 
              <Popconfirm
                placement="topRight"
                title={`是否确定删除，类目： ${record.name}`}
                onConfirm={() => this.freezeGoods(record)}
              >
                <a onClick={() => {}}>
                  删除
                </a> 
              </Popconfirm>
            </>
          ),
      },
    ];
    
    return (
      <>
        <Modal
          title={`${type === typeMap.create ? '新建' : '编辑'}商品`}
          width={400}
          visible={visible}
          onOk={this.submit}
          onCancel={this.hideModal}
          okText="确定"
          cancelText="取消"
          forceRender
        >
          <GoodsForm wrappedComponentRef={form => this.formRef = form} />
        </Modal>
        <Row>
          <div style={{float: 'right'}}>
            <Button onClick={this.handleAdd} type="primary" style={{marginBottom: 15}} onClick={() => this.addGoods()}>
              添加商品
            </Button>
          </div>
        </Row>
        <Table
          rowKey={record => `row-${record.id}`}
          dataSource={goodsList}
          columns={columns}
          scroll={{ y: 'calc(100vh - 270px)' }}
          onChange={({current, pageSize}) => {this.setState({current, pageSize})}}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  goodsList: state.goods.list,
})

const mapDispatchToProps = {
  addGoods: actions.fetchAddGoods,
  editGoods: actions.fetchUpdateGoods,
  freezeGoods: actions.fetchFreezeGoods,
}

export default connect(mapStateToProps, mapDispatchToProps)(Goods);
