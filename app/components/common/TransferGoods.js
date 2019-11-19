import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Transfer, Table } from 'antd';
import CategoryTag from './CategoryTag';

class TransferGoods extends Component {
  onChange = nextTargetKeys => {
    this.props.onChange(nextTargetKeys);
  };
  
  render() {
    const { categoryMap, goodsMap, fileGoodsIdList, targetKeys } = this.props;

    const columns = [
      {
        title: '商品',
        key: 'goods',
        dataIndex: 'goods',
      }, {
        title: '类目',
        key: 'category',
        width: 70,
        dataIndex: 'category',
        filters: [],
        filterMultiple: true,
        onFilter: (value, record) => record.category === value,
        render: (text, record) => (<CategoryTag category_id={text} />)
      }, {
        title: 'SKU',
        key: 'sku',
        dataIndex: 'sku',
        align: 'right',
      }
    ];
    const rightColumns = [
      {
        title: '商品',
        key: 'goods',
        dataIndex: 'goods',
      }, {
        title: '类目',
        key: 'category',
        width: 50,
        dataIndex: 'category',
        filters: [],
        filterMultiple: true,
        onFilter: (value, record) => record.category === value,
        render: (text, record) => (<CategoryTag category_id={text} />)
      }, {
        title: 'SKU',
        key: 'sku',
        dataIndex: 'sku',
        align: 'right',
      }
    ];
    const categoryFilters = []

    const dataSource = fileGoodsIdList.map(gid => {
      const categoryObj = categoryMap[goodsMap[gid].category_id];
      if (!categoryFilters.find(c => c.value === categoryObj.id)) categoryFilters.push({ text: categoryObj ? categoryObj.name : '其他', value: categoryObj.id || -1,})
      return {
        key: gid,
        goods: goodsMap[gid].name,
        category: categoryObj.id,
        sku: goodsMap[gid].sku,
        goods_id: gid,
      }
    }).sort((p, c) => p.category!== c.category ? p.category - c.category : p.goods_id - c.goods_id)

    return (
      <Transfer
        showSelectAll
        showSearch
        targetKeys={targetKeys}
        dataSource={dataSource}
        onChange={this.onChange}
        filterOption={(inputValue, item) =>
          item.goods.indexOf(inputValue) !== -1 || categoryMap[item.category].name.indexOf(inputValue) !== -1 || item.sku.indexOf(inputValue) !== -1
        }
      >
        {({
          direction,
          filteredItems,
          onItemSelectAll,
          onItemSelect,
          selectedKeys: listSelectedKeys,
          disabled: listDisabled,
        }) => {
          if (direction === 'left') columns[1].filters = categoryFilters.sort((a, b) => b.value - a.value);
          const rowSelection = {
            getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
            onSelectAll(selected, selectedRows) {
              const treeSelectedKeys = selectedRows
                .filter(item => !item.disabled)
                .map(({ key }) => key);
              const difference = (target1, target2) => {
                const result = [];
                for(let i = 0; i < target1.length; i++){
                  if(target1[i] !== target2[i]){
                    result.push(target1[i])
                  }
                }
                return result;
              }
              const diffKeys = selected
                ? difference(treeSelectedKeys, listSelectedKeys)
                : difference(listSelectedKeys, treeSelectedKeys);
              onItemSelectAll(diffKeys, selected);
            },
            onSelect({ key }, selected) {
              onItemSelect(key, selected);
            },
            selectedRowKeys: listSelectedKeys,
          };
          
          return (
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={filteredItems}
              size="small"
              defaultPageSize={5}
              pagination={false}
              scroll={{ x: '100%', y: 'calc(100vh - 400px)' }}
              onRow={({ key, disabled: itemDisabled }) => ({
                onClick: () => {
                  if (itemDisabled || listDisabled) return;
                  onItemSelect(key, !listSelectedKeys.includes(key));
                },
              })}
            />
          );
        }}
      </Transfer>
    )
  }
}

const mapStateToProps = state => ({
  goodsMap: state.goods.map,
  categoryMap: state.category.map,
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps,  mapDispatchToProps)(TransferGoods)
