import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Divider, Form, TreeSelect, Icon, Button, Tooltip, Modal } from 'antd';
import GoodsModalWrap from '../dataManage/GoodsModalWrap';
import { fetchAddGoods } from '../../actions/goods';
import { addGoods, setAllGoods, removeGoods } from '../../actions/fileRecord';
import style from './FileGoodsForm.scss';

const { TreeNode } = TreeSelect;
const ButtonGroup = Button.Group;

class FileGoods extends Component {
  constructor(props) {
    super(props);
    this.layoutRef = null;
  }

  // 动态添加表单项
  add = () => {
    const { addFileGoods } = this.props;
    const layout = this.layoutRef;

    addFileGoods();
    setTimeout(() => {layout.scrollTop = layout.scrollHeight}, 0);
  };

  // 删除表单项
  remove = index => {
    this.props.removeFileGoods(index);
  };

  render() {
    const { fileGoods, goodsList, categoryMap, form: {getFieldDecorator} } = this.props;
    const treeData = {other: []};

    // 为树搜索组件格式化商品数据，
    // 规则为：存在类目，则放入相关类目属性下，否则放入其他（other）属性下
    goodsList.forEach(g => {
      if (!g.category_id) {
        treeData.other.push(g)
      } else {
        if (!treeData[g.category_id]) treeData[g.category_id] = [];
        treeData[g.category_id].push(g);
      }
    })

    // 计算商品类目名称
    const calcCategoryTitle = (key) => {
      let name = '';
      if (key === 'other') {
        name = '其他';
      } else if(categoryMap[key]) {
        name = categoryMap[key].name;
      } else {
        name = '';
      }
      return name;
    }

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

    const list = fileGoods;
    const formItems = list.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? '商品' : ''}
        required={false}
        key={`item-${index}`}
      >
        {getFieldDecorator(`goods[${index}]`, {
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
            searchPlaceholder="请输入搜索关键词：名称、SKU"
            treeNodeFilterProp="title"
            filterTreeNode={(inputValue, treeNode) => {
              const node = treeNode.props;
              if (node.isLeaf && (node.title.includes(inputValue) || node.sku.includes(inputValue))) return true;
              return false;
            }}
            allowClear
            treeDefaultExpandAll
          >
            {
              Object.entries(treeData).map(([k, gList]) => (
                  <TreeNode value={`category-${k}`} title={calcCategoryTitle(k)} key={`category-${k}`} isLeaf={false} selectable={false}>
                    {
                      gList.map(g => (
                        <TreeNode value={g.id} title={g.name} sku={g.sku} key={`goods-${g.id}`} disabled={fileGoods.includes(g.id)} isLeaf />
                      ))
                    }
                  </TreeNode>
                )
              )
            }
          </TreeSelect>
        )}
        {list.length > 1 ? (
          <Icon
            className={style['delete-button']}
            type="minus-circle-o"
            onClick={() => this.remove(index)}
            style={{fontSize: 16, color: '#F04A4A'}}
          />
        ) : null}
      </Form.Item>
    ));

    return (
      <Layout style={{background: '#fff'}}>
        <Divider orientation="left">商品列表</Divider>
        <div ref={layout => { this.layoutRef = layout} } style={{height: 'calc(100vh - 250px)', marginBottom: 30,  overflow: 'auto'}}>
          <Form>
            {formItems}
            <Form.Item {...formItemLayoutWithOutLabel}>
              <ButtonGroup style={{width: '90%'}}>
                <Button type="dashed" onClick={this.add} style={{width: '80%'}}>
                  <Icon type="plus" /> 添加商品
                </Button>
                <Tooltip title="无此商品？点击新建">
                  <Button type="dashed" style={{width: '20%'}} onClick={this.props.add}>
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

const FileGoodsWithGoodsModal = GoodsModalWrap(FileGoods);

// 不得不说，antd该版本的Form双向绑定真是不好用......
const FileGoodsForm = Form.create({
  onValuesChange: (props, changedValues, allValues) => {
    // 表单项改变时，向redux中赋值
    props.setFileGoods(allValues.goods);
  },
  // 动态表单赋值，若不用此属性从redux为form赋值，动态删除表单项时会出现错误
  mapPropsToFields(props) {
    const p = {}
    props.fileGoods.forEach((g, i) => {
      p[`goods[${i}]`] = Form.createFormField({
        value: g,
      })
    })
    return p
  }
})(FileGoodsWithGoodsModal);

const mapStateToProps = state => ({
  categoryMap: state.category.map,
  goodsList: state.goods.list,
  fileGoods: state.fileRecord.goods,
})

const mapDispatchToProps = {
  addGoods: fetchAddGoods,
  setFileGoods: setAllGoods,
  addFileGoods: addGoods,
  removeFileGoods: removeGoods,
}

export default connect(mapStateToProps, mapDispatchToProps)(FileGoodsForm);
