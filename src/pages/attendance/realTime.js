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
} from "antd";

const Option = Select.Option;
const FormItem = Form.Item;
const dateFormat = "YYYY-MM-DD HH:mm:ss";
const {RangePicker} = DatePicker;

import * as AttendanceAction from "../../services/attendance";
import * as DepartmentAction from "../../services/department";
import Utils from "../../utils/utils";
import {GENDER} from "../../utils/constants";
import moment from "moment"



const STATUS = {
  "COMPENSATE_APPEAL": "补卡",
  "LEAVE_APPEAL": "请假",
  "OVERTIME": "加班",
  "FIELD_WORK": "外勤",
  "MAKEUP_APPEAL": "补休或补时",
  "SHIFT_APPEAL": "调班申请",
  "NORMAL": "正常",
  "EARLY_LEAVE": "早退",
  "BE_LATE": "迟到",
  "REST": "休息",
  "ABSENCE": "缺勤",
  "MISSED_CARD": "缺卡",
  "MAKEUP_HOUR_APPEAL": "补时",
  "MAKEUP_DAY_APPEAL": "补休",
  "EXCEPTION_SITUATION": "异常待更新",
}

// 日期类型
const WORK_TIME_TYPE = {
  "0": "休息",
  "1": "工作日",
  "2": "休息日",
  "3": "节假日",
}

// ANNUAL_LEAVE(1,"年假"),
//   SICK_LEAVE(2,"病假"),
//   THING_LEAVE(3,"事假"),
//   MARRIAGE_LEAVE(4,"婚假"),
//   FUNERAL_LEAVE(5,"丧假"),
//   MATERNITY_LEAVE(6,"产假"),
//   CARE_LEAVE(7,"看护假"),
//   WORK_INJURY_LEAVE(8,"工伤假"),
//   PLANARY_LEAVE(9,"计生假"),
//   ONLY_CHILD_CARE_LEAVE(10,"独生子女护理假"),
//   OTHER_LEAVE(11,"其他假期"),
//   STATUTORY_HOLIDAY(12,"法定节假日"),
//   OFF_DAY(13,"休息日");

// 假期类型
const VACATION_TYPE = {
  "1": "年假",
  "2": "病假",
  "3": "事假",
  "4": "婚假",
  "5": "丧假",
  "6": "产假",
  "7": "看护假",
  "8": "工伤假",
  "9": "计生假",
  "10": "独生子女护理假",
  "11": "其他假期",
  "12": "法定节假日",
  "13": "休息日",
}

@Form.create()
class List extends React.Component {

