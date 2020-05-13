import { Route, Link, Redirect } from "react-router-dom";

import List from './list'
import Detail from './detail'

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
          path={`/authority/:type/list`}
          render={props => <List {...props} />}
        />
        <Route
          exact
          path={`/authority/:type/list/add`}
          render={props => <Detail {...props} />}
        />
        <Route
          exact
          path={`/authority/:type/list/edit/:id`}
          render={props => <Detail {...props} />}
        />
      </div>
    );
  }
}

export default IndexComponent;
