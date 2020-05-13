import { Route, Link, Redirect } from "react-router-dom";

import NoticeList from './list'
import NoticeDetail from './detail'

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
          path={`/notice/list`}
          render={props => <NoticeList {...props} />}
        />
        <Route
          exact
          path={`/notice/list/add`}
          render={props => <NoticeDetail {...props} />}
        />
        <Route
          exact
          path={`/notice/list/detail/:id`}
          render={props => <NoticeDetail {...props} />}
        />
      </div>
    );
  }
}

export default IndexComponent;
