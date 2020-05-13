import {Link} from 'react-router-dom'
import {Menu, Dropdown, Icon, Badge} from 'antd';

import AppService from '../utils/app.service'
import Utils from '../utils/utils'


const logout = () => {

  AppService.postRequest('/base/login/admin/logout').then((response) => {
    if (response.errorCode == 0) {
      localStorage.removeItem("loginPhone")
      location.href = './login.html'
    } else {
      Utils.dialog.error(response.msg)
    }
  })
}

const menu = (
  <Menu>
    {localStorage.getItem('loginPhone')=='admin'  &&
    <Menu.Item key="0">
      <Link to={'/myCenter/updatePwd'}><Icon type="setting" style={{marginRight:5}} />修改密码</Link>
    </Menu.Item>
    }
    {localStorage.getItem('loginPhone')=='admin'  &&
    <Menu.Divider />
    }
    <Menu.Item key="1">
      <a onClick={logout}><Icon type="logout" style={{marginRight:5}} />退出登录</a>
    </Menu.Item>
  </Menu>
);


class _Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loginName: '管理员',
      totalCount:0
    }
  }
  /**
   * 初始化
   */
  componentDidMount() {
    let that = this
    that.getMessage()
    setInterval(function(){
      that.getMessage()
    },5000)
  }

  getMessage=()=>{
    /* AppService.getRequest('admin/jobs/list',{ pageNum:0,pageSize:10,isAbnormal: true }).then((response) => {
       this.setState({
         normalCount: response.body.totalCount
       });
     })
     */
  }
  render() {
    return (
      <div style={{float: "right"}}>
        <Badge count={this.state.normalCount}>
          <Link to={'/work/list/index/isAbnormal/true'}>
            <Icon type="notification"/>通知
          </Link>
        </Badge>
        <Dropdown overlay={menu} placement="bottomRight">
          <a className="ant-dropdown-link flex flex-middle" style={{float:'right',marginLeft:20}}>
            <img src="http://09imgmini.eastday.com/mobile/20180821/20180821192910_6c31fd84ee075aefcbb83d96b6347675_3.jpeg" />
            <span>
              {this.props.loginName ? this.props.loginName : "管理员"}
            </span>
          </a>
        </Dropdown>
      </div>
    )
  }
}
export default _Header