import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tag } from 'antd';

// 商品的类目标签
// props: category_id 类目id
class CategoryTag extends Component {
  render() {
    const { categoryList, categoryMap, category_id } = this.props;
    const colorList = ['red', 'blue', 'volcano', 'geekblue', 'orange', 'purple', 'gold', 'green', 'magenta', 'cyan']
    const index = categoryList.findIndex(c => c.id === category_id);

    return (
      (!category_id || !categoryMap[category_id]) ?
      <></> :
      <Tag color={colorList[index%colorList.length]}>{categoryMap[category_id].name}</Tag>
    )
  }
}

const mapStateToProps = state => ({
  categoryList: state.category.list,
  categoryMap: state.category.map,
})

export default connect(mapStateToProps)(CategoryTag);
