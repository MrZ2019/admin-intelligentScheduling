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
  Radio,
} from "antd";

const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const dateFormat = "YYYY-MM-DD HH:mm:ss";
const monthFormat = "YYYY-MM";
const {MonthPicker, WeekPicker} = DatePicker;

import * as UserAction from "../../services/user";
import * as DepartmentAction from "../../services/department";
import * as WorkAction from "../../services/work";
import Utils from "../../utils/utils";
import {WEEK_TEXT} from "../../utils/constants";
import moment from "moment"


const STATUS = {
  "0": "在职",
  "1": "离职",
}
// 员工模态框
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
        teamId: props.teamId,
      },
      loading: false,
      tableConfig: {
        page: 0,
        size: 10
      },

      // teamChange里用到
      depId: props.depId,

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
        const obj = {
          userId: record.id,
          userName: record.userName,
          depId: record.depId,
          teamId: record.teamId,
          postId: record.postId,
        }
        return (
          <div className='operation'>
            <a onClick={() => this.props.modalOk(obj)}>选择</a>
          </div>
        );
      }
    }
  ]

  componentDidMount() {
    this.getList();
    this.departmentChange(this.props.depId)

    this.props.teamId !== "" && this.teamChange(this.props.teamId)

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
      // this.props.form.setFieldsValue({teamId:""});
      // this.props.form.setFieldsValue({postId:""});
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
                initialValue: this.props.teamId
              })(
                <Select onChange={this.teamChange} disabled>
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
        title={'选择员工'}
        footer={null}
        // okText="确定"
        // cacleText="取消"
        onCancel={modalCancel}
        // onOk={this.okHandle}
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

// 班次模态框
@Form.create()
class ShiftModal extends React.Component {
  state={
    shifts: [],
  };

  columns = [
    {
      title: "选择",
      dataIndex: "operator",
      render: (val, record, index) => <Radio onClick={() => this.onRadioClick(record.name)}  key={index} value={record.id} />
    },
    {
      title: "名称",
      dataIndex: "name",
    },
    {
      title: "班时1开始时间",
      dataIndex: "startHour1",
    },
    {
      title: "班时1结束时间",
      dataIndex: "endHour1",
    },
    {
      title: "班时2开始时间",
      dataIndex: "startHour2",
    },
    {
      title: "班时2结束时间",
      dataIndex: "endHour2",
    },
  ]

  componentDidMount() {
    WorkAction.findAllShifts({
      deptId: this.props.depId,
    }).then(result => {
      this.setState({
        shifts: result.body,
      });
    });
  };

  onRadioClick = (shiftName) => {
    this.setState({
      shiftName,
    })
  }

  okHandle = () => {
    const { form, modalOk } = this.props;
    const { shiftName } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      // form.resetFields();
      modalOk({
        ...fieldsValue,
        shiftName,
      });
    });
  };

  render() {
    const { modalVisible, form, modalCancel, selectShiftInfo } = this.props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };

    return (
      <Modal
        width="60%"
        destroyOnClose
        visible={modalVisible}
        // visible={true}
        title={'选择班次'}
        okText="确定"
        cacleText="取消"
        onCancel={modalCancel}
        onOk={this.okHandle}
      >
        <FormItem {...formItemLayout} label="班次">
          {getFieldDecorator("shiftsId", {
            rules: [{ required: true, message: '请选择班次!' }],
            initialValue: selectShiftInfo.shiftsId
          })(
            <RadioGroup>
              <Table
                size="small"
                columns={this.columns}
                rowKey="id"
                dataSource={this.state.shifts}
                pagination={false}
                // loading={this.state.loading}
              />
            </RadioGroup>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="提示">
          如须安排员工补时，请选择上班补时，或者下班之前补时的小时数；如不安排，请忽略此项
        </FormItem>
        <FormItem {...formItemLayout} label="从上班时间开始补时">
          {getFieldDecorator("startInjoureingTime", {
            initialValue: selectShiftInfo.startInjoureingTime
          })(
            <InputNumber min={0} step={0.1} precision={2} style={{width: '100%'}} />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="从下班时间倒退补时">
          {getFieldDecorator("endInjoureingTime", {
            initialValue: selectShiftInfo.endInjoureingTime
          })(
            <InputNumber min={0} step={0.1} precision={2} style={{width: '100%'}} />
          )}
        </FormItem>
      </Modal>
    )
  }
}


// 班次模态框
@Form.create()
class SaveModal extends React.Component {
  state={
    shifts: [],
  };

  columns = [
    {
      title: "选择",
      dataIndex: "operator",
      render: (val, record, index) => <Radio onClick={() => this.onRadioClick(record.name)}  key={index} value={record.id} />
    },
    {
      title: "名称",
      dataIndex: "name",
    },
    {
      title: "班时1开始时间",
      dataIndex: "startHour1",
    },
    {
      title: "班时1结束时间",
      dataIndex: "endHour1",
    },
    {
      title: "班时2开始时间",
      dataIndex: "startHour2",
    },
    {
      title: "班时2结束时间",
      dataIndex: "endHour2",
    },
  ]

  componentDidMount() {
    WorkAction.findAllShifts({
      deptId: this.props.depId,
    }).then(result => {
      this.setState({
        shifts: result.body,
      });
    });
  };

  onRadioClick = (shiftName) => {
    this.setState({
      shiftName,
    })
  }

  okHandle = () => {
    const { form, modalOk } = this.props;
    const { shiftName } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      // form.resetFields();
      modalOk({
        ...fieldsValue,
        shiftName,
      });
    });
  };

  render() {
    const { modalVisible, form, modalCancel, selectSaveInfo } = this.props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };

    return (
      <Modal
        width="60%"
        destroyOnClose
        visible={modalVisible}
        // visible={true}
        title={'保存周模板'}
        okText="确定"
        cacleText="取消"
        onCancel={modalCancel}
        onOk={this.okHandle}
      >

        <FormItem {...formItemLayout} label="模板名">
          {getFieldDecorator("tplname", {
            initialValue: ''
          })(
            <Input style={{width: '100%'}} />
          )}
        </FormItem>
      </Modal>
    )
  }
}

