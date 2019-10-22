import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Button, Table, Popconfirm } from 'antd';
import * as actions from '../../actions/category';

import CategoryForm from './CategoryForm';

const typeMap = {
  create: 1,
  update: 2,
}

class Category extends Component {
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
  addCategory = () => {
    this.setState({visible: true, type: typeMap.create});
  }
  
  // 弹出编辑仓库Modal
  editCategory = (category) => {
    const params = Object.assign({}, category);
    delete params.key;
    const self = this;
    this.setState({visible: true, type: typeMap.update}, () => {
      self.formRef.props.form.setFieldsValue({...params});
    });
  }

  // 冻结仓库
  freezeCategory = (category) => {
    console.log('category :', category);
  }

  // 隐藏Modal
  hideModal = () => {
    this.setState({visible: false});
    this.formRef.props.form.resetFields();
  }

  // 提交Modal
  submit = () => {
    const { addCategory, editCategory } = this.props;
    const { type } = this.state;
    const form = this.formRef.props.form;

    form.validateFields((errors, category) => {
      console.log('category :', category);
      if (type === typeMap.create) {
        console.log('create');
        addCategory(category);
      } else if (type === typeMap.update) {
        console.log('update');
        editCategory(category);
      }
      this.hideModal();
    })
  }

  render() {
    const { categoryList } = this.props;
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
        width: '35%',
        key: 'name',
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: '50%',
        key: 'description',
      },
      {
        title: '操作',
        width: '10%',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
            <a onClick={() => this.editCategory(record)} style={{marginRight: 15}}>
              编辑
            </a> 
          ),
      },
    ];
    
    return (
      <>
        <Modal
          title={`${type === typeMap.create ? '新建' : '编辑'}类目`}
          width={400}
          visible={visible}
          onOk={this.submit}
          onCancel={this.hideModal}
          okText="确定"
          cancelText="取消"
          forceRender
        >
          <CategoryForm wrappedComponentRef={form => this.formRef = form} />
        </Modal>
        <Row>
          <div style={{float: 'right'}}>
            <Button onClick={this.handleAdd} type="primary" style={{marginBottom: 15}} onClick={() => this.addCategory()}>
              添加类目
            </Button>
          </div>
        </Row>
        <Table
          rowKey={record => `category-${record.id}`}
          dataSource={categoryList}
          columns={columns}
          scroll={{ y: 'calc(100vh - 270px)' }}
          onChange={({current, pageSize}) => {this.setState({current, pageSize})}}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  categoryList: state.category.list,
})

const mapDispatchToProps = {
  addCategory: actions.fetchAddCategory,
  editCategory: actions.fetchUpdateCategory,
}

export default connect(mapStateToProps, mapDispatchToProps)(Category)