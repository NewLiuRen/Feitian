import * as React from 'react';

export default class LayoutFileGenerate extends React.Component {
  render() {
    const { children } = this.props;
    return <React.Fragment>{children}</React.Fragment>;
  }
}
