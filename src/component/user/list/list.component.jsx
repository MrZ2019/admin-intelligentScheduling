import { Link } from "react-router-dom";
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
  Divider,
  DatePicker
} from "antd";
const Option = Select.Option;
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
import * as Actions from "../actions";
import Utils from "../../../common/utils/utils";
import AppService from '../../../common/utils/app.service'
import queryString from 'query-string';

class List extends React.Component {
  state = {
    list: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true
    },
    loading: false,
    config: {
      page: 0,
      size: 10
    },
    startTime: '',
    endTime: '',
    jobType: [],
    downloadUrl: ''
  };

  constructor(props) {
    super(props);
  }

  /**
   * 初始化
   */
  componentDidMount() {
    // this.getJobType()
    this.getList();
    // this.getUserList()
  }

  /**
   * 获取表格列表数据
   */

  getList = params => {
    params = {
      ...this.state.config,
      ...this.state.fileters,
      ...params
    };
    this.setState({ loading: true });
    Actions.getUserList({ ...params }).then(result => {
      if (result.errorCode == 0) {
        const pagination = { ...this.state.pagination };
        pagination.current = params.page + 1;
        pagination.total = result.body.totalCount;
        pagination.showTotal = total => {
          return `总共 ${total} 条`;
        };
        this.setState({
          loading: false,
          pagination,
          list: result.body.rows
        });
      } else {
        Utils.dialog.error(result.msg)
      }
    });
  };
  getUserList = params => {
    this.setState({ loading: true });
    Actions.getUserList({ ...params, page: 0, size: 10000, status: true }).then(result => {
      if (result.errorCode == 0) {
        this.setState({
          industryList: result.body.rows
        });
      } else {
        Utils.dialog.error(result.msg)
      }
      this.setState({ loading: false });
    });
  };

  /**
   * 点击顶部搜索查询按钮
   */
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(values)
      // if (values.payTime != undefined) {
      //   values.regStart = new Date(this.state.startTime).getTime()
      //   values.regEnd = new Date(this.state.endTime).getTime()
      // } else {
      //   values.regStart = this.state.startTime
      //   values.regEnd = this.state.endTime
      // }
      // delete values.payTime
      this.setState({
        fileters: values
      });
      this.getList({ ...values });
    });
  };
  //日期变化
  handleTimeChange = (dates, dateStrings) => {
    this.setState({
      startTime: dateStrings[0],
      endTime: dateStrings[1]
    })
  }
  /**
   * 点击分页事件
   */
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager
    });
    this.getList({
      page: pagination.current - 1,
      size: this.state.config.size ? this.state.config.size : 10,
      ...this.state.fileters
    });
  };
  // 禁用启用
  disableBtnAction = (record, index, option) => {
    if (option == 'up') {
      Actions.enable({
        id: record.id,
      }).then(result => {
        if (result.errorCode == 0) {
          Utils.dialog.success('启用成功')
          let list = this.state.list
          list[index].status = 'ENABLED'
          this.setState({ list })
        } else {
          Utils.dialog.error(result.msg)
        }
      })
    } else if (option == 'down') {
      Actions.disable({
        id: record.id,
      }).then(result => {
        if (result.errorCode == 0) {
          Utils.dialog.success('禁用成功')
          let list = this.state.list
          list[index].status = 'DISABLED'
          this.setState({ list })
        } else {
          Utils.dialog.error(result.msg)
        }
      })
    }
  }
  //导出
  handleDownload = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (values.payTime != undefined) {
        values.regStart = new Date(this.state.startTime).getTime()
        values.regEnd = new Date(this.state.endTime).getTime()
      } else {
        values.regStart = this.state.startTime
        values.regEnd = this.state.endTime
      }
      delete values.payTime
      let downloadUrl = AppService.exportFileUrl + '?' + queryString.stringify(values)
      this.setState({
        downloadUrl
      }, () => {
        document.getElementById('toDownload').click()
      });

    });
  }

    // 删除
    onDelete = (id, index) => {
      // Actions.deleteDynam({ id: id }).then(result => {
      //   if (result.errorCode == 0) {
      //     Utils.dialog.success('删除成功');
      //     this.getList()
      //   } else {
      //     Utils.dialog.error(result.msg)
      //   }
      // })
    };

  render() {
    let { match } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    };
    const colLayout = {
      xs: { span: 24 },
      sm: { span: 8 },
    };
    const columns = [
      // {
      //   title: "id",
      //   dataIndex: "id",
      //   key: "id"
      // },
      {
        title: "姓名",
        dataIndex: "userName",
        key: "userName"
      },
      // {
      //   title: "手机号",
      //   dataIndex: "loginPhone",
      //   key: "loginPhone",
      // },
      {
        title: "性别",
        dataIndex: "gender",
        key: "gender",
        render: (gender, record, index) => {
          return (
            <span>{gender == '0' ? '男' :  '女'}</span>
          );
        }
      },
      {
        title: "年龄",
        dataIndex: "age",
        key: "age",
        // render: (birthday) => {
        //   return Utils.formatDate(birthday, 'YYYY-MM-DD')
        // }
      },
      {
        title: "外单位工龄",
        dataIndex: "outWorkYears",
        key: "outWorkYears",
        // render: (staffUserStatistics, record, index) => {
        //   return <span>{record.staffUserStatistics.workTimeLong}</span>
        // }
      },
      {
        title: "部门",
        dataIndex: "deptName",
        key: "deptName",
        // render: (rate, record, index) => {
        //   return <span>{record.staffUserStatistics.rate}</span>
        // }
      },
      {
        title: "班组",
        dataIndex: "teamName",
        key: "teamName"
      },
      {
        title: "岗位",
        dataIndex: "postName",
        key: "postName"
      },
      {
        title: "工号",
        dataIndex: "code",
        key: "code"
      },
       {
        title: "持证",
        dataIndex: "is_certificate",
        key: "is_certificate",
        render: (is_certificate, record, index) => {
          return (
            <span>{is_certificate == '0' ? '否' : '是'}</span>
          );
        }
      },
      {
        title: "级别",
        dataIndex: "level",
        key: "level"
      },
      {
        title: "手机号",
        dataIndex: "phone",
        key: "phone",
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        render: (status, record, index) => {
          return (
            <span>{status == '0' ? '在职中' : '已离职'}</span>
          );
        }
      },
      {
        title: "选择",
        // dataIndex: "",
        // key: "",
      },
      {
        title: "操作",
        dataIndex: "id",
        key: "id ",
        render: (id, record, index) => {
          let url = `${match.url}/detail5/${id}`;
          return (
            <div className='operation'>
              <Link to={url}>
                <a href="javascript:;">编辑</a>
              </Link>
              <Divider type="vertical" />
              <Popconfirm placement="left" title={'确定删除该员工？'} onConfirm={() => this.onDelete(id, index)}
                okText="确定" cancelText="取消">
                <a href="javascript:;">删除</a>
              </Popconfirm>
            </div>
          );
        }
      }
    ];

    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <span>全部员工管理</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="content">
          <div>
            <Form
              className="ant-advanced-search-form tableListForm"
              onSubmit={this.handleSearch}
            >
              <Row gutter={24}>

                 <Col md={6} sm={24} {...colLayout}>
                  <FormItem label="姓名">
                     {getFieldDecorator("userName", {
                      initialValue: ""
                    })(<Input placeholder="输入姓名" />)}
                  </FormItem>
                </Col>
                <Col md={6} sm={24} {...colLayout}>
                  <FormItem label="工号">
                    {getFieldDecorator("code", {
                      initialValue: ""
                    })(<Input placeholder="输入员工工号" />)}
                  </FormItem>
                </Col>
                <Col md={6} sm={24} {...colLayout}>
                  <FormItem label="性别">
                    {getFieldDecorator("gender", {
                      initialValue: ""
                    })(
                      <Select>
                        <Option value="">不限</Option>
                        <Option value="0">
                          男
                        </Option>
                        <Option value="1">
                          女
                        </Option>
                        {/* <Option value="UNKNOWN">
                          未知
                        </Option> */}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col  md={6} sm={24} {...colLayout}>
                   <FormItem label="状态">
                    {getFieldDecorator("status", {
                      initialValue: ""
                    })(
                      <Select>
                        <Option value="">不限</Option>
                        <Option value="0">
                          在职中
                        </Option>
                        <Option value="1">
                          已离职
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
           <Row gutter={24}>
             <Col md={6} sm={24} {...colLayout}>
               <FormItem label="部门">
                 {getFieldDecorator("deptName", {
                      initialValue: ""
                    })(
                      <Select>
                        <Option value="">全部</Option>
                        {
                          this.state.jobType.map(record => {
                            return (
                              <Option value={record.id}>
                                {record.name}
                              </Option>
                            )
                          })
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={24} {...colLayout}>
                  <FormItem label="班组">
                    {getFieldDecorator("teamName", {
                      initialValue: ""
                    })(
                      <Select>
                        <Option value="">全部</Option>
                        <Option value="ENABLED">
                          启用
                        </Option>
                        <Option value="DISABLED">
                          禁用
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={24} {...colLayout}>
                  <FormItem label="岗位">
                    {getFieldDecorator("postName", {
                      initialValue: ""
                    })(
                      <Select>
                        <Option value="">全部</Option>
                        <Option value="ENABLED">
                          启用
                        </Option>
                        <Option value="DISABLED">
                          禁用
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={24} className="searchBtn" style={{textAlign:'right'}}>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                </Col>
                
              </Row>
             
              <Button type="primary" className="searchBtn" >
                <Link to="/user/list/index/detail5">
                  添加新员工
                </Link>
              </Button>
            </Form>
            <Table
              columns={columns}
              rowKey="id"
              dataSource={this.state.list}
              // pagination={this.state.pagination}
              loading={this.state.loading}
              // onChange={this.handleTableChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

const UserList = Form.create()(List);
export default UserList;
