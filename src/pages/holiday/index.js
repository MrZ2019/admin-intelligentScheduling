import { Route, Link, Redirect } from "react-router-dom";

import List from './list'
import Legal from './legal'
import Detail from './detail'

class IndexComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { match, location, operate } = this.props;
    return (
      <div>
        <Route
          exact
          path={`/holiday/list`}
          render={props => <List {...props} />}
        />
        <Route
          exact
          path={`/holiday/list/legal`}
          render={props => <Legal {...props} />}
        />
        <Route
          exact
          path={`/holiday/list/detail/:id`}
          render={props => <Detail {...props} />}
        />
      </div>
    );
  }
}

export default IndexComponent;