@Form.create()
class TplQueryModal extends React.Component {
  state={
    shifts: [],
  };



  componentDidMount() {
    // let api = 'findAllShifts'
    let api = 'getWorkTemplatePageName'
    WorkAction[api]({
      name: '',
    }).then(result => {
      this.setState({
        shifts: result.body,
      });
    });
  };

  onRadioClick = (shiftName) => {
    this.setState({
      shiftName,
    })
  }

  okHandle = (obj) => {
    const { form, modalOk } = this.props;
    const { shiftName } = this.state;
    // alert(this.props.startDate)
    modalOk(obj, this.props.rowIndex)
    // form.validateFields((err, fieldsValue) => {
    //   if (err) return;
    //
    //   // form.resetFields();
    //   modalOk({
    //     ...fieldsValue,
    //     shiftName,
    //   });
    // });
  };

  tplChange = (index) => {


    this.tplObj = this.props.tplList[index];

    // for (var i = 0; i < this.tplObj.length; i++) {
    //   let obj = this.tplObj[i];
    //
    //   obj.shiftName = decodeURIComponent(decodeURIComponent(obj.shiftName));
    // }

    console.log(this.tplObj)
  }

  render() {


    const { modalVisible, form, modalCancel, selectSaveInfo, tplList, isMonth, getTplList } = this.props;



    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };

    return (
      <Modal
        width="60%"
        destroyOnClose
        visible={modalVisible}
        // visible={true}
        title={(isMonth ? '月': '周') + '模板列表'}
        okText="确定"
        cacleText="取消"
        onCancel={modalCancel}
        onOk={() => this.okHandle(this.tplObj)}
      >

        <FormItem {...formItemLayout} label="模板名">
          {getFieldDecorator("tplname", {
            initialValue: ''
          })(
            <Select onChange={this.tplChange} style={{width: '200px'}}>
              <Option value="">全部</Option>
              {
                tplList.map((item,i) => <Option key={item.id} value={i}>{item.name}</Option>)
              }
            </Select>
          )}
        </FormItem>
      </Modal>
    )
  }
}


let shiftNum = 1;
@Form.create()
class List extends React.Component {

