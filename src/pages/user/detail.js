import {Link} from "react-router-dom";
import {
  Select,
  Button,
  Input,
  Popconfirm,
  Form,
  Row,
  Col,
  Table,
  Breadcrumb,
  Modal,
  Divider,
  Popover,
  Badge,
  DatePicker,
  Upload,
  Menu,
  Dropdown,
  InputNumber,
  Icon,
  Checkbox,
} from "antd";

const Option = Select.Option;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const dateFormat = "YYYY-MM-DD HH:mm:ss";

import * as DepartmentAction from "../../services/department";
import * as UserAction from "../../services/user";
import * as AuthorityAction from "../../services/authority";
import Utils from "../../utils/utils";
import moment from "moment"


@Form.create()
class Detail extends React.Component {

  state = {
    detail: {},

    // 部门
    departments: [],
    // 班组
    teams: [],
    // 岗位
    posts: [],

    // 查看类角色权限
    lookIndeterminate: false,
    lookCheckAll: false,
    lookOptions: [],
    lookCheckedList: [],

    // 审批权限
    haveApproval: false,
    approvalIndeterminate: false,
    approvalCheckAll: false,
    approvalOptions: [],
    approvalCheckedList: [],
  };


  componentDidMount() {
    this.getDepartment();
    this.getLookAuthority();
    this.getApprovalAuthority();

    const { id } = this.props.match.params;
    if (id !== undefined) {
      UserAction.getUserById(id).then( result => {
        if (result.errorCode === 0) {
          let detail = result.body;
          detail.birthday = moment(detail.birthdayTime)
          detail.entryTime = moment(detail.entryTime)

          // type 是否有登录后台权限, 0为是，默认1为否
          detail.haveLoginBackend = !detail.type;
          // isApproval 是否有审核权限， 0为是，默认1为否
          const haveApproval = !detail.isApproval;

          let permissionObj = {};
          detail.permissionList.forEach(item => permissionObj = {...permissionObj, ...item})
          const lookCheckedList = permissionObj.REVIEW.map(item => item.id)
          const approvalCheckedList = permissionObj.APPROVAL.map(item => item.id)


          this.setState({
            depId: detail.depId,
            detail,
            lookCheckedList,
            lookCheckAll: lookCheckedList.length === this.state.lookOptions.length,
            haveApproval,
            approvalCheckedList,
            approvalCheckAll: approvalCheckedList.length === this.state.approvalOptions.length,
          }, () => {
            this.getTeam(detail.depId)
            this.getPost(detail.depId, detail.teamId)
          })


          console.log('改造后',detail);
        }
      })
    }
  }

  getLookAuthority = () => {
    AuthorityAction.getLookAuthority().then(result => {
      const lookOptions = result.body.map(item => ({
        label: item.name,
        value: item.id,
      }))
      this.setState({
        lookOptions,
      });
    });
  }

  getApprovalAuthority = () => {
    AuthorityAction.getApprovalAuthority().then(result => {
      const approvalOptions = result.body.map(item => ({
        label: item.name,
        value: item.id,
      }))
      this.setState({
        approvalOptions,
      });
    });
  }

  // 获取所有部门
  getDepartment = () => {
    DepartmentAction.findAllDept().then(result => {
      console.log(result);
      this.setState({
        departments: result.body,
      });
    });
  }

  // 部门id获取班组
  getTeam = (depId) => {
    DepartmentAction.findTeamByDepId({
      depId,
    }).then(result => {
      this.setState({
        teams: result.body,
      });
    });
  }

  // 部门id，班组id获取岗位
  getPost = (depId, teamId) => {
    DepartmentAction.findPostById({
      depId,
      teamId,
    }).then(result => {
      this.setState({
        posts: result.body,
      });
    });
  }

  departmentChange = (value) => {
    this.setState({
      depId: value,

      // 清空之前班组和岗位
      teams: [],
      posts: [],
    }, () => {
      this.props.form.setFieldsValue({teamId:""});
      this.props.form.setFieldsValue({postId:""});
      this.getTeam(value)
      // 可能没有班组，直接查询岗位
      this.getPost(value)
    })
  }

  teamChange = (value) => {
    const {depId} = this.state;
    this.setState({
      // 清空之前岗位
      posts: [],
    }, () => {
      this.props.form.setFieldsValue({postId:""});
      this.getPost(depId, value)
    })
  }

  // 查看类角色权限全选
  onLookCheckAllChange = e => {
    const {lookOptions} = this.state;
    this.setState({
      lookCheckedList: e.target.checked ? lookOptions.map(item => item.value) : [],
      lookIndeterminate: false,
      lookCheckAll: e.target.checked,
    });
  }

