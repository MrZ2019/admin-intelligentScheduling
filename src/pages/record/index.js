import { Route, Link, Redirect } from "react-router-dom";

import List from './list'

class IndexComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { match, location, } = this.props;
    return (
      <div>
        <Route
          exact
          path={`/record/list`}
          render={props => <List {...props} />}
        />
      </div>
    );
  }
}

export default IndexComponent;
