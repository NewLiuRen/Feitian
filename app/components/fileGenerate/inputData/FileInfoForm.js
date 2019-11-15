import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, DatePicker, Form, Input, Divider, Typography, } from 'antd';
import moment from 'moment';
import fileInfoObj from '../../../constants/file'

const { Text } = Typography;

class FileInfo extends Component {
  render() {
    const { goods, goodsMap, fileInfo: {name, create_date, description}, form: { getFieldDecorator } } = this.props;
    const date = moment(new Date(), 'YYYY-MM-DD');

    return (
      <Layout style={{background: '#fff'}}>
        <Divider orientation="left">基本信息</Divider>
        <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          {getFieldDecorator('id')(<Input type="hidden" />)}
          <Form.Item label="名称">
            {getFieldDecorator('name', {
              initialValue: name || `${date.format('YYYY.MM.DD')}入仓数fcs`,
              rules: [{
                required: true,
                whitespace: true,
                message: '请输入名称',
              }],
            })(<Input placeholder="请输入名称" />)}
          </Form.Item>
          <Form.Item label="创建时间">
            {getFieldDecorator('create_date', {
              initialValue: create_date ? moment(create_date) : date,
              rules: [{ type: 'object', required: true, message: '请输入创建时间' }],
            })(<DatePicker disabled={!!create_date} style={{width: '100%'}} />)}
          </Form.Item>
          <Form.Item label="描述">
            {getFieldDecorator('description', {
              initialValue: description || '',
            })(
              <Input placeholder="请输入描述" />,
            )}
          </Form.Item>
        </Form>
        <Divider orientation="left">所选商品</Divider>
        <div>
          {
            goods.map(({id: goods_id}, i) => (
              <span key={`show-goods-${i}`}>
                {(goodsMap[goods_id] && goodsMap[goods_id].name) ? (
                  <Text type="warning">{goodsMap[goods_id].name}</Text>
                ) : (
                  <Text type="danger">未选择</Text>
                )}
                {i !== goods.length - 1 && <Divider type="vertical" />}
              </span>
            ))
          }
        </div>
      </Layout>
    );
  }
}

const FileInfoForm = Form.create(fileInfoObj)(FileInfo);

const mapStateToProps = state => ({
  goods: state.fileRecord.goods,
  goodsMap: state.goods.map,
  fileInfo: state.fileRecord.file,
})

export default connect(mapStateToProps)(FileInfoForm);
