import React from 'react';

export class ReloadContainer extends React.Component {
  static reload: (callBack?: (() => void) | undefined) => void = () => true;

  componentDidMount() {
    ReloadContainer.reload = this.forceUpdate;
  }

  render() {
    return this.props.children;
  }
}

export default ReloadContainer.reload;