  state = {
    columns: [],
    list: [{id:0, shifts: {}}],
    rowIndex: -1,
    startDate: null,

    userModalVisible: false,
    shiftModalVisible: false,
    saveModalVisible: false,
    tplQueryModalVisible: false,
    selectShiftInfo: {},
    selectSaveInfo: {},
    isMonth: true,

    // 部门
    departments: [],
    tplList: [],
    // 班组
    teams: [],
    // 岗位
    posts: [],

    detail: {},
  };


  componentDidMount() {
    this.getMonthData(null, true);

    this.getDepartment();
    this.getTplList();

    const { id } = this.props.match.params;
    if (id !== undefined) {
      WorkAction.findShiftDetail({
        id,
      }).then(result => {
        if (result.errorCode === 0) {
          let detail = result.body;

          // list=[
          //   {
          //     "id":0,
          //     "userId":3194,
          //     "userName":"弗利萨",
          //     "depId":3136,
          //     "teamId":3148,
          //     "postId":3149,
          //     "shifts":{
          //       "2019-09-01":{
          //         "dateString":"2019-09-01",
          //         "workTimeType":1,
          //         "shiftsId":3929,
          //         "shiftName":"11111"
          //       },
          //     }
          //   }
          // ]
          let listObj = {};
          detail.workTimes.forEach(item => {
            const dateString = moment(item.schedulingDate).format('YYYY-MM-DD')
            if (!listObj[item.userId]) {
              listObj[item.userId] = {};
              listObj[item.userId].userId = item.userId;
              listObj[item.userId].userName = item.userName;
              listObj[item.userId].depId = item.depId;
              listObj[item.userId].teamId = item.teamId;
              listObj[item.userId].postId = item.postId;

              listObj[item.userId].shifts = {};
            }

            listObj[item.userId].shifts[dateString] = {
              dateString,
              workTimeType: item.workTimeType,
              shiftsId: item.shiftsId,
              shiftName: item.shiftName,
              startInjoureingTime: item.startInjoureingTime,
              endInjoureingTime: item.endInjoureingTime,
            }
          })

          const list = Object.keys(listObj).map((key, index) => {
            listObj[key].id = index;
            listObj[key].startDate = index;
            return listObj[key];
          })
          shiftNum = list.length;

          console.log('改造后list',list);
          console.log('改造后',detail);

          this.setState({
            depId: detail.depId,
            detail,
            list,
          }, () => {
            this.getTeam(detail.depId)
            this.getMonthData(detail.reportYearMonth);
          })
        }
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
  // 获取所有部门
  getTplList = () => {
    // let api = this.state.isMonth ? 'findAllMonthTpl' : 'findAllTpl'
    let api = 'getWorkTemplatePageName';

    WorkAction[api]({
      name: ''
    }).then(result => {
      console.log(result);
      this.setState({
        tplList: result,
      });
    });
  }

  // 部门id获取班组
  getTeam = (depId) => {
    DepartmentAction.findTeamByDepId({
      depId,
    }).then(result => {
      console.log(result);
      this.setState({
        teams: result.body,
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
      this.props.form.setFieldsValue({teamId: ""});
      this.getTeam(value)
    })
  }

  teamChange = (value) => {

  }


  onMonthPickerChange = (date, dateString) => {
    this.getMonthData(dateString, false)
    this.setState({
      isMonth: true
    })
  }

  onWeekPickerChange = (date, dateString) => {
    console.log('onWeekPickerChange', date.format(dateFormat), dateString);
    this.getMonthData(date.format('YYYY-MM-DD'), true)
    this.setState({
      isMonth: false
    })
  }

  /**
   * 获取一个月的columns
   * @param date 日期字符串 YYYY-MM
   */
  getMonthData = (date, isWeek=false) => {
    const now = date ? moment(date) : moment();
    const daysInMonth = now.daysInMonth();

    const startDate = now;
    let startNum = 1;

    if (isWeek) {
      now.subtract(now.weekday(), 'day');
      startNum = now.format('DD') - 0;
    }
    let columns = [
      {
        title: "操作",
        dataIndex: "operator",
        render: (val, record, index) =>(
          <FormItem>
            <a onClick={() => this.deleteRow(record.id)} className="btn-delete">删除</a>
            <a onClick={() => this.saveModal(record.id)} className="btn-save" style={{display: 'none'}}>保存</a>
            <a onClick={() => this.queryModal(record.id, startDate)} style={{display: 'none'}}>查询</a>
          </FormItem>
        )
      },
      {
        title: "姓名",
        dataIndex: "userName",
        render: (val, record, index) => (
          <FormItem>
            <Input value={record.userName} onClick={() => this.userModal(index)} style={{width: 80}} />
            {this.props.form.getFieldDecorator(`shifts[${record.id}.userName`, {
              rules: [{required: true, message: '请选择员工!'}],
              initialValue: record.userName,
            })(
              <Input style={{display: 'none'}} />
            )}
          </FormItem>
        )
      },
    ];
    for (let i = startNum; i < (startNum + (isWeek ? 7 : daysInMonth)); i++) {
      const today = now.date(i);

      const week = today.day();
      const dateString = today.format("YYYY-MM-DD");

      columns.push({
        title: `${i}(${WEEK_TEXT[week]})`,
        className: (week === 0 || week === 6) && "rest",
        dataIndex: i,
        render: (val, record, index) => {

          if (i == startNum) {
            record.startDate = dateString;
          }

          return (
          <FormItem>
            {/*{this.props.form.getFieldDecorator(`shifts[${record.id}.shift[${dateString}]]`, {*/}
            {/*// initialValue: ""*/}
            {/*})(*/}
            {/**/}
            {/*)}*/}

            <Input
              value={record.shifts[dateString] && record.shifts[dateString].shiftName}
              onClick={() => this.shiftModal(index,dateString)}
              style={{width: 80}}
            />
          </FormItem>
        )
        }
      })
    }


    this.setState({
      columns,
    })
  }

  addRow = () => {
    const { list } = this.state;
    const newList = list.concat({id: shiftNum, shifts: {}})
    console.log(newList);
    this.setState({
      list: newList
    }, () => {
      shiftNum++
    })
  }

  deleteRow = (id) => {
    const { list } = this.state;
    const newList = list.filter(item => item.id !== id)
    console.log('deleteRow',newList);
    this.setState({
      list: newList,
    })
  }

  saveRow = (id) => {
    const { list } = this.state;
    const newList = list.filter(item => item.id !== id)
    console.log('saveRow',newList);
    this.setState({
      list: newList,
    })
  }

  handleSubmit = e => {
    const {list} = this.state;
    console.log('===list===',list)
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(err) return;
      console.log('values', values);
      values.yearMonth = values.yearMonth && moment(values.yearMonth).format('YYYY-MM')
      delete values.shifts;

      let scheduleParamVoList = [];
      list.forEach(item => {
        const shifts = item.shifts;
        const info = Object.keys(shifts).map(key => {
          // Note: 这里不能 let shiftObj = shifts[key]; delete属性会直接更新state的list
          let shiftObj = {...shifts[key]};
          shiftObj.reportDate  = shiftObj.dateString;
          delete shiftObj.dateString;
          delete shiftObj.shiftName;
          shiftObj.userId  = item.userId;
          return shiftObj;

        })
        scheduleParamVoList = scheduleParamVoList.concat(info)
      })

      console.log('scheduleParamVoList------------',scheduleParamVoList);
      console.log('list json------------',JSON.stringify(list));
      console.log('list------------',list);

      const { id } = this.props.match.params;
      let requet;
      if (id !== undefined) {
        requet =  WorkAction.updateShiftTypeOne(
          {
            ...values,
            id,
          },
          scheduleParamVoList,
        )
      } else {
        requet =  WorkAction.addShiftTypeOne(
          values,
          scheduleParamVoList,
        )
      }
      requet.then(result => {
        if (result.errorCode === 0) {
          Utils.dialog.success("提交成功！")

        }
      })
    });
  };


  // 选择员工
  userModal = rowIndex => {
    const { getFieldValue } = this.props.form;
    const { list } = this.state;

    const depId = getFieldValue('deptId')
    const teamId = getFieldValue('teamId')

    console.log('选择员工前', depId);
    if (depId === undefined || depId === "") {
      Utils.dialog.error("请选择部门！")
      return
    }

    this.setState({
      depId,
      teamId,
      rowIndex,
      userModalVisible: true,
    })

  }

  // 选择员工模态框取消
  userModalCancel = () => {
    this.setState({
      userModalVisible: false,
    })
  }

  // 选择员工模态框确定
  userModalOk = info => {
    const { list, rowIndex } = this.state;
    console.log(info);

    list[rowIndex] = {...list[rowIndex], ...info}
    // 给姓名赋值中文
    this.props.form.setFieldsValue({
      [`shifts[${list[rowIndex].id}.userName`]: info.userName,
    })
    this.setState({
      list,
      userModalVisible: false,
    }, () => {
      console.log('=============',this.state.list);
    })
  };

  // 选择班次
  shiftModal = (rowIndex, dateString) => {
    const { getFieldValue } = this.props.form;

    console.log('选择班次', rowIndex, dateString);

    const depId = getFieldValue('deptId')
    if (depId === undefined || depId === "") {
      Utils.dialog.error("请选择部门！")
      return
    }

    const { list } = this.state;
    // 之前选择的排班信息
    const oldSelectShiftInfo = list[rowIndex].shifts[dateString] || {};

    // 判断是否节假日
    WorkAction.validateLegalHoliday({
      validateDate: dateString,
    }).then(result => {
      if (result.body) {
        Modal.confirm({
          title: "选择班次",
          content: "该日为节假日，是否安排班次？",
          onOk: () => {
            this.setState({
              depId,
              rowIndex,
              selectShiftInfo: {
                ...oldSelectShiftInfo,

                dateString,
                // 上班类型((0-休息, 1-工作日, 2-休息日, 3-节假日))
                workTimeType: 3,
              },
              shiftModalVisible: true,
            })
          },
          onCancel: () => {
            console.log('Cancel');
          },
        })
      } else {
        this.setState({
          depId,
          rowIndex,
          selectShiftInfo: {
            ...oldSelectShiftInfo,

            dateString,
            workTimeType: 1,
          },
          shiftModalVisible: true,
        })
      }
    });

  }

  // 选择班次
  saveModal = (rowIndex) => {
    this.setState({
      saveModalVisible: true,
    });
  }

  queryModal = (rowIndex, startDate) => {
    this.getTplList();
    this.setState({
      tplQueryModalVisible: true,
      rowIndex,
      startDate
    });
  }

  // 选择班次模态框取消
  shiftModalCancel = () => {
    this.setState({
      shiftModalVisible: false,
    })
  }

  saveModalCancel = () => {
    this.setState({
      saveModalVisible: false,
    })
  }
  queryModalCancel = () => {
    this.setState({
      tplQueryModalVisible: false,
    })
  }

  // 选择班次模态框确定
  shiftModalOk = record => {
    const { list, rowIndex, selectShiftInfo, } = this.state;

    list[rowIndex].shifts[selectShiftInfo.dateString] = {...selectShiftInfo,...record};


    // this.props.form.setFieldsValue({
    //   [`shifts[${list[rowIndex].id}.shift[${dateString}`]: record.shiftName,
    // })
    this.setState({
      list,
      shiftModalVisible: false,
    }, () => {
      console.log('=============',this.state.list);
    })
  };

  saveModalOk = record => {
    const { list, rowIndex, selectSaveInfo, isMonth } = this.state;
    const { getFieldValue } = this.props.form;

    let name = record.tplname;

    // list = list || [];
    //let api = isMonth ? 'saveMonthTemplate' : 'saveTemplate'
    let api = 'addWorkPageName';
    WorkAction[api]({
      name: name,
      // data: JSON.stringify(list2),
    }, {}).then(async (id)=> {
      let api = 'addWorkPage';

      for (var i = 0; i < list.length; i++) {
        let shifts = JSON.parse(JSON.stringify(list[i].shifts));
        let list2 = [];

        for(let k in shifts) {
          let index = moment(k).weekday();
          shifts[k].shiftName = encodeURIComponent(shifts[k].shiftName)
          // list2.push(shifts[k]);
          list2[index] = shifts[k]
        }

        await WorkAction[api]({
          monday: JSON.stringify(list2[0]) || ' ',
          tuesday:  JSON.stringify(list2[1]) || ' ',
          wednesday:  JSON.stringify(list2[2]) || ' ',
          thursday:  JSON.stringify(list2[3]) || ' ',
          friday:  JSON.stringify(list2[4]) || ' ',
          saturday:  JSON.stringify(list2[5]) || ' ',
          sunday:  JSON.stringify(list2[6]) || ' ',
          maxId: id,
        }).then(() => {
        })
      }
      this.setState({
        list,
        saveModalVisible: false,
      }, () => {
        console.log('=============',this.state.list);
      })

    })

  };
  queryModalOk = (record, index) => {
    const { list, rowIndex, selectSaveInfo, } = this.state;
    const { getFieldValue } = this.props.form;



    console.log(rowIndex)
    let api = 'getWorkTemplatePage'
    WorkAction[api]({
      id: record.id,
    }).then((res) => {

      // let name = record.tplname;


      // let shifts = list[rowIndex].shifts;
      // let list2 = [];
      //
      // for(let k in shifts) {
      //   list2.push(shifts[k]);
      // }

      // let list2 = [{"id":0,"shifts":{"2020-03-01":{"dateString":"2020-03-01","workTimeType":1,"shiftsId":2,"startInjoureingTime":1,"endInjoureingTime":2,"shiftName":"中班1234"}}}]
      console.log(this.state.startDate)
      console.log(list[0].startDate)

      for (var i = 0; i < res.length && i < list.length; i++) {
        var record = res[i]
        let startDate = moment(list[i].startDate)
        let str
        if (record.monday.trim()) {


          str = startDate.add(0, 'day').format('YYYY-MM-DD')
          list[i].shifts[str] = JSON.parse(record.monday);
          list[i].shifts[str].shiftName = decodeURIComponent(list[i].shifts[str].shiftName)
        }

        if (record.tuesday.trim()) {
          str = startDate.add(1, 'day').format('YYYY-MM-DD')
          list[i].shifts[str] = JSON.parse(record.tuesday);
          list[i].shifts[str].shiftName = decodeURIComponent(list[i].shifts[str].shiftName)
        }

        if (record.wednesday.trim()) {
          str = startDate.add(2, 'day').format('YYYY-MM-DD')
          list[i].shifts[str] = JSON.parse(record.wednesday);
          list[i].shifts[str].shiftName = decodeURIComponent(list[i].shifts[str].shiftName)
        }

        if (record.thursday.trim()) {
          str = startDate.add(3, 'day').format('YYYY-MM-DD')
          list[i].shifts[str] = JSON.parse(record.thursday);
          list[i].shifts[str].shiftName = decodeURIComponent(list[i].shifts[str].shiftName)
        }

        if (record.friday.trim()) {
          str = startDate.add(4, 'day').format('YYYY-MM-DD')
          list[i].shifts[str] = JSON.parse(record.friday);
          list[i].shifts[str].shiftName = decodeURIComponent(list[i].shifts[str].shiftName)
        }

        if (record.saturday.trim()) {
          str = startDate.add(5, 'day').format('YYYY-MM-DD')
          list[i].shifts[str] = JSON.parse(record.saturday);
          list[i].shifts[str].shiftName = decodeURIComponent(list[i].shifts[str].shiftName)
        }

        if (record.sunday.trim()) {
          str = startDate.add(6, 'day').format('YYYY-MM-DD')
          list[i].shifts[str] = JSON.parse(record.sunday);
          list[i].shifts[str].shiftName = decodeURIComponent(list[i].shifts[str].shiftName)
        }


      }

      this.setState({
        list: list,
        tplQueryModalVisible: false,
      })
    })

  };

  renderForm() {
    const {
      form: {getFieldDecorator},
      match,
    } = this.props;
    const id = match.params.id;
    const {departments, teams, posts, detail} = this.state;

    const ColLayout = {
      md: 6,
      sm: 24,
    };

    return (
      <Form
        className="tableListForm"
        onSubmit={this.handleSubmit}
        autoComplete={'off'}
      >
        <Row gutter={24}>
          <Col {...ColLayout}>
            <FormItem label="排班表名称">
              {getFieldDecorator("schedulingName", {
                rules: [{required: true, message: '请填写排班表名称!'}],
                initialValue: detail.schedulingName,
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col {...ColLayout}>
            <FormItem label="部门">
              {getFieldDecorator("deptId", {
                initialValue: detail.depId,
              })(
                <Select disabled={id !== undefined} onChange={this.departmentChange}>
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
                initialValue: detail.teamId,
              })(
                <Select disabled={id !== undefined} onChange={this.teamChange}>
                  <Option value="">全部</Option>
                  {
                    teams.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...ColLayout}>
            <FormItem label="选择年月">
              {getFieldDecorator("yearMonth", {
                initialValue: detail.reportYearMonth ? moment(detail.reportYearMonth) : moment()
              })(
                <MonthPicker disabled={id !== undefined} onChange={this.onMonthPickerChange} style={{width: "100%"}}/>
              )}
            </FormItem>
          </Col>
          <Col {...ColLayout}>
            <FormItem label="选择周">
              {getFieldDecorator("yearWeek", {
                initialValue: detail.reportYearMonth ? moment(detail.reportYearMonth) : moment()
              })(
                <WeekPicker disabled={id !== undefined} onChange={this.onWeekPickerChange} style={{width: "100%"}}/>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={24}>
          <Button onClick={this.addRow} type="primary" style={{marginRight: 24,}}>增加一行</Button>
        </Row>

        <Row gutter={24}>
          <Table
            columns={this.state.columns}
            rowKey="id"
            dataSource={this.state.list}
            pagination={false}
            // loading={this.state.loading}
          />
        </Row>
        <Row gutter={24} style={{marginTop: 12}}>
          <Button type="primary" htmlType="submit" style={{marginRight: 32}} onClick={() => this.saveModal()}>保存排班</Button>
          <Button type="primary"  style={{marginRight: 32}} onClick={() => this.saveModal()}>保存为模板</Button>
          <Button type="primary"  onClick={() => this.queryModal()}>填充</Button>
        </Row>
      </Form>
    );
  }

  render() {
    let {match} = this.props;
    const { userModalVisible, shiftModalVisible, saveModalVisible,tplQueryModalVisible } = this.state;
    const id = match.params.id;

    const userModalParams = {
      modalOk: this.userModalOk,
      modalCancel: this.userModalCancel,
      modalVisible: this.state.userModalVisible,
      depId: this.state.depId,
      teamId: this.state.teamId,
    };
    const shiftModalParams = {
      modalOk: this.shiftModalOk,
      modalCancel: this.shiftModalCancel,
      modalVisible: this.state.shiftModalVisible,
      depId: this.state.depId,
      selectShiftInfo: this.state.selectShiftInfo,
    };
    const saveModalParams = {
      modalOk: this.saveModalOk,
      modalCancel: this.saveModalCancel,
      modalVisible: this.state.saveModalVisible,
      depId: this.state.depId,
      selectSaveInfo: this.state.selectSaveInfo,
    };
    const tplQueryModalParams = {
      modalOk: this.queryModalOk,
      modalCancel: this.queryModalCancel,
      modalVisible: this.state.tplQueryModalVisible,
      tplList: this.state.tplList,
      depId: this.state.depId,
      selectSaveInfo: this.state.selectSaveInfo,
      rowIndex: this.state.rowIndex,
      isMonth: this.state.isMonth,
      getTplList: this.getTplList,
    };

    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <span>{id === undefined ? "新建排班2" : "编辑排班2"}</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a onClick={() => this.props.history.goBack()}><Icon type="rollback"/>返回上级</a>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="content table-nowrap">
          <div>
            {this.renderForm()}

            {
              userModalVisible && <UserModal {...userModalParams} />
            }
            {
              shiftModalVisible && <ShiftModal {...shiftModalParams} />
            }
            {
              saveModalVisible && <SaveModal {...saveModalParams} />
            }
            {
              tplQueryModalVisible && <TplQueryModal {...tplQueryModalParams} />
            }

          </div>
        </div>
      </div>
    );
  }
}

export default List;
