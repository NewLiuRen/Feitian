import React, { Component } from 'react';
import moment from 'moment';
import { Calendar, Button, Select, Layout, Row, Col, Badge, Drawer, Alert } from 'antd';
import { getFileListByDate } from '../../db/file';
import { getRecordsByFileId } from '../../db/records';
import FilePreviewTable from './FilePreviewTable';

import styles from './FileViewCalendar.scss';

const ButtonGroup = Button.Group;

export default class FileViewCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      currentFile: null,
      visible: false,
    }
  }

  // 组件加载后载入所有仓库（包含删除）列表
  componentDidMount() {
    this.searchFileList();
  }

  // 按照moment对象的日期，搜索其所属月中的所有文件
  searchFileList = (momentVal) => {
    const startDate = moment().startOf('month').valueOf();
    const endDate = moment().endOf('month').valueOf();
    getFileListByDate(startDate, endDate).then(fileList => {
      this.setState({fileList})
    })
  }

  // 日历控件变化后，搜索文件
  onPanelChange = (value, mode) => {
    this.searchFileList(value);
  }

  // 获取某一天内的文件，用于日历控件渲染
  getFileFromState = (momentVal) => {
    const { fileList } = this.state;
    return fileList.filter(f => moment(f.create_date).format('YY-MM-DD') === momentVal.format('YY-MM-DD'))
  }

  // 日历渲染某一天内容
  dateCellRender = (value) => {
    const files = this.getFileFromState(value) || []
    const getStatus = (f) => {
      if (!f.is_import) {
        return 'blue';
      } else if (f.is_import && !f.is_order) {
        return 'green';
      } else {
        return 'orange';
      }
    }

    return (
      <ul className={styles.events}>
        {files.map(f => (
          <li key={f.id}>
            <Badge color={getStatus(f)} text={f.name} onClick={()=>{this.showPreview(f)}} />
          </li>
        ))}
      </ul>
    );
  }
  
  // 显示预览表格
  showPreview = (currentFile) => {
    console.log('currentFile :', currentFile);
    getRecordsByFileId(currentFile.id).then(({records}) => {
      console.log('records :', records);
      this.setState({records, currentFile, visible: true});
    })
  }

  // 隐藏预览表格
  hidePreview = () => {
    this.setState({ visible: false, });
  }

  // 载入文件数据并跳转至数据录入页
  gotoInputData = () => {

  }

  render() {
    const { currentFile, records } = this.state;
    const headerComp = ({ value, type, onChange, onTypeChange }) => {
      const start = 0;
      const end = 12;
      const monthOptions = [];

      const current = value.clone();
      const localeData = value.localeData();
      const months = [];
      for (let i = 0; i < 12; i++) {
        current.month(i);
        months.push(localeData.monthsShort(current));
      }

      for (let index = start; index < end; index++) {
        monthOptions.push(
          <Select.Option className="month-item" key={`${index}`}>
            {months[index]}
          </Select.Option>,
        );
      }
      const month = value.month();

      const year = value.year();
      const options = [];
      for (let i = year - 10; i < year + 10; i += 1) {
        options.push(
          <Select.Option key={i} value={i} className="year-item">
            {i}
          </Select.Option>,
        );
      }
      return (
        <div style={{ padding: 20 }}>
          <Row type="flex" justify="end" gutter={16}>
            <Col>
              <Select
                dropdownMatchSelectWidth={false}
                onChange={newYear => {
                  const now = value.clone().year(newYear);
                  onChange(now);
                }}
                value={String(year)}
              >
                {options}
              </Select>
            </Col>
            <Col>
              <Select
                dropdownMatchSelectWidth={false}
                value={String(month)}
                onChange={selectedMonth => {
                  const newValue = value.clone();
                  newValue.month(parseInt(selectedMonth, 10));
                  onChange(newValue);
                }}
              >
                {monthOptions}
              </Select>
            </Col>
          </Row>
        </div>
      );
    }

    return (
      <div style={{background: '#ffffff',}}>
        <Drawer
          title={currentFile ? currentFile.name : ''}
          style={{overflow: 'hidden'}}
          placement="right"
          width="80%"
          onClose={this.hidePreview}
          visible={this.state.visible}
        >
          <Alert style={{marginBottom: 20}} type="info" message="仓库内数值为该仓库下商品的每箱最大数量" showIcon />
          <Layout style={{height: 'calc(100vh - 220px)', background: '#ffffff'}}>
            <FilePreviewTable records={records} />
          </Layout>
          <Row style={{marginTop: 20}}>{
            currentFile && !currentFile.is_import ? 
            (<Button type="primary" block>数据录入</Button>) :
            (<ButtonGroup style={{width: '100%'}}>
              <Button type="primary" style={{width: '50%', background: '#53d06e', borderColor: '#53d06e'}}>箱贴录入</Button>
              <Button type="primary" style={{width: '50%', background: '#d97309', borderColor: '#d97309'}}>箱贴导出</Button>
            </ButtonGroup>)
          }</Row>
        </Drawer>
        <Calendar mode='month' dateCellRender={this.dateCellRender} headerRender={({ value, type, onChange, onTypeChange }) => headerComp({ value, type, onChange, onTypeChange })} onPanelChange={this.onPanelChange} />
      </div>
    )
  }
}