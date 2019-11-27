import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Form, Button, Slider, Popover, Popconfirm } from 'antd';
import CategoryTag from '../../common/CategoryTag';
import LabelModalWrap from './LabelModalWrap';
import * as actions from '../../../actions/fileRecord';

class FileLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderMap: {}
    }
  }

  componentDidMount() {
    const { records, } = this.props;
    const orderMap = {};
    records.forEach(r => {
      orderMap[r.goods_id] = r.order_number;
    })
    this.setState({orderMap});
  }

  // 添加拼箱
  addLabel = () => {
    const { records, surplus, share, } = this.props;
    const { orderMap } = this.state;
    const data = {}
    const label = records.map(r => r.labels.length).reduce((p, c) => p+c, 0) + share.length + 1;

    surplus.forEach(s => {
      const order_number = orderMap[s.goods_id];
      if (!data[order_number]) data[order_number] = {};
      data[order_number][s.goods_id] = s.count;
    })
    share.forEach(s => {
      if (data[s.order_number] && data[s.order_number][s.goods_id]) {
        data[s.order_number][s.goods_id] -= s.count;
      }
      if (data[s.order_number][s.goods_id] === 0) delete data[s.order_number][s.goods_id]
      if (Object.keys(data[s.order_number]).length === 0) delete data[s.order_number]
    })

    this.props.add(this.props.warehouse_id, label, data)
  }

  // 删除拼箱
  delLabel = ({label}) => {
    const { deleteLabel, fileInfo, warehouse_id } = this.props;
    deleteLabel(fileInfo.id, {warehouse_id, label});
  }

  // 跳转下一tab
  gotoNext = () => {
    const { data, gotoNextTab, warehouse_id } = this.props;
    gotoNextTab(warehouse_id);
  }

  render() {
    const { records, surplus, share, differ, goodsMap, warehouse_id, } = this.props;
    const done = records.filter(d => !d.order_number).length === 0;

    const dataSource = records.map(d => {
      const { goods_id, order_number, count, labels } = d;
      return {
        key: `record_${goods_id}`,
        goods: goodsMap[goods_id].name, 
        category: goodsMap[goods_id].category_id,
        max_count: goodsMap[goods_id].max_count,
        count,
        labels,
        order_number,
        goods_id,
      }
    }).sort((p, c) => p.category !== c.category ? p.category - c.category : p.goods_id - c.goods_id)
    const shareDataSource = share.map(s => {
      const { warehouse_id, order_number, goods, label } = s;
      return {
        key: `${warehouse_id}_${label}_${order_number}`,
        order_number,
        label,
        goods: goods.sort((p, c) => p.id - c.id),
      }
    });

    const columns = [
      {
        title: '商品',
        width: 150,
        key: 'goods',
        dataIndex: 'goods',
        // fixed: 'left',
      }, {
        title: '类目',
        width: 60,
        key: 'category',
        dataIndex: 'category',
        // fixed: 'left',
        filters: [],
        filterMultiple: true,
        onFilter: (value, record) => record.category === value,
        render: (text, record) => (<CategoryTag category_id={text} />)
      }, {
        title: '个数/箱',
        width: 50,
        key: 'max_count',
        dataIndex: 'max_count',
        // fixed: 'left',
        align: 'right',
      }, {
        title: '数量',
        width: 50,
        key: 'count',
        dataIndex: 'count',
        // fixed: 'left',
        align: 'right',
      }, {
        title: '采购订单号',
        width: 100,
        key: 'order_number',
        dataIndex: 'order_number',
        // fixed: 'left',
        align: 'right',
      }, {
        title: '箱号',
        width: 100,
        key: 'labels',
        dataIndex: 'labels',
        // fixed: 'left',
        align: 'right',
        render: (text, record) => record.labels.join('，')
      }
    ];
    const orderColumns = [{
      title: '箱采购订单号',
      width: 50,
      key: 'order_number',
      dataIndex: 'order_number',
    }, {
      title: '包含商品（括号中为数量）',
      width: 150,
      key: 'goods',
      dataIndex: 'goods',
      render: (text,record,index) => (
          <div>{
            text.map(({goods_id: gid, count}, i) => (
              <Popover key={`order_number_${gid}`} placement="topLeft" title="商品信息" content={
                <div>
                  <CategoryTag category_id={goodsMap[gid].category_id} />
                  <span>{`${goodsMap[gid].name}（${goodsMap[gid].sku}）`}</span>
                </div>
              }>
                <span style={{cursor: 'default'}}>{`${goodsMap[gid].name}（${count}）${i !== text.length - 1 ? '，' : ''}`}</span>
              </Popover>
              
            ))
          }</div>
        )
    }, {
      title: '箱号',
      width: 40,
      key: 'label',
      align: 'right',
      dataIndex: 'label',
    render: (text, record) => {
      const total = record.goods.reduce((p, c) => p + c.count, 0)
      return (
        <>
          <span>{text}</span>
          <span style={{display: 'inline-block', width: 80,}}>{`（共${total}件）`}</span>
        </>
      )
    }
    }, {
      title: '操作',
      width: 20,
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record) => (
        <>
          <Popconfirm
            placement="topRight"
            title={`是否确定删除该拼箱，箱号： ${record.label}`}
            onConfirm={() => this.delLabel(record)}
          >
            <a onClick={() => {}}>
              删除
            </a> 
          </Popconfirm>
        </>
      ),
    }];

    return (
      <>
        <div style={{height: 'calc(100vh - 180px)'}}>
          <Table
            className="file-label-show"
            columns={columns}
            dataSource={dataSource}
            scroll={{ x: '100%', y: 'calc(100vh - 440px)' }}
            bordered
            pagination={false}
            size="small"
          />
          <div style={{marginTop: 10, marginBottom: 10, overflow: 'hidden'}}>
            <Button disabled={!surplus || differ.every(d => d.count === 0)} type="primary" style={{float: 'right'}} onClick={this.addLabel}>新增拼箱</Button>
          </div>
          <Table
            className="file-label-input"
            columns={orderColumns}
            dataSource={shareDataSource}
            scroll={{ x: '100%', y: 'calc(100vh - 550px)' }}
            bordered
            pagination={false}
            size="small"
          />
        </div>
        <Button disabled={!done} block type="primary" style={{marginTop: 15}} onClick={this.gotoNext}>完成</Button>
      </>
    )
  }
}

const mapStateToProps = state => ({
  warehouseMap: state.warehouse.map,
  categoryMap: state.category.map,
  goodsMap: state.goods.map,
  fileInfo: state.fileRecord.file,
  fileGoodsList: state.fileRecord.goods,
})

const mapDispatchToProps = {
  addLabel: actions.fetchAddLabel,
  deleteLabel: actions.fetchDeleteLabel,
}

const FileLabelInput = LabelModalWrap(FileLabel);

export default connect(mapStateToProps, mapDispatchToProps)(FileLabelInput);
