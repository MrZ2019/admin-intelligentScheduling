import { Route, Link, Redirect } from "react-router-dom";

import All from './all'
import RealTime from './realTime'
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
          path={`/attendance/list/realTime`}
          render={props => <RealTime {...props} />}
        />
        <Route
          exact
          path={`/attendance/list/all`}
          render={props => <All {...props} />}
        />
        <Route
          exact
          path={`/attendance/list/detail/:id`}
          render={props => <Detail {...props} />}
        />
      </div>
    );
  }
}

export default IndexComponent;
