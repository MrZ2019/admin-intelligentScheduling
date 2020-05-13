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

const STATUS = {
  "0": "在职",
  "1": "离职",
}
// 员工模态框
@Form.create()
class UserModal extends React.Component {

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
        return (
          <div className='operation'>
            <a onClick={() => this.props.modalOk(record)}>选择</a>
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

          <Col {...ColLayout} className="searchBtn">
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

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
          rowKey="id"
          dataSource={this.state.list}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
        />
      </Modal>
    )
  }
}

@Form.create()
class Detail extends React.Component {

  state = {
    detail: {},
    permissionObj: {},
    userModalVisible: false,

    // 权限
    authorityIndeterminate: false,
    authorityCheckAll: false,
    authorityOptions: [],
    authorityCheckedList: [],

  };


  componentDidMount() {
    const {type, id} = this.props.match.params;
    switch (type) {
      case 'backend':
        this.getBackendAuthority();
        break;
      case 'check':
        this.getApprovalAuthority();
        break;
      default:
    }

    if (id !== undefined) {
      this.getUserDetail(id)
    }
  }

  // 获取员工详情
  getUserDetail = id => {
    UserAction.getUserById(id).then( result => {
      if (result.errorCode === 0) {
        let detail = result.body;

        let permissionObj = {};
        detail.permissionList.forEach(item => permissionObj = {...permissionObj, ...item})

        const {type} = this.props.match.params;
        let authorityCheckedList;
        switch (type) {
          case 'backend':
            authorityCheckedList = permissionObj.OPERATION.map(item => item.id)
            break;
          case 'check':
            authorityCheckedList = permissionObj.APPROVAL.map(item => item.id)
            break;
          default:
        }

        this.setState({
          detail,
          permissionObj,
          authorityCheckedList,
          authorityCheckAll: authorityCheckedList.length === this.state.authorityOptions.length,
        })

        console.log('改造后',detail);
      }
    })
  }

