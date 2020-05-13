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
import * as HolidayAction from "../../services/holiday";
import * as DepartmentAction from "../../services/department";
import Utils from "../../utils/utils";
import {GENDER} from "../../utils/constants";
import moment from "moment"


const STATUS = {
  "0": "在职",
  "1": "离职",
}


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
    // {
    //   title: "id",
    //   dataIndex: "id",
    // },
    {
      title: "部门",
      dataIndex: "deptName",
    },
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
      title: "班组",
      dataIndex: "teamName",
    },
    {
      title: "岗位",
      dataIndex: "postName",
    },
    {
      title: "工号",
      dataIndex: "userCode",
    },
    {
      title: "总工龄(月)",
      dataIndex: "wholeWorkingYears",
    },
    {
      title: "手机号",
      dataIndex: "phone",
    },
    {
      title: '休假统计',
      dataIndex: "statistics",
      render: (id, record, index) => {
        return (
          <div className='operation'>
            <Link to={`/holiday/list/detail/${record.userId}`}>查看详情</Link>
          </div>
        );
      }
    },
    {
      title: "发布时间",
      dataIndex: "createdTime",
      key: "createdTime",
      render: (createdTime) => {
        return Utils.formatDate(createdTime, 'YYYY-MM-DD hh:ii:ss')
      }
    },
    {
      title: "操作",
      dataIndex: "tableOperation",
      render: (id, record, index) => {
        return (
          <div className='operation'>
            <Popconfirm placement="left" title={'确定删除？'} onConfirm={() => this.deleteOne(record.id)}
                        okText="确定" cancelText="取消">
              <a href="javascript:;">删除</a>
            </Popconfirm>
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
      this.props.form.setFieldsValue({teamId: ""});
      this.props.form.setFieldsValue({postId: ""});
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
      this.props.form.setFieldsValue({postId: ""});
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
    if (selectedRowKeys.length < 1) {
      Utils.dialog.error("请至少选择一个！");
      return;
    }
    console.log(selectedRowKeys);
    this.delete(selectedRowKeys.join());
  }

  // 发放年假
  assignHoliday = () => {
    Modal.confirm({
      title: '发放年假',
      content: '确定向全部员工发放年假?(未发放年假前,员工不可申请年假;发放年假后,员工即可申请年假)',
      onOk: () => {
        HolidayAction.assignHoliday().then(result => {
          if (result.errorCode === 0) {
            Utils.dialog.success("发放成功！");
          }
        });
      },
      onCancel: () => {
      },
    })
  };

  // 获取表格数据
  getList = params => {
    const newParams = {
      ...this.state.tableConfig,
      ...this.state.filters,
      ...params,
    };

    this.setState({loading: true});
    HolidayAction.getHolidayList({...newParams}).then(result => {
      console.log(result);
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
              {getFieldDecorator("userCode")(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col {...ColLayout}>
            <FormItem label="部门">
              {getFieldDecorator("depId", {
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
              {getFieldDecorator("date")(
                <RangePicker
                  style={{width:"100%"}}
                  format={'YYYY-MM-DD'}
                />
              )}
            </FormItem>
          </Col>

          <Col {...ColLayout} className="searchBtn">
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Col>
        </Row>
        <Popconfirm placement="left" title={'是否删除选中？'} onConfirm={this.deleteMore}
                    okText="确定" cancelText="取消">
          <Button type="primary" style={{marginRight: 24,}}>删除选中</Button>
        </Popconfirm>
        <Button type="primary" style={{marginRight: 24,}}>导出Excel</Button>
        <Button type="primary" onClick={this.assignHoliday} style={{marginRight: 24,}}>发放年假</Button>
        <Link to={`/holiday/list/legal`}>
          <Button type="primary" style={{marginRight: 24,}}>法定节假日设置</Button>
        </Link>
      </Form>
    );
  }


  render() {
    let {match} = this.props;

    console.log(moment(0).format(dateFormat))
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
            <span>假期管理</span>
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
