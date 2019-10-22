// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import * as actionsWarehouse from '../actions/warehouse';
import * as actionsCategory from '../actions/category';
import * as actionsGoods from '../actions/goods';

class App extends React.Component {
  componentDidMount() {
    const { getWarehouse, getCategory, getGoods } = this.props;
    getWarehouse();
    getCategory();
    getGoods();
  }

  render() {
    const { children } = this.props;
    return <React.Fragment>{children}</React.Fragment>;
  }
}

const mapDispatchToProps = { 
  getWarehouse: actionsWarehouse.fetchGetWarehouseList,
  getCategory: actionsCategory.fetchGetCategoryList,
  getGoods: actionsGoods.fetchGetGoodsList,
};

export default connect(null, mapDispatchToProps)(App)
