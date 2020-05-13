import {
  Route,Link, Redirect
} from 'react-router-dom';
import {Breadcrumb, Icon}from 'antd'
import UpdatePwd from './updatePwd'

class MyCenter extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let {match} = this.props
    return (
      <div>
        <div className="breadHeader">
          <Breadcrumb className="ant-breadcrumb">
            <Breadcrumb.Item>
              {/* <Link to={`${match.url}`}> */}
              <div>
                <Icon type="user"/>
                <span>个人中心</span>
              </div>
              {/* </Link> */}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div id="wrap">
          <div className="content">
            <Route exact path={`${match.url}`} render={() => {
              return <Redirect to={`${match.url}/index`}/>
            }}/>
            <Route exact path={`${match.url}/index`} component={(props) => <UpdatePwd {...props}/> }/>
          </div>
        </div>
      </div>
    )
  }

}

export default MyCenter