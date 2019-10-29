import React, { Component } from 'react';
import moment from 'moment';
import { Calendar, Select, Row, Col, Badge, Drawer } from 'antd';
import { getFileListByDate } from '../../db/file';

import styles from './FileViewCalendar.scss';

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
    this.setState({ visible: true, currentFile });
  }

  // 隐藏预览表格
  hidePreview = () => {
    this.setState({ visible: false, });
  }

  render() {
    const { currentFile } = this.state;
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
          drawerStyle={{overFlow: 'hidden'}}
          placement="top"
          height="50%"
          onClose={this.hidePreview}
          visible={this.state.visible}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Drawer>
        <Calendar mode='month' dateCellRender={this.dateCellRender} headerRender={({ value, type, onChange, onTypeChange }) => headerComp({ value, type, onChange, onTypeChange })} onPanelChange={this.onPanelChange} />
      </div>
    )
  }
}
