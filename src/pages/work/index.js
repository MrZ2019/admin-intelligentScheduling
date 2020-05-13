import { Route, Link, Redirect } from "react-router-dom";

import List from './list'
import Choose from './choose'
import Type1 from './type1'
import Type2 from './type2'

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
          path={`/work/list`}
          render={props => <List {...props} />}
        />
        <Route
          exact
          path={`/work/list/choose`}
          render={props => <Choose {...props} />}
        />
        <Route
          exact
          path={`/work/list/type1/add`}
          render={props => <Type1 {...props} />}
        />
        <Route
          exact
          path={`/work/list/type1/edit/:id`}
          render={props => <Type1 {...props} />}
        />
        <Route
          exact
          path={`/work/list/type2/add`}
          render={props => <Type2 {...props} />}
        />
        <Route
          exact
          path={`/work/list/type2/edit/:id`}
          render={props => <Type2 {...props} />}
        />
      </div>
    );
  }
}

export default IndexComponent;