  // 查看类角色权限
  onLookChange = checkedList  => {
    const {lookOptions} = this.state;
    this.setState({
      lookCheckedList: checkedList,
      lookIndeterminate: !!checkedList.length && checkedList.length < lookOptions.length,
      lookCheckAll: checkedList.length === lookOptions.length,
    });
  }

  // 是否有审批选项
  haveApprovalChange = e => {
    this.setState({
      haveApproval: e.target.checked,
    })
  }

  // 审批权限全选
  onApprovalCheckAllChange = e => {
    const {approvalOptions} = this.state;
    this.setState({
      approvalCheckedList: e.target.checked ? approvalOptions.map(item => item.value) : [],
      approvalIndeterminate: false,
      approvalCheckAll: e.target.checked,
    });
  }

  // 审批权限
  onApprovalChange = checkedList  => {
    const {approvalOptions} = this.state;
    this.setState({
      approvalCheckedList: checkedList,
      approvalIndeterminate: !!checkedList.length && checkedList.length < approvalOptions.length,
      approvalCheckAll: checkedList.length === approvalOptions.length,
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) return;
      console.log('form values', values,);
      values.birthday = values.birthday && moment(values.birthday.valueOf()).format("YYYY-MM-DD")
      values.entryTime = values.entryTime && moment(values.entryTime.valueOf()).format("YYYY-MM-DD")

      // 是否有登录后台权限, 0为是，默认1为否
      values.type = Number(!values.haveLoginBackend);
      // 是否有审核权限， 0为是，默认1为否
      values.isApproval = Number(!values.haveApproval);

      const { lookCheckedList, approvalCheckedList } = this.state;
      values.permissionIdList = lookCheckedList.join();
      if (values.haveApproval) {
        values.permissionIdList = [...lookCheckedList, ...approvalCheckedList].join()
      }
    console.log('form values', values);


      const {id} = this.props.match.params;
      let request;
      if (id !== undefined) {
        request = UserAction.updateUser({
          ...values,
          userId: id,
        })
      } else {
        request = UserAction.addUser({
          ...values,
        })
      }

      request.then(result => {
        if (result.errorCode === 0) {
          Utils.dialog.success("提交成功！");
          this.props.history.goBack();
        }
      });

    });
  };

  renderForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    const {
      detail, departments, teams, posts,
      lookIndeterminate, lookCheckAll, lookOptions, lookCheckedList,
      haveApproval,approvalIndeterminate, approvalCheckAll, approvalOptions, approvalCheckedList,
    } = this.state;

    const ColLayout = {
      md: 6,
      sm: 24,
    };

    return (
      <Form
        className=" tableListForm"
        onSubmit={this.handleSubmit}
        autoComplete={'off'}
      >
        <Row gutter={24}>
          <Col {...ColLayout}>
            <FormItem label="姓名">
              {getFieldDecorator('name', {
                rules: [{
                  required: true, message: '请输入姓名',
                }],
                initialValue: detail.name
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col {...ColLayout}>
            <FormItem label="性别">
              {getFieldDecorator('gender', {
                rules: [{
                  required: true, message: '请选择性别',
                }],
                initialValue: detail.gender
              })(
                <Select>
                  <Option value={0}>男</Option>
                  <Option value={1}>女</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...ColLayout}>
            <FormItem label="出生日期">
              {getFieldDecorator('birthday', {
                initialValue: detail.birthday
              })(
                <DatePicker style={{width: '100%'}} />
              )}
            </FormItem>
          </Col>
          <Col {...ColLayout}>
            <FormItem label="手机号">
              {getFieldDecorator('phone', {
                rules: [{
                  required: true, message: '请输入手机号',
                }],
                initialValue: detail.phone
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col {...ColLayout}>
            <FormItem label="所属部门">
              {getFieldDecorator("deptId", {
                rules: [{
                  required: true, message: '请选择所属部门',
                }],
                initialValue: detail.depId
              })(
                <Select onChange={this.departmentChange}>
                  <Option value="">请选择</Option>
                  {
                    departments.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...ColLayout}>
            <FormItem label="所属班组">
              {getFieldDecorator("teamId", {
                initialValue: detail.teamId
              })(
                <Select onChange={this.teamChange}>
                  <Option value="">请选择</Option>
                  {
                    teams.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...ColLayout}>
            <FormItem label="所属岗位">
              {getFieldDecorator("postId", {
                rules: [{
                  required: true, message: '请选择所属岗位',
                }],
                initialValue: detail.postId
              })(
                <Select>
                  <Option value="">请选择</Option>
                  {
                    posts.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
                  }
                </Select>
              )}
            </FormItem>
          </Col>

          <Col {...ColLayout}>
            <FormItem label="外单位工龄" help="按月算">
              {getFieldDecorator('outWorkYears', {
                rules: [{
                  required: true, message: '请输入外单位工龄',
                }],
                initialValue: detail.outWorkYears
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col {...ColLayout}>
            <FormItem label="入职时间">
              {getFieldDecorator('entryTime', {
                rules: [{
                  required: true, message: '请选择入职时间',
                }],
                initialValue: detail.entryTime
              })(
                <DatePicker style={{width: '100%'}} />
              )}
            </FormItem>
          </Col>
          <Col {...ColLayout}>
            <FormItem label="工号">
              {getFieldDecorator('code', {
                rules: [{
                  required: true, message: '请输入工号',
                }],
                initialValue: detail.code
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col {...ColLayout}>
            <FormItem label="是否持证">
              {getFieldDecorator('isCertificate', {
                rules: [{
                  required: true, message: '请选择是否持证',
                }],
                initialValue: detail.isCertificate
              })(
                <Select>
                  <Option value="">请选择</Option>
                  <Option value={0}>是</Option>
                  <Option value={1}>否</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...ColLayout}>
            <FormItem label="所属级别">
              {getFieldDecorator('levelId', {
                rules: [{
                  required: true, message: '请选择所属级别',
                }],
                initialValue: detail.levelId
              })(
                <Select>
                  <Option value="">请选择</Option>
                  <Option value={1}>1级</Option>
                  <Option value={2}>2级</Option>
                  <Option value={3}>3级</Option>
                  <Option value={4}>4级</Option>
                  <Option value={5}>5级</Option>
                  <Option value={6}>6级</Option>
                </Select>
              )}
            </FormItem>
          </Col>

        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Row type="flex" justify="space-around">
              <FormItem>
                {getFieldDecorator('haveApproval', {
                  valuePropName: 'checked',
                  initialValue: haveApproval
                })(
                  <Checkbox onChange={this.haveApprovalChange} style={{color: 'red'}}>允许此人有审批权限</Checkbox>
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('haveLoginBackend', {
                  valuePropName: 'checked',
                  initialValue: detail.haveLoginBackend
                })(
                  <Checkbox style={{color: 'red'}}>允许此人有登录后台权限</Checkbox>
                )}
              </FormItem>
            </Row>
          </Col>
          <Col span={12}>
            <FormItem>
              <Icon style={{color: 'red',marginRight: 12}} type="exclamation-circle"/>所有员工账号为工号,初始密码为123456
            </FormItem>
          </Col>
        </Row>

        <Row gutter={24} style={{margin: "0 48px 48px"}}>
          <Col span={12}>
            <div style={{borderBottom: '1px solid #E9E9E9'}}>
              <span style={{color: 'red', marginRight: 10}}>查看类角色权限 </span>
              <Checkbox
                style={{margintRight: 10}}
                indeterminate={lookIndeterminate}
                onChange={this.onLookCheckAllChange}
                checked={lookCheckAll}
              >
                所有权限
              </Checkbox>
            </div>
            <br/>
            <CheckboxGroup
              style={{width:'100%'}}
              // options={lookOptions}
              value={lookCheckedList}
              onChange={this.onLookChange}
            >
              <Row>
                {
                  lookOptions.map((item,index) => (
                    <Col key={index} span={8}>
                      <Checkbox value={item.value}>{item.label}</Checkbox>
                    </Col>
                  ))
                }
              </Row>
            </CheckboxGroup>
          </Col>
          {
            haveApproval && (
              <Col span={12}>
                <div style={{borderBottom: '1px solid #E9E9E9'}}>
                  <span style={{color: 'red', marginRight: 10}}>审批权限 </span>
                  <Checkbox
                    style={{margintRight: 10}}
                    indeterminate={approvalIndeterminate}
                    onChange={this.onApprovalCheckAllChange}
                    checked={approvalCheckAll}
                  >
                    所有权限
                  </Checkbox>
                </div>
                <br/>
                <CheckboxGroup
                  style={{width:'100%'}}
                  // options={approvalOptions}
                  value={approvalCheckedList}
                  onChange={this.onApprovalChange}
                >
                  <Row>
                    {
                      approvalOptions.map((item,index) => (
                        <Col key={index} span={8}>
                          <Checkbox value={item.value}>{item.label}</Checkbox>
                        </Col>
                      ))
                    }
                  </Row>
               </CheckboxGroup>
              </Col>
            )
          }
        </Row>

        <Row gutter={24}>
          <Col className="searchBtn">
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    let {match} = this.props;
    const id = match.params.id;

    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <span>{id === undefined ? "添加新员工" : "编辑员工"}</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a onClick={() => this.props.history.goBack()}><Icon type="rollback"/>返回上级</a>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="content">
          <div>
            {this.renderForm()}
          </div>
        </div>
      </div>
    );
  }
}

export default Detail;
