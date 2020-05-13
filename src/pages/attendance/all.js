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

import * as UserAction from "../../services/user";
import * as AttendanceAction from "../../services/attendance";
import * as DepartmentAction from "../../services/department";
import Utils from "../../utils/utils";
import AppService from "../../utils/app.service";
import {GENDER} from "../../utils/constants";
import moment from "moment"


/**
 * 考勤汇总列表调用 员工列表接口即可
 */
@Form.create()
class List extends React.Component {

  state = {

    list: [],
    pagination: {
      showQuickJumper: true,
    },
    filters: {},
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
      title: "操作",
      dataIndex: "tableOperation",
      render: (val, record, index) => {
        return (
          <div className='operation'>
            <Link to={`/attendance/list/detail/${record.id}`}>查看详情</Link>
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

  // 导出excel
  exportExcel = () => {
    this.props.form.validateFields((err, values) => {

      const {date} = values;
      values.startDate = Utils.getStringFromMonent(date, 0, dateFormat);
      values.endDate = Utils.getStringFromMonent(date, 1, dateFormat);

      // 这是后台要传的，后台不作处理
      values.pageNum = 0;
      values.pageSize = 10;

      const search = Object.keys(values)
        .filter(key => values[key] !== undefined && values[key] !== "" && key !== "date")
        .map(key => `${key}=${values[key]}`).join("&");

      var oa = document.createElement('a');
      oa.href = `${AppService.exportAllAttendance}?${search}`
      // oa.download = 'htmltable-blob.xls';
      oa.setAttribute('target', '_blank');
      document.body.appendChild(oa);
      oa.click();
    });

  }

  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const {date} = values;
      values.startDate = Utils.getStringFromMonent(date, 0, dateFormat);
      values.endDate = Utils.getStringFromMonent(date, 1, dateFormat);

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
            <FormItem label="日期">
              {getFieldDecorator('date')(
                <RangePicker format="YYYY-MM-DD" style={{width: '100%'}}/>
              )}
            </FormItem>
          </Col>


          <Col {...ColLayout} className="searchBtn">
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Col>
        </Row>
        <Button onClick={this.exportExcel} type="primary" style={{marginRight: 24,}}>导出Excel</Button>
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
            <span>考勤汇总</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="content">
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
