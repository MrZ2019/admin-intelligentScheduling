import '../utils/lib'
import 'react-quill/dist/quill.snow.css';
import {Route, HashRouter, NavLink, Redirect, Switch} from 'react-router-dom'
import {Menu, Icon, Layout, LocaleProvider, Badge} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

const SubMenu = Menu.SubMenu;
const {Header, Content, Sider} = Layout;
import '../css/common.less'
import logoImg from "../images/logo.png";

import AppService from '../utils/app.service'

import _Header from '../component/header.component'
import ScrollToTop from '../component/scrollToTop.component'
import NotFound from '../component/error/not_found.component'
import NoAuthority from '../component/error/no_ authority.component'

import MyCenter from '../pages/myCenter/index.component'

import UserComponent from '../pages/user/index'
import DepartmentComponent from '../pages/department/index'
import HolidayComponent from '../pages/holiday/index'
import RuleComponent from '../pages/rule/index'
import AuthorityComponent from '../pages/authority/index'
import AttendanceComponent from '../pages/attendance/index'
import WorkComponent from '../pages/work/index'
import RecordComponent from '../pages/record/index'
import NoticeComponent from '../pages/notice/index'

const navs = [
  {
    key: 'user_list',
    name: '用户管理',
    icon: 'user',
    path: '/user/list',
    component: (props) => {
      return <UserComponent {...props} />
    },
    // 菜单消息提示
    // afterDom: (state) => {
    //   return  !!state.userNum && <Badge count={state.userNum} style={{marginLeft:8,boxShadow:"none",}} />
    // },
    children: [],
  },
  {
    key: 'department_list',
    name: '部门管理',
    icon: 'user',
    path: '/department/list',
    component: (props) => {
      return <DepartmentComponent {...props} />
    },
    children: [],
  },
  {
    key: 'holiday_list',
    name: '假期管理',
    icon: 'user',
    path: '/holiday/list',
    component: (props) => {
      return <HolidayComponent {...props} />
    },
    children: [],
  },
  {
    key: 'rule_list',
    name: '出勤规则',
    icon: 'user',
    path: '/rule/list',
    component: (props) => {
      return <RuleComponent {...props} />
    },
    children: [],
  },
  {
    key: 'authority',
    name: '权限设置',
    icon: 'user',
    children: [
      {
        key: 'authority_backend',
        name: '后台操作人权限',
        path: '/authority/backend/list',
        component: (props) => {
          return <AuthorityComponent {...props} />
        },
      },

      {
        key: 'authority_check',
        name: '审批权限',
        path: '/authority/check/list',
        component: (props) => {
          return <AuthorityComponent {...props} />
        }
      },
    ],
  },
  {
    key: 'attendance',
    name: '考勤管理',
    icon: 'user',
    children: [
      {
        key: 'attendance_real_time',
        name: '实时考勤查看',
        path: '/attendance/list/realTime',
        component: (props) => {
          return <AttendanceComponent {...props} />
        },
      },
      {
        key: 'attendance_all',
        name: '考勤汇总',
        path: '/attendance/list/all',
        component: (props) => {
          return <AttendanceComponent {...props} />
        }
      },
    ],
  },
  {
    key: 'work_list',
    name: '排班管理',
    icon: 'user',
    path: '/work/list',
    component: (props) => {
      return <WorkComponent {...props} />
    },
    children: [],
  },
  {
    key: 'record_list',
    name: '操作记录',
    icon: 'user',
    path: '/record/list',
    component: (props) => {
      return <RecordComponent {...props} />
    },
    children: [],
  },
  {
    key: 'notice_list',
    name: '通知管理',
    icon: 'user',
    path: '/notice/list',
    component: (props) => {
      return <NoticeComponent {...props} />
    },
    children: [],
  },
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      defaultSelectedKeys: 'user_list',
      defaultOpenKeys: 'user_list',
      loginName: '',
      permission: '',

    }
  }

  componentWillMount() {
    let _this = this;

    // AppService.getRequest('/base/login/admin/verify_login').then(response => {
    //   if (response.errorCode === 0) {
    //     _this.setState({
    //       loginName: response.body.userName,
    //       permission: response.body.permissionCodes || [],
    //       superAdmin: response.body.superAdmin
    //     });
    //     sessionStorage.setItem('superAdmin', response.body.superAdmin);
    //   }
    // })


    if (window.location.hash === '#/' || window.location.hash === '') {
      return
    }
    let path = window.location.hash.substring(1).split('/');
    this.setState({
      defaultSelectedKeys: path[1] + '_' + path[2],
      defaultOpenKeys: path[1],
    })
  }


  getMenuItem = () => {
    let _this = this;
    return navs.map(record => {
      // if (record.children.length === 0 && this.state.permission.indexOf(record.key) !== -1) {
      if (record.children.length === 0) {
        return (
          <Menu.Item key={record.key}>
            <NavLink to={record.path}>
              <Icon type={record.icon}/>
              <span className="nav-text">{record.name}</span>
              {record.afterDom && record.afterDom(this.state)}
            </NavLink>
          </Menu.Item>
        )
      } else if (record.children.length !== 0) {
        // 只要有一个子菜单就返回true
        function hasPermission(item) {
          return _this.state.permission.indexOf(item.key) > -1
        }

        // if (record.children.some(hasPermission)) {
        if (true) {
          return (
            <SubMenu
              key={record.key}
              title={
                <span>
                  <Icon type={record.icon}/>
                  <span className="nav-text">{record.name}</span>
                  {record.afterDom && record.afterDom(this.state)}
                </span>
              }
            >
              {
                record.children.map(item => {
                  // if (_this.state.permission.indexOf(item.key) > -1) {
                  if (true) {
                    return (
                      <Menu.Item key={item.key}>
                        <NavLink to={item.path}>
                          <span className="nav-text">{item.name}</span>
                          {item.afterDom && item.afterDom(this.state)}
                        </NavLink>
                      </Menu.Item>
                    )
                  }
                })
              }
            </SubMenu>
          )
        }
      }
    })
  };

  getLinkUrl = (data) => {
    return `/${data.split('_').join('/')}`
  };

  authority = (permission, component, props) => {
    // if (this.state.permission.indexOf(permission) > -1) {
    if (true) {
      return component(props)
    } else {
      return <NoAuthority/>
    }
  };

  toggle = () => {
    let collapsed = !this.state.collapsed;
    if (collapsed) {
      document.getElementById("header").style.marginLeft = "80px";
      document.getElementById("antContent").style.margin = "0 16px 0 96px";
    } else {
      document.getElementById("header").style.marginLeft = "220px";
      document.getElementById("antContent").style.margin = "0 16px 0 236px";
    }
    this.setState({
      collapsed,
    });
  };

  handleOpenChange = (openKeys) => {
    this.setState({
      defaultOpenKeys: openKeys[openKeys.length - 1]
    });
  };

  render() {
    let _this = this;
    return (
      <HashRouter>
        <LocaleProvider locale={zh_CN}>
          <Layout>
            <Sider
              trigger={null}
              collapsible
              collapsed={this.state.collapsed}
              width="220px"
            >
              <div className="index_logo">
                <a href='javascript:;'>
                  <img src={logoImg}></img>
                  <h1>智能排班</h1>
                </a>
              </div>
              <Menu theme="dark" mode="inline" openKeys={[this.state.defaultOpenKeys]}
                    defaultSelectedKeys={[this.state.defaultSelectedKeys]}
                    defaultOpenKeys={[this.state.defaultOpenKeys]} onOpenChange={this.handleOpenChange}>
                {this.getMenuItem()}
              </Menu>
            </Sider>
            <Layout
              // style={{width:"100vw",}}
            >
              <Header style={{background: '#fff', paddingLeft: 0, paddingRight: 16}} className='flex flex-between'
                      id='header'>
                <div className='flex'>
                  <Icon
                    className="trigger"
                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle}
                  />
                </div>
                <_Header loginName={this.state.loginName}/>
              </Header>
              <Content style={{position: 'relative',}} id='antContent'>
                <ScrollToTop>
                  <Switch>
                    <Route exact={true} path='/' render={() => {
                      // 登录跳转index.html后进入第一个有权限的页面
                      // let url = '';
                      // if (_this.state.permission.length) {
                      //   navs.some(record => {
                      //     if (record.children.length) {
                      //       return record.children.some(item => {
                      //         if (_this.state.permission.indexOf(item.key) > -1) {
                      //           url = item.path;
                      //           return true
                      //         }
                      //       })
                      //     } else {
                      //       if (_this.state.permission.indexOf(record.key) > -1) {
                      //         url = record.path;
                      //         return true
                      //       }
                      //     }
                      //   })
                      //   return <Redirect to={url}/>
                      // } else {
                      //   return <NoAuthority/>
                      // }

                      let url = '';
                      if (navs[0].children.length) {
                        url = navs[0].children[0].path
                      } else {
                        url = navs[0].path
                      }
                      return <Redirect to={url}/>

                    }}/>
                    {
                      navs.map((record, index) => {
                        if (record.children.length == 0) {
                          return <Route key={index} path={record.path} render={(props) => {
                            return _this.authority(record.key, record.component, props)
                          }
                          }/>
                        } else {
                          return record.children.map(item => {
                            return <Route key={item.path} path={item.path} render={(props) => {
                              return _this.authority(item.key, item.component, props)
                            }
                            }/>
                          })
                        }
                      })
                    }
                    <Route path='/myCenter/updatePwd' render={(props) => {
                      return <MyCenter {...props} />
                    }}/>
                    <Route render={(props) => <NotFound/>}/>
                  </Switch>
                </ScrollToTop>
              </Content>
            </Layout>
          </Layout>
        </LocaleProvider>
      </HashRouter>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('container'))