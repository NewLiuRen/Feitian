import React, { Component } from 'react';
import { Row, Table, Typography, DatePicker, Drawer, Layout, Button, message } from 'antd';
import moment from 'moment';
import ModalDelete from '../common/ModalDelete';
import { getFileListByDate, deleteFile } from '../../db/file';
import { getRecordsByFileId } from '../../db/records';
import FilePreviewTable from '../fileView/FilePreviewTable';

const { RangePicker } = DatePicker;
const { Text } = Typography;
const ButtonGroup = Button.Group;

export default class FileManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      startDate: moment().startOf('month').valueOf(),
      endDate: moment().endOf('month').valueOf(),
      current: 1,
      pageSize: 10,
      fileList: [],
      currentFile: null,
      records: [],
      share: [],
      surplus: [],
    }
  }

  componentDidMount() {
    const { startDate, endDate } = this.state;
    this.searchFileList(startDate, endDate);
  }

  // 搜索文件
  searchFileList(startDate, endDate) {
    getFileListByDate(startDate, endDate).then(fileList => {
      this.setState({fileList})
      return null
    })
  }

  // 删除文件
  deleteFile = (file) => {
    const {startDate, endDate} = this.state;
    ModalDelete(`文件：${file.name}（箱贴${file.is_import ? '已' : '未'}生成）删除后无法恢复！`, () => {
      deleteFile(file.id).then(({success}) => {
        if (success) message.success('删除成功');
        else message.error('删除失败');
        this.searchFileList(startDate, endDate);
        this.setState({visible: false});
      })
    })
  }

  // 日期变化
  dateChange = (dates, dateStrings) => {
    this.searchFileList(dates[0].valueOf(), dates[1].valueOf());
  }

  // 预览
  previewFile = (record) => {
    getRecordsByFileId(record.id).then(res => {
      const { records, share, surplus } = res;
      this.setState({visible: true, currentFile: record, records, share, surplus,});
    })
  }

  // 关闭预览
  hidePreview = () => {
    this.setState({visible: false});
  }

  render() {
    const { startDate, endDate, current, pageSize, fileList, currentFile, records, surplus, share } = this.state;

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
        width: '20%',
        key: 'description',
      },
      {
        title: '创建时间',
        dataIndex: 'create_date',
        width: '15%',
        key: 'create_date',
        render: (text, record) => {
        return (<span>{moment(parseInt(text, 10)).format('YY-MM-DD')}</span>)
        }
      },
      {
        title: '采购订单号',
        dataIndex: 'is_import',
        width: '15%',
        key: 'is_import',
        render: (text, record) => {
          return (
            record.is_import ? <Text>已生成</Text> : <Text type="danger">未生成</Text>
          )
        }
      },
      {
        title: '操作',
        width: '15%',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
            <>
              <a style={{marginRight: 15}} onClick={() => {this.previewFile(record)}}>
                预览
              </a> 
              <a onClick={() => {this.deleteFile(record)}}>
                删除
              </a> 
            </>
          ),
      },
    ];
    
    return (
      <div style={{overflow: 'hidden'}}>
        <Drawer
          title={currentFile ? currentFile.name : ''}
          style={{overflow: 'hidden'}}
          placement="right"
          width="80%"
          onClose={this.hidePreview}
          visible={this.state.visible}
        >
          {/* <Alert style={{marginBottom: 20}} type="info" message="仓库内数值为该仓库下商品的每箱最大数量" showIcon /> */}
          <Layout style={{height: 'calc(100vh - 160px)', background: '#ffffff'}}>
            <FilePreviewTable records={records} share={share} surplus={surplus} fileInfo={currentFile} />
          </Layout>
          <Row style={{marginTop: 20}}>{
            <ButtonGroup style={{width: '100%'}}>
              <Button type="danger" onClick={() => this.deleteFile(currentFile)} style={{width: '50%',}}>删除</Button>
              <Button type="primary" ghost onClick={this.hidePreview} style={{width: '50%',}}>关闭</Button>
            </ButtonGroup>
          }</Row>
        </Drawer>
        <Row>
          <div style={{float: 'right', marginBottom: 10,}}>
            <RangePicker format={'YYYY-MM-DD'} defaultValue={[moment(startDate), moment(endDate)]} onChange={this.dateChange}/>
          </div>
        </Row>
        <Table
          rowKey={record => `row-${record.id}`}
          dataSource={fileList}
          columns={columns}
          scroll={{ y: 'calc(100vh - 270px)' }}
          onChange={({current, pageSize}) => {this.setState({current, pageSize})}}
        />
      </div>
    )
  }
}
