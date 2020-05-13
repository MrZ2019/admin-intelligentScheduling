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
  TreeSelect,
  Upload,
  Menu,
  Dropdown,
  Switch,
  InputNumber,
  Icon,
  TimePicker,
} from "antd";

const Option = Select.Option;
const {TextArea} = Input;
const FormItem = Form.Item;
const dateFormat = "YYYY-MM-DD HH:mm:ss";
const format = 'HH:mm';
const {RangePicker} = DatePicker;

import * as DepartmentAction from "../../services/department";
import * as UserAction  from "../../services/user";
import * as RuleAction  from "../../services/rule";
import Utils from "../../utils/utils";
import moment from "moment"


const STATUS = {
  "0": "在职",
  "1": "离职",
}
// 考勤对象模态框
@Form.create()
class UserModal extends React.Component {

  constructor(props) {
    super(props);
    console.log('UserModal',props);
    this.state = {
      list: [],
      pagination: {
        showQuickJumper: true,
      },
      filters: {
        deptId: props.depId,
      },
      loading: false,
      tableConfig: {
        page: 0,
        size: 10
      },

      // 父组件传参
      selectedRowKeys: props.selectedRowKeys || [],

      // 部门
      departments: [],
      // 班组
      teams: [],
      // 岗位
      posts: [],
    };
  }

  columns = [
    {
      title: "姓名",
      dataIndex: "userName",
    },
    {
      title: "性别",
      dataIndex: "gender",
      render: (val, record, index) => {
        return (
          <span>{val == '0' ? '男' : '女'}</span>
        );
      }
    },
    {
      title: "年龄",
      dataIndex: "age",
    },
    {
      title: "外单位工龄",
      dataIndex: "outWorkYears",
    },
    {
      title: "部门",
      dataIndex: "deptName",
    },
    {
      title: "班组",
      dataIndex: "ruleName",
    },
    {
      title: "岗位",
      dataIndex: "postName",
    },
    {
      title: "工号",
      dataIndex: "code",
    },
    {
      title: "持证",
      dataIndex: "is_certificate",
      render: val => <span>{val === 0 ? "是" : "否"}</span>
    },
    {
      title: "级别",
      dataIndex: "level",
    },
    {
      title: "手机号",
      dataIndex: "phone",
    },
    {
      title: "状态",
      dataIndex: "status",
      render: val => <span>{STATUS[val]}</span>
    },
    {
      title: "操作",
      dataIndex: "tableOperation",
      render: (val, record, index) => {
        const obj = JSON.stringify({
          id: record.id,
          userName: record.userName,
        })
        const arr = [obj];
        return (
          <div className='operation'>
            <a onClick={() => this.props.modalOk(arr)}>选择</a>
          </div>
        );
      }
    }
  ]

  componentDidMount() {
    this.getList();
    this.departmentChange(this.props.depId)

    this.getDepartment();
  }

  // 获取所有部门
  getDepartment = () => {
    DepartmentAction.findAllDept().then(result => {
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

  // 获取表格数据
  getList = params => {
    const newParams = {
      ...this.state.tableConfig,
      ...this.state.filters,
      ...params,
    };

    this.setState({loading: true});
    UserAction.getUserList({...newParams}).then(result => {
      const pagination = {...this.state.pagination};
      pagination.current = result.body.page + 1;
      pagination.total = result.body.totalCount;
      pagination.showTotal = total => {
        return `总共 ${total} 条`;
      };
      this.setState({
        loading: false,
        pagination,
        list: result.body.rows
      });
    });
  };

  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const {vipDate} = values;
      values.startVipTime = Utils.getStringFromMonent(vipDate, 0, dateFormat);
      values.endVipTime = Utils.getStringFromMonent(vipDate, 1, dateFormat);


      this.setState({
        filters: values
      });
      this.getList({...values});
    });
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.getList({
      page: pagination.current - 1,
    });
  };

  renderForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    const {departments, teams, posts} = this.state;

    const ColLayout = {
      md: 6,
      sm: 24,
    };

