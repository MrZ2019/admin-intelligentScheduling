import {Form, Input, Radio, Icon, Breadcrumb, Checkbox, Button, Alert,Row,Col} from 'antd';
const FormItem = Form.Item;

import * as Actions from './action'
import Utils from '../../utils/utils'

class Detail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmDirty: false,
      buttonLoading: false
    }
  }

  handleSubmit = (e) => {
    let _this = this
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err) {
        // let regExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/
        // if(!regExp.test(values.confirmPwd)){
        //   Utils.dialog.error('密码由8-16位字母和数字组成')
        // }else{
          _this.setState({
            buttonLoading: true
          })
          // for (let [key, value] of Object.entries(values)) {
          //   values[key] = Utils.sha256_digest(value)
          // }
          Actions.updatePwd(values).then(response => {
            _this.setState({
              buttonLoading: false
            })
            if (response.errorCode == 0) {
              Utils.dialog.success('修改成功', ()=> {
                _this.props.form.resetFields();
              })
            } else {
              Utils.dialog.error(response.msg)
            }
          })
        // }
      }
    });
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({confirmDirty: this.state.confirmDirty || !!value});
  }

  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('pwd')) {
      callback('两次密码输入不一致!');
    } else {
      callback();
    }
  }

  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], {force: true});
    }
    callback();
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 4},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };
   return (
     <div>
       <Form onSubmit={this.handleSubmit.bind(this)}>
         <Row type="flex" justify="start" className='row'>
           <Col span={3} className='left_label'>修改密码</Col>
           <Col span={20} className='right_content'>
           <FormItem
             {...formItemLayout}
             label="旧密码"
             hasFeedback
           >
             {getFieldDecorator('oldPwd', {
               rules: [{
                 required: true, message: '请填写旧密码!',
               }],
             })(
               <Input type="password" style={{width:400}}/>
             )}
           </FormItem>
           <FormItem
             {...formItemLayout}
             label="新密码"
             hasFeedback
           >
             {getFieldDecorator('pwd', {
               rules: [{
                 required: true, message: '请填写新密码!',
               }, {
                 validator: this.checkConfirm.bind(this),
               },  { min: 8, message: '请输入至少8位' },
                 { max: 32, message: '最多输入32位' },
               ]
             })(
               <Input type="password" style={{width:400}}/>
             )}
           </FormItem>
           <FormItem
             {...formItemLayout}
             label="确认密码"
             hasFeedback
           >
             {getFieldDecorator('confirmPwd', {
               rules: [{
                 required: true, message: '请确认密码',
               }, {
                 validator: this.checkPassword.bind(this),
               },
                 { min: 8, message: '请输入至少8位' },
                 { max: 32, message: '最多输入32位' },]
             })(
               <Input type="password" onBlur={this.handleConfirmBlur.bind(this)} style={{width:400}}/>
             )}
           </FormItem>
           <FormItem {...tailFormItemLayout}>
             <Button type="primary" htmlType="submit" size="large"
                     loading={this.state.buttonLoading}>{this.state.buttonLoading ? '正在提交...' : '提交'}</Button>
           </FormItem>
           </Col>
         </Row>
       </Form>
     </div>
   )
  }
}

const UpdatePwd = Form.create()(Detail)
export default UpdatePwd