  constructor(props) {
    super(props);

    const defaultDate =  moment()
    this.state = {
      // 默认当前日期
      defaultDate,

      list: [],
      pagination: {
        showQuickJumper: true,
      },
      filters: {
        startDate: defaultDate.format(dateFormat),
        endDate: defaultDate.format(dateFormat),
      },
      loading: false,
      tableConfig: {
        page: 0,
        size: 10
      },

      selectedRowKeys: [],

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
      render: (val, record, index) => <span>{GENDER[val]}</span>
    },
    {
      title: "部门",
      dataIndex: "deptName",
    },
    {
      title: "班组",
      dataIndex: "teamName",
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
      title: "手机号",
      dataIndex: "phone",
    },
    {
      title: "班次",
      dataIndex: "shiftsName",
    },
    {
      title: "班次时间",
      dataIndex: "shiftsDateList",
      render: val => <span>{val.join(" ")}</span>
    },
    {
      title: "上班卡",
      dataIndex: "onWorkPunchTime",
    },
    {
      title: "下班卡",
      dataIndex: "offWorkPunchTime",
    },
    {
      title: "状态",
      dataIndex: "status",
      render: val => <span>{STATUS[val]}</span>
    },
    {
      title: "日期类型",
      dataIndex: "workTimeType",
      render: val => <span>{WORK_TIME_TYPE[val]}</span>
    },
    {
      title: "加班时长(小时)",
      dataIndex: "overtimeHour",
    },
    {
      title: "当天积休(小时)",
      dataIndex: "accumulateRestHour",
    },
    {
      title: "当天积时(小时)",
      dataIndex: "accumulateHour",
    },
    {
      title: "当天法定节假日加班时长(小时)",
      dataIndex: "legalHolidayOvertimeHourInterval",
    },
    {
      title: "累计积休(小时)",
      dataIndex: "accumulateDayByYear",
    },
    {
      title: "累计积时(小时)",
      dataIndex: "accumulateHourByYear",
    },
    {
      title: "累计法定节假日加班时长(小时)",
      dataIndex: "accumulateLegalHolidayOvertime",
    },
    {
      title: "补时开始时间",
      dataIndex: "makeupHourStartTime",
    },
    {
      title: "补时结束时间",
      dataIndex: "makeupHourEndTime",
    },
    {
      title: "补时时长(小时)",
      dataIndex: "makeupHourInterval",
    },
    {
      title: "补休开始时间",
      dataIndex: "makeupDayStartTime",
    },
    {
      title: "补休结束时间",
      dataIndex: "makeupDayEndTime",
    },
    {
      title: "补休时长(小时)",
      dataIndex: "makeupDayInterval",
    },
    {
      title: "假期类型",
      dataIndex: "vacationType",
      render: val => <span>{VACATION_TYPE[val]}</span>
    },
    {
      title: "假期开始时间",
      dataIndex: "vacationStartTime",
    },
    {
      title: "假期结束时间",
      dataIndex: "vacationEndTime",
    },
    {
      title: "假期时长(小时)",
      dataIndex: "vacationInterval",
    },
    {
      title: "备注",
      dataIndex: "remark",
    },
    {
      title: "操作",
      dataIndex: "tableOperation",
      render: (val, record, index) => {
        return (
          <div className='operation'>
            <Link to={`/attendance/list/detail/${record.userId}`}>查看详情</Link>
          </div>
        );
      }
    }
  ]


  componentDidMount() {
    this.getList();

    this.getDepartment();
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
      console.log(result);
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
      console.log(result);
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

  // 删除
  delete = list => {
    // DepartmentAction.deleteDep({
    //   list,
    // }).then(result => {
    //   if (result.errorCode === 0) {
    //     Utils.dialog.success("删除成功！");
    //     this.setState({
    //       selectedRowKeys: [],
    //     })
    //     this.getList()
    //   }
    // });
  }

  deleteOne = id => {
    let list = [];
    list.push(id);
    this.delete(list.join());
  }

  // 批量删除
  deleteMore = () => {
    const {selectedRowKeys} = this.state;
    if(selectedRowKeys.length < 1){
      Utils.dialog.error("请至少选择一个！");
      return;
    }
    console.log(selectedRowKeys);
    this.delete(selectedRowKeys.join());
  }

  // 获取表格数据
  getList = params => {
    const newParams = {
      ...this.state.tableConfig,
      ...this.state.filters,
      ...params,
    };

    this.setState({loading: true});
    AttendanceAction.findListPage({...newParams}).then(result => {
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
      const {date} = values;
      values.startDate = date && moment(date).format(dateFormat);
      values.endDate = date && moment(date).format(dateFormat);

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
            <FormItem label="部门">
              {getFieldDecorator("deptId", {
                initialValue: ""
              })(
                <Select onChange={this.departmentChange}>
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
          <Col {...ColLayout}>
            <FormItem label="状态">
              {getFieldDecorator("status", {
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
            <FormItem label="日期">
              {getFieldDecorator('date', {
                initialValue: this.state.defaultDate
              })(
                <DatePicker format="YYYY-MM-DD" style={{width: '100%'}}/>
              )}
            </FormItem>
          </Col>


          <Col {...ColLayout} className="searchBtn">
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Col>
        </Row>
        <Button type="primary" style={{marginRight: 24,}}>批量临时加班</Button>
      </Form>
    );
  }

  render() {
    let {match} = this.props;

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
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <span>实时考勤查看</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="content table-nowrap">
          <div>
            {this.renderForm()}
            <Table
              rowSelection={rowSelection}
              columns={this.columns}
              rowKey="id"
              dataSource={this.state.list}
              pagination={this.state.pagination}
              loading={this.state.loading}
              onChange={this.handleTableChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default List;
