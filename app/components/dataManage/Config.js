import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Row, } from 'antd';
import * as actions from '../../actions/category';

const { Search } = Input;

export const setSelectPathCommand = (fn) => {
  ipcRenderer.on('selectedExportPath', (event, path) => {
    if (path) localStorage.setItem('exportPath', path);
    if (fn && typeof fn === 'function') fn(path);
  })
  ipcRenderer.send('selectExportPath')
}

class ConfigForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: ''
    }
  }

  componentDidMount() {
    const path = localStorage.getItem('exportPath');
    if (path) this.setState({path})
  }

  setSelectPathCommand = () => {
    setSelectPathCommand((path) => {
      this.setState({path});
    });
  }

  render() {
    const { path } = this.state;

    return (
      <div style={{width: '80%', marginTop: 50}}>
        <Form layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
          <Form.Item label="导出路径">
            <Search
              readOnly
              value={path}
              enterButton="选择文件夹"
              size="large"
              placeholder="请选择文件夹"
              onSearch={value => this.setSelectPathCommand()}
            />
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const Config = Form.create()(ConfigForm);

const mapStateToProps = state => ({
  categoryList: state.category.list,
})

const mapDispatchToProps = {
  addCategory: actions.fetchAddCategory,
  editCategory: actions.fetchUpdateCategory,
}

export default connect(mapStateToProps, mapDispatchToProps)(Config)