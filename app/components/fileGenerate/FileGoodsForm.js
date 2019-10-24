import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Divider, Form, TreeSelect, Icon, Button, Tooltip, Modal } from 'antd';
import GoodsForm from '../dataManage/GoodsForm';
import { fetchAddGoods } from '../../actions/goods';
import style from './FileGoodsForm.scss';

const { TreeNode } = TreeSelect;
const ButtonGroup = Button.Group;

let id = 1;

class FileGoods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    }
  }

  remove = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const names = form.getFieldValue('names');
    const index = keys.findIndex(key => key === k);
console.log('index :', index);
console.log('names :', names);
    if (keys.length === 1) {
      return;
    }

    names.splice(index, 1);

    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
      names,
    });
  };

  add = () => {
    const { form } = this.props;
    const layout = this.refs.goodsLayout;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    // 添加后将滚动条移至底部
    form.setFieldsValue({
      keys: nextKeys,
    }, () => layout.scrollTop = layout.scrollHeight);
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names } = values;
        console.log('Received values of form: ', values);
        console.log('Merged values:', keys.map(key => names[key]));
      }
    });
  };

  // 弹出新建仓库Modal
  showModal = () => {
    this.setState({visible: true});
  }

  // 隐藏Modal
  hideModal = () => {
    this.setState({visible: false});
    this.formRef.props.form.resetFields();
  }

  // 提交Modal
  submitGoods = () => {
    const { addGoods } = this.props;
    const form = this.formRef.props.form;

    form.validateFields((errors, category) => {
      addGoods(category);
    })
    this.hideModal();
  }

  render() {
    const { goodsList, categoryMap, form: {getFieldDecorator, getFieldValue} } = this.props;
    const { visible } = this.state;
    const treeData = {};

    goodsList.forEach(g => {
      if (!treeData[g.category_id]) treeData[g.category_id] = [];
      treeData[g.category_id].push(g);
    })

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    getFieldDecorator('keys', { initialValue: [0] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? '商品' : ''}
        required={false}
        key={k}
      >
        {getFieldDecorator(`names[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              message: "请选择商品",
            },
          ],
        })(
          <TreeSelect
            showSearch
            style={{ width: '90%', marginRight: 8 }}
            dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
            placeholder="请选择商品"
            treeNodeFilterProp="title"
            allowClear
            treeDefaultExpandAll
          >
            {
              Object.entries(treeData).map(([k, gList]) => (
                  <TreeNode value={`category-${k}`} title={categoryMap[k].name} key={`category-${k}`} isLeaf={false} selectable={false}>
                    {
                      gList.map(g => (
                        <TreeNode value={g.id} title={g.name} key={`goods-${g.id}`} isLeaf={true} />
                      ))
                    }
                  </TreeNode>
                )
              )
            }
          </TreeSelect>
        )}
        {keys.length > 1 ? (
          <Icon
            className={style['delete-button']}
            type="minus-circle-o"
            onClick={() => this.remove(k)}
            style={{fontSize: 16, color: '#F04A4A'}}
          />
        ) : null}
      </Form.Item>
    ));
    return (
      <Layout style={{background: '#fff'}}>
        <Modal
          title="新建商品"
          width={400}
          visible={visible}
          onOk={this.submitGoods}
          onCancel={this.hideModal}
          okText="确定"
          cancelText="取消"
          forceRender
        >
          <GoodsForm wrappedComponentRef={form => this.formRef = form} />
        </Modal>
        <Divider orientation="left">商品列表</Divider>
        <div ref="goodsLayout" style={{height: 'calc(100vh - 250px)', marginBottom: 30,  overflow: 'auto'}}>
          <Form onSubmit={this.handleSubmit}>
            {formItems}
            <Form.Item {...formItemLayoutWithOutLabel}>
              <ButtonGroup style={{width: '90%'}}>
                <Button type="dashed" onClick={this.add} style={{width: '80%'}}>
                  <Icon type="plus" /> 添加商品
                </Button>
                <Tooltip title="无此商品？点击新建">
                  <Button type="dashed" style={{width: '20%'}} onClick={this.showModal}>
                    <Icon type="question-circle" />
                  </Button>
                </Tooltip>
              </ButtonGroup>
            </Form.Item>
          </Form>
        </div>
      </Layout>
    );
  }
}

const FileGoodsForm = Form.create()(FileGoods);

const mapStateToProps = state => ({
  categoryMap: state.category.map,
  goodsList: state.goods.list,
})

const mapDispatchToProps = {
  addGoods: fetchAddGoods,
}

export default connect(mapStateToProps, mapDispatchToProps)(FileGoodsForm);
