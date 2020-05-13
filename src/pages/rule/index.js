import { Route, Link, Redirect } from "react-router-dom";

import List from './list'
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
          path={`/rule/list`}
          render={props => <List {...props} />}
        />
        <Route
          exact
          path={`/rule/list/add`}
          render={props => <Detail {...props} />}
        />
        <Route
          exact
          path={`/rule/list/edit/:id`}
          render={props => <Detail {...props} />}
        />
      </div>
    );
  }
}

export default IndexComponent;
