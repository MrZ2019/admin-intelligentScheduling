/**
 * Created by Administrator on 2017/8/7.
 */

import '../utils/lib'
import {
  Form,
  Input,
  Row,
  Col,
  Icon,
  Button,
  Alert
} from 'antd';
const FormItem = Form.Item;
import Utils from '../utils/utils'
import AppService from '../utils/app.service'

import '../css/common.less'
import '../css/login.less'

import logo from '../images/logo.png'

const CodeUrl = AppService.codeUrl

class loginForm extends React.Component {
  state = {
    codeShow: false,
    codeImg: '',
    tips: '',
    passwordInputType: 'text',
    loginName: ''
  }

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {

  }

  handleSubmit = (e) => {
    e.preventDefault();
    let _this = this
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // values.password = Utils.sha256_digest(values.password)
        AppService.postRequest('/base/login/admin/login', values).then(result => {
          if (result.errorCode == 0) {
            var url = sessionStorage.getItem('gotoBeforeUrl');
            if (url == null) {
              url = './index.html'
            }
            window.location.replace(url)
          } else {
            _this.setState({
              tips: result.msg,
              codeImg: CodeUrl + Math.random()
            })
          }
        })
      }
    });

  }
  changeImg = () => {
    this.setState({
      codeImg: CodeUrl + Math.random()
    })
  }

  onFocus = () => {
    this.setState({
      passwordInputType: 'password'
    })
  }

  render() {
    const {
      getFieldDecorator
    } = this.props.form;
    return (
      <div className="login-content">
        <div className="login-box">
          <div className='login-header flex flex-middle'>
            <div className="header-logo">
              {/* <i className="anticon anticon-zhongguoyidong"></i> */}
            </div>
            <div className="header-title">欢迎登录</div>
          </div>
          <div className='login-form'>
            <div className="login_content flex flex-right">
              <div style={{paddingTop:100}}>
                {this.state.tips && <Alert message={this.state.tips} type="error" style={{marginBottom: 12}}/>}
                <div className="login-title">账号登录</div>
                <Form onSubmit={this.handleSubmit} className="login_form">
                  <FormItem>
                    {getFieldDecorator('loginName', {
                      rules: [{required: true, message: '请输入账号'}],
                    })(
                      <Input prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="账号"/>
                    )}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('password', {
                      rules: [{required: true, message: '请输入密码'}],
                    })(
                      <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>} type={this.state.passwordInputType} placeholder="密码" onFocus={this.onFocus.bind(this)}/>
                    )}
                  </FormItem>
                  {this.state.codeShow && <FormItem>
                    <Row gutter={8}>
                      <Col span={12}>
                        {getFieldDecorator('verificationCode', {
                          rules: [{required: true, message: '请输入验证码'}],
                        })(
                          <Input size="large"/>
                        )}
                      </Col>
                      <Col span={12}>
                        <img src={this.state.codeImg} className="codeimg" onClick={this.changeImg}/>
                      </Col>
                    </Row>
                  </FormItem>}
                  <FormItem>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                      登录
                    </Button>
                  </FormItem>
                </Form>
              </div>
            </div>
          </div>
          <div className="copyright">
             欢迎登录天河客运站智能排班管理后台
          </div>  
        </div>
      </div>
    )
  }
}
const App = Form.create()(loginForm)
ReactDOM.render(<App/>, document.getElementById('container'))