import * as React from 'react';

export default class LayoutDataManage extends React.Component {
  render() {
    const { children } = this.props;
    return <React.Fragment>{children}</React.Fragment>;
  }
}