    return (
      <Form
        className="ant-advanced-search-form tableListForm"
        onSubmit={this.handleSearch}
        autoComplete={'off'}
      >
        <Row gutter={24}>
          <Col {...ColLayout}>
            <FormItem label="姓名">
              {getFieldDecorator("userName")(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col {...ColLayout}>
            <FormItem label="工号">
              {getFieldDecorator("code")(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col {...ColLayout}>
            <FormItem label="状态">
              {getFieldDecorator("type", {
                initialValue: ""
              })(
                <Select>
                  <Option value="">全部</Option>
                  {
                    Object.keys(STATUS)
                      .map(key => <Option key={key} value={key}>{STATUS[key]}</Option>)
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...ColLayout}>
            <FormItem label="性别">
              {getFieldDecorator("gender", {
                initialValue: ""
              })(
                <Select>
                  <Option value="">全部</Option>
                  <Option value={0}>男</Option>
                  <Option value={1}>女</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...ColLayout}>
            <FormItem label="部门">
              {getFieldDecorator("deptId", {
                initialValue: this.props.depId
              })(
                <Select onChange={this.departmentChange} disabled>
                  <Option value="">全部</Option>
                  {
                    departments.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...ColLayout}>
            <FormItem label="班组">
              {getFieldDecorator("teamId", {
                initialValue: ""
              })(
                <Select onChange={this.teamChange}>
                  <Option value="">全部</Option>
                  {
                    teams.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...ColLayout}>
            <FormItem label="岗位">
              {getFieldDecorator("postId", {
                initialValue: ""
              })(
                <Select>
                  <Option value="">全部</Option>
                  {
                    posts.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
                  }
                </Select>
              )}
            </FormItem>
          </Col>

          <Col {...ColLayout} className="searchBtn">
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  okHandle = () => {
    const {modalOk } = this.props;
    const { selectedRowKeys } = this.state;
    console.log(selectedRowKeys);
    modalOk(selectedRowKeys)
  };

  render() {
    const { modalVisible, form, modalCancel } = this.props;
    const { getFieldDecorator } = form;

    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {

        this.setState({
          selectedRowKeys: selectedRowKeys,
          selectedRows: selectedRows,
        })
      },
    };

    return (
      <Modal
        width={"80%"}
        destroyOnClose
        // visible={true}
        visible={modalVisible}
        title={'选择考勤对象'}
        okText="确定"
        cacleText="取消"
        onCancel={modalCancel}
        onOk={this.okHandle}
      >
        {this.renderForm()}
        <Table
          rowSelection={rowSelection}
          columns={this.columns}
          rowKey={record => JSON.stringify({
            id: record.id,
            userName: record.userName,
          })}
          dataSource={this.state.list}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
        />
      </Modal>
    )
  }
}

let ruleNum = 1;
// let ruleKeys = [];
// 排班规则数据
// rules: [
//   {
//     shiftsname: '',
//     shortName: '',
//     startHour1: '',
//     endHour1: '',
//     startHour2: '',
//     endHour2: '',
//     userIdList: '',
//   },
// ],

@Form.create()
class Detail extends React.Component {

  state = {
    userModalVisible: false,

    departments: [],

    // 考勤对象集合，{ruleKey: [{id:xxx,userName:xxx}]}
    attendanceObject: {},
    // 排班规则的key管理
    ruleKeys: [0,],
    rules: [
      {
        shiftsname: '',
        shortName: '',
        startHour1: '',
        endHour1: '',
        startHour2: '',
        endHour2: '',
        userIdList: '',
      },
    ],

    // 编辑规则详情
    detail: {},
  };


  componentDidMount() {
    this.getDepartment();

    const { id } = this.props.match.params;
    if (id !== undefined) {
      RuleAction.findShiftById({
        id,
      }).then(result => {
        const res = result.body;
        let attendanceObject = {};
        attendanceObject[0] = res.userVoList && res.userVoList.map(item => ({
          id: item.id,
          userName: item.userName,
        }))
        this.setState({
          depId: res.depId,
          detail: res,
          attendanceObject,
        })
      })
    }
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

  // 选择考勤对象
  userModal = selectRuleKey => {
    const { getFieldValue } = this.props.form;
    const depId = getFieldValue('depId')
    // const { depId } = this.state;
    console.log('选择考勤对象前', depId);
    if (depId === undefined || depId === "") {
      Utils.dialog.error("请选择部门！")
      return
    }

    this.setState({
      depId,
      selectRuleKey,
      userModalVisible: true,
    })

  }

  // 选择考勤对象模态框取消
  userModalCancel = () => {
    this.setState({
      userModalVisible: false,
    })
  }

  // 选择考勤对象模态框确定
  userModalOk = selectedRowKeys => {
    const { selectRuleKey, attendanceObject } = this.state;
    const selectedRowKeysArr = selectedRowKeys.map(item => JSON.parse(item))

    let newAttendanceObject = {...attendanceObject};
    newAttendanceObject[selectRuleKey] = selectedRowKeysArr
    console.log('selectedRowKeys', selectedRowKeys);
    console.log('newAttendanceObject',newAttendanceObject);

    // 给页面考勤对象赋值中文
    this.props.form.setFieldsValue({
      [`rules[${selectRuleKey}].userIdList`]: selectedRowKeysArr.map(item => item.userName).join(',')
    })
    this.setState({
      attendanceObject: newAttendanceObject,
      userModalVisible: false,
    })
  };

  // 添加规则
  addRule = () => {
    const {ruleKeys} = this.state;
    const newRuleKeys = ruleKeys.concat(ruleNum);
    console.log('newRuleKeys', newRuleKeys);
    this.setState({
      ruleKeys: newRuleKeys,
    }, () => {
      ruleNum++
    })
  }

  // 移出规则
  removeRule = ruleKey => {
    const {ruleKeys} = this.state;
    const newRuleKeys = ruleKeys.filter(item => item !== ruleKey);
    console.log('remove newRuleKeys',ruleKey, newRuleKeys);
    this.setState({
      ruleKeys: newRuleKeys,
    })
  }

  // 切换部门时
  ruleDepartmentChange = (value) => {
    const { ruleKeys } = this.state;

    let userIdList = {};
    ruleKeys.forEach(item => userIdList[`rules[${item}].userIdList`] = '')
    // 切换部门时 清空页面考勤对象
    this.props.form.setFieldsValue(userIdList)
    this.setState({
      attendanceObject: {},
    })
  }

  checkStartHour2 = (rule, value, callback, ruleKey) =>{
    const { getFieldValue } = this.props.form;
    const endHour2 = getFieldValue(`rules[${ruleKey}].endHour2`)
    if (endHour2 && value === null) {
      callback('请填写班时2开始时间')
    }

    // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
    callback()
  }

  checkEndHour2 = (rule, value, callback, ruleKey) =>{
    const { getFieldValue } = this.props.form;
    const startHour2 = getFieldValue(`rules[${ruleKey}].startHour2`)
    if (startHour2 && value === null) {
      callback('请填写班时2结束时间')
    }

    // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
    callback()
  }

  handleSubmit = e => {
    e.preventDefault();
    const { id } = this.props.match.params;
    const { depId, attendanceObject } = this.state;
    this.props.form.validateFields((err, values) => {
      if (err) return;
      console.log('form values', values,values.rules);
      console.log(attendanceObject);
      const {rules} = values;
      let shiftsListJson = rules.map((item, index) => {
        item.startHour1 = item.startHour1 && moment(item.startHour1).format("HH:mm:ss")
        item.endHour1 = item.endHour1 && moment(item.endHour1).format("HH:mm:ss")
        item.startHour2 = item.startHour2 && moment(item.startHour2).format("HH:mm:ss")
        item.endHour2 = item.endHour2 && moment(item.endHour2).format("HH:mm:ss")

        item.userIdList = attendanceObject[index] && attendanceObject[index].map(item => item.id)
        return item;
      })
      console.log('shiftsListJson',shiftsListJson);

      let request;
      // 判断是新增还是编辑
      if (id === undefined) {
        request = RuleAction.addShift({
          depId,
          shiftsListJson: JSON.stringify(shiftsListJson),
        })
      } else {
        request = RuleAction.updateShift({
          ...shiftsListJson[0],
          userIdList: shiftsListJson[0].userIdList.join(),
          shiftsname: shiftsListJson[0].name,
          shiftsId: id,
          depId,
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
      form: {getFieldDecorator, getFieldValue},
      match,
    } = this.props;
    const {id} = match.params;
    const {departments, ruleKeys, attendanceObject, detail} = this.state;

    const ColLayout = {
      md: 6,
      sm: 24,
    };

    return (
      <Form
        // className=" tableListForm"
        onSubmit={this.handleSubmit}
        autoComplete={'off'}
      >
        <Row gutter={24}>
          <Col {...ColLayout}>
            <FormItem label="部门">
              {getFieldDecorator("depId", {
                rules: [{required: true, message: '请选择部门!'}],
                initialValue: detail.depId !== undefined ? detail.depId : ""
              })(
                <Select onChange={this.ruleDepartmentChange}>
                  <Option value="">请选择</Option>
                  {
                    departments.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        {
          ruleKeys.map((ruleKey, index) => (
            <Row key={ruleKey} className="border-bottom" gutter={24}>
              <Col {...ColLayout} md={3}>
                <FormItem label="班次名称">
                  {getFieldDecorator(`rules[${ruleKey}].name`, {
                    rules: [{required: true, message: '请填写班次名称!'}],
                    initialValue: detail.name
                  })(
                    <Input/>
                  )}
                  {ruleKeys.length > 1 ? (
                    <Icon
                      style={{marginLeft: 8}}
                      type="minus-circle-o"
                      onClick={() => this.removeRule(ruleKey)}
                    />
                  ) : null}
                </FormItem>
              </Col>
              <Col {...ColLayout} md={3}>
                <FormItem label="班次缩写">
                  {getFieldDecorator(`rules[${ruleKey}].shortName`, {
                    rules: [
                      {required: true, message: '请填写班次缩写!'},
                      {max: 1, message: '班次缩写限制为 一个字!'},
                      ],
                    initialValue: detail.shortName
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
              <Col {...ColLayout}>
                <FormItem
                  label="班时1"
                  style={{marginBottom:0}}
                  help={<span>如果是1个班8小时分段上，则需填写2个班时。如果是1个班8小时连上，只需要填写班时1即可</span>}
                >
                  <div style={{display:'flex'}}>
                    <FormItem>
                      {getFieldDecorator(`rules[${ruleKey}].startHour1`, {
                        rules: [{required: true, message: '请填写班时1开始时间!'}],
                        initialValue: detail.startHour1 && moment(detail.startHour1, format)
                      })(
                        <TimePicker format={format} />
                      )}
                    </FormItem>
                    <span style={{margin: "0 8px"}}>-</span>
                    <FormItem>
                      {getFieldDecorator(`rules[${ruleKey}].endHour1`, {
                        rules: [{required: true, message: '请填写班时1结束时间!'}],
                        initialValue: detail.endHour1 && moment(detail.endHour1, format)
                      })(
                        <TimePicker format={format} />
                      )}
                    </FormItem>
                  </div>
                </FormItem>
              </Col>
              <Col {...ColLayout}>
                <FormItem label="班时2" style={{marginBottom:0}}>
                  <div style={{display:'flex'}}>
                    <FormItem>
                      {getFieldDecorator(`rules[${ruleKey}].startHour2`, {
                        rules: [
                          {
                            // 班时2结束时间 填写后，该时间也应该填写
                            // validator: (rule, value) => getFieldValue(`rules[${ruleKey}].endHour2`) && !value && new Error('请填写班时2开始时间!')
                            validator: (rule, value, callback) => this.checkStartHour2(rule, value, callback, ruleKey)
                          },
                        ],
                        initialValue: detail.startHour2 && moment(detail.startHour2, format)
                      })(
                        <TimePicker format={format} />
                      )}
                    </FormItem>
                    <span style={{margin: "0 8px"}}>-</span>
                    <FormItem>
                      {getFieldDecorator(`rules[${ruleKey}].endHour2`, {
                        rules: [
                          {
                            // 班时2开始时间 填写后，该时间也应该填写
                            // validator: (rule, value) => getFieldValue(`rules[${ruleKey}].startHour2`) && !value && new Error('请填写班时2结束时间!')
                            validator: (rule, value, callback) => this.checkEndHour2(rule, value, callback, ruleKey)
                          },
                        ],
                        initialValue: detail.endHour2 && moment(detail.endHour2, format)
                      })(
                        <TimePicker format={format} />
                      )}
                    </FormItem>
                  </div>
                </FormItem>
              </Col>
              <Col {...ColLayout}>
                <FormItem label="考勤对象">
                  {getFieldDecorator(`rules[${ruleKey}].userIdList`, {
                    // rules: [{required: true, message: '请选择考勤对象!'}],
                    initialValue: attendanceObject[ruleKey] && attendanceObject[ruleKey].map(item => item.userName).join()
                  })(
                    <TextArea row={6} onClick={() => this.userModal(ruleKey)} />
                  )}
                </FormItem>
              </Col>

            </Row>
          ))
        }

        {
          id === undefined && (
            <Row gutter={24}>
              <FormItem>
                <Button type="dashed" onClick={this.addRule} >
                  <Icon type="plus"/> 添加班次
                </Button>
              </FormItem>
            </Row>
          )
        }

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
    const {match} = this.props;
    const id = match.params.id;
    const { userModalVisible } = this.state;

    const selectedRowKeys = this.state.attendanceObject[this.state.selectRuleKey];
    const userModalParams = {
      modalOk: this.userModalOk,
      modalCancel: this.userModalCancel,
      modalVisible: this.state.userModalVisible,
      depId: this.state.depId,
      selectedRowKeys: selectedRowKeys && selectedRowKeys.map(item => JSON.stringify(item))
    };

    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <span>{id === undefined ? "添加班次" : "编辑班次"}</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a onClick={() => this.props.history.goBack()}><Icon type="rollback"/>返回上级</a>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="content">
          <div>
            {this.renderForm()}
            {
              userModalVisible && <UserModal {...userModalParams} />
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Detail;