  // 选择员工
  userModal = () => {
    this.setState({
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
  userModalOk = record => {
    this.setState({
      userId: record.id,
      userModalVisible: false,
    }, () => {
      this.getUserDetail(record.id)
    })
  };

  // 查询后台操作权限
  getBackendAuthority = () => {
    AuthorityAction.getBackendAuthority().then(result => {
      const authorityOptions = result.body.map(item => ({
        label: item.name,
        value: item.id,
      }))
      this.setState({
        authorityOptions,
      });
    });
  }

  getApprovalAuthority = () => {
    AuthorityAction.getApprovalAuthority().then(result => {
      const authorityOptions = result.body.map(item => ({
        label: item.name,
        value: item.id,
      }))
      this.setState({
        authorityOptions,
      });
    });
  }


  // 权限全选
  onAuthorityCheckAllChange = e => {
    const {authorityOptions} = this.state;
    this.setState({
      authorityCheckedList: e.target.checked ? authorityOptions.map(item => item.value) : [],
      authorityIndeterminate: false,
      authorityCheckAll: e.target.checked,
    });
  }

  onAuthorityChange = checkedList  => {
    const {authorityOptions} = this.state;
    this.setState({
      authorityCheckedList: checkedList,
      authorityIndeterminate: !!checkedList.length && checkedList.length < authorityOptions.length,
      authorityCheckAll: checkedList.length === authorityOptions.length,
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {

      const { authorityCheckedList, permissionObj, userId } = this.state;
      const {type, id} = this.props.match.params;

      // 将权限permissionObj结构{key:value}的value由 [{},{}] 转换成 [id,id,id]
      let permissionObjArr = {};
      Object.keys(permissionObj)
        .forEach(key => permissionObjArr[key] = permissionObj[key].map(item => item.id))
      switch (type) {
        case 'backend':
          permissionObjArr.OPERATION = authorityCheckedList;
          break;
        case 'check':
          permissionObjArr.APPROVAL = authorityCheckedList;
          break;
        default:
      }
      console.log('permissionObjArr', permissionObjArr);
      let permissionIdList = [];
      Object.keys(permissionObjArr)
        .forEach(key => permissionIdList = permissionIdList.concat(permissionObjArr[key]))
      permissionIdList = permissionIdList.join();

      let params = {};
      if (id !== undefined) {
        params = {
          userId: id,
          permissionIdList,
        }
      } else {
        params = {
          userId: userId,
          permissionIdList,
        }
      }
      console.log(params);
      AuthorityAction.addOrUpdatePermission({
        ...params,
      }).then(result => {
        if (result.errorCode === 0) {
          Utils.dialog.success("提交成功！");
          this.props.history.goBack();
        }
      });

    });
  };

  renderForm(authorityName) {
    const {
      form: {getFieldDecorator},
    } = this.props;
    const {
      detail,
      authorityIndeterminate, authorityCheckAll, authorityOptions, authorityCheckedList,
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
        <Row gutter={24} style={{borderBottom: '1px #efefef solid'}}>
          <Col {...ColLayout}>
            <FormItem label="所属部门">
              <div>{detail.department && detail.department.name}</div>
            </FormItem>
          </Col>
          <Col {...ColLayout}>
            <FormItem label="所属班组">
              <div>{detail.team && detail.team.name}</div>
            </FormItem>
          </Col>
          <Col {...ColLayout}>
            <FormItem label="所属岗位">
              <div>{detail.post && detail.post.name}</div>
            </FormItem>
          </Col>
          <Col {...ColLayout}>
            <FormItem label="姓名">
              <div>{detail.userName}</div>
            </FormItem>
          </Col>
          <Col {...ColLayout}>
            <FormItem label="工号">
              <div>{detail.code}</div>
            </FormItem>
          </Col>
          <Col {...ColLayout}>
            <FormItem label="级别">
              <div>{detail.levelName}</div>
            </FormItem>
          </Col>

        </Row>

        <Row gutter={24} style={{margin: "0 48px 48px"}}>
          <Col span={12}>
            <div style={{borderBottom: '1px solid #E9E9E9'}}>
              <span style={{color: 'red', marginRight: 10}}>{authorityName}</span>
              <Checkbox
                style={{margintRight: 10}}
                indeterminate={authorityIndeterminate}
                onChange={this.onAuthorityCheckAllChange}
                checked={authorityCheckAll}
              >
                所有权限
              </Checkbox>
            </div>
            <br/>
            <CheckboxGroup
              style={{width:'100%'}}
              // options={authorityOptions}
              value={authorityCheckedList}
              onChange={this.onAuthorityChange}
            >
              <Row>
                {
                  authorityOptions.map((item,index) => (
                    <Col key={index} span={8}>
                      <Checkbox value={item.value}>{item.label}</Checkbox>
                    </Col>
                  ))
                }
              </Row>
            </CheckboxGroup>
          </Col>
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
    const {type, id} = this.props.match.params;
    let breadcrumbName;
    let authorityName;
    switch (type) {
      case 'backend':
        breadcrumbName = '后台权限人';
        authorityName = '后台权限';
        break;
      case 'check':
        breadcrumbName = '审批权限';
        authorityName = '审批权限';
        break;
      default:
    }

    const userModalParams = {
      modalOk: this.userModalOk,
      modalCancel: this.userModalCancel,
      modalVisible: this.state.userModalVisible,
    };


    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <span>{id === undefined ? `添加新${breadcrumbName}` : `编辑${breadcrumbName}`}</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a onClick={() => this.props.history.goBack()}><Icon type="rollback"/>返回上级</a>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="content">
          <div>
            {
              id === undefined && <Button onClick={this.userModal} type="primary">选择员工</Button>
            }
            {this.renderForm(authorityName)}
            <UserModal {...userModalParams} />
          </div>
        </div>
      </div>
    );
  }
}

export default Detail;
