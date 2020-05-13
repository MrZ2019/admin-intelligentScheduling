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
} from "antd";

const Option = Select.Option;
const {TextArea} = Input;
const FormItem = Form.Item;
const dateFormat = "YYYY-MM-DD HH:mm:ss";
const {RangePicker} = DatePicker;

import * as DepartmentAction from "../../services/department";
import * as UserAction  from "../../services/user";
import Utils from "../../utils/utils";
import moment from "moment"


const STATUS = {
  "0": "在职",
  "1": "离职",
}
// 负责人模态框
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
        title={'选择负责人'}
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

let teamNum = 1;
// let teamKeys = [
//   {
//     teamKey: 0,
//     postNum: 1,
//     postKeyArr: [0]
//   }
// ];
// 排班。岗位的数据
// teams: [
//   {
//     name: '',
//     posts: []
//   },
// ],

@Form.create()
class Detail extends React.Component {

  state = {
    userName: '',
    userModalVisible: false,

    // 排班。岗位的key管理
    teamKeys: [
      {
        teamKey: 0,
        postNum: 1,
        postKeyArr: [0]
      }
    ],
    teams: [
      {
        name: '',
        posts: []
      },
    ],

    // 编辑部门详情
    detail: {},
  };


  componentDidMount() {
    const { id } = this.props.match.params;
    if (id !== undefined) {
      DepartmentAction.findDepByDepId({
        id,
      }).then(result => {
        if (result.errorCode === 0) {
          const { principal_id, principal, postList, teamMap} = result.body;

          let teamKeys = [];
          let teams = [];
          // 无班组
          if (postList) {
            teamKeys = [
              {
                teamKey: 0,
                postNum: postList.length,
                postKeyArr: postList.map((item, index) => index),
              },
            ];
            teams = [
              {
                name: '',
                posts: postList,
              },
            ]
          }

          // 有班组
          if (teamMap) {
            let teamData = {};
            teamMap.forEach(item => {
              teamData = {...teamData, ...item}
            })

            Object.entries(teamData)
              .forEach(([teamName, postNameArr], index) => {
                // console.log(teamName,postNameArr,index);
                teamKeys.push({
                  teamKey: index,
                  postNum: postNameArr.length,
                  postKeyArr: postNameArr.map((item, index) => index),
                });
                teamNum++
                teams.push({
                  name: teamName,
                  posts: postNameArr,
                });
              })
          }


          this.setState({
            teamKeys,
            teams,
            detail: result.body,
            userId: principal_id,
            userName: principal,
          })
        }
      })
    }
  }

  // 选择负责人
  userModal = () => {
    this.setState({
      userModalVisible: true,
    })
  }

  // 选择负责人模态框取消
  userModalCancel = () => {
    this.setState({
      userModalVisible: false,
    })
  }

  // 选择负责人模态框确定
  userModalOk = record => {
    this.setState({
      userId: record.id,
      userName: record.userName,
      userModalVisible: false,
    })
  };

  // 添加班组
  addTeam = () => {
    const {teamKeys} = this.state;
    const newTeamKeys = teamKeys.concat({
        teamKey: teamNum,
        postNum: 1,
        postKeyArr: [0]
    });
    // console.log('newTeamKeys', newTeamKeys);
    this.setState({
      teamKeys: newTeamKeys,
    }, () => {
      teamNum++
    })
  }

  // 移出班组
  removeTeam = teamKey => {
    const {teamKeys} = this.state;
    const newTeamKeys = teamKeys.filter(item => item.teamKey !== teamKey);
    // console.log('remove newTeamKeys', newTeamKeys);
    this.setState({
      teamKeys: newTeamKeys,
    })
  }

  // 添加岗位
  addPost = (teamKey) => {
    const { teamKeys } = this.state;
    const newTeamKeys = teamKeys.map(item => {
      // teamKeys的 item 结构
      // {
      //   teamKey: 0,
      //   postNum: 0,
      //   postKeyArr: []
      // }
      if (item.teamKey === teamKey) {
        // const postArr = item.postNum;
        item.postKeyArr = item.postKeyArr.concat(item.postNum)
        item.postNum++
        // console.log('postKeyArr',item.postKeyArr,);
      }
      return item;
    });

    // console.log('newTeamKeys', newTeamKeys);
    this.setState({
      teamKeys: newTeamKeys,
    })
  }

  // 移出岗位
  removePost = (teamKey, postKey) => {
    const { teamKeys } = this.state;
    const newTeamKeys = teamKeys.map(item => {
      if(item.teamKey === teamKey){
        item.postKeyArr = item.postKeyArr.filter(k => k !== postKey);
      }
      return item;
    });
    // console.log('remove postKey newTeamKeys', newTeamKeys);
    this.setState({
      teamKeys: newTeamKeys,
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    const { id } = this.props.match.params;
    const { userId } = this.state;
    this.props.form.validateFields((err, values) => {
      if (err) return;
      console.log('form values', values,values.teams);

      const teams = values.teams;
      let request;

      // 不包含班组
      if (teams.some(item => item.name === undefined || item.name === "")) {
        let postListJson = [];
        teams.forEach(item => {
          const posts = item.posts.filter(item => item !== null)
          postListJson = postListJson = postListJson.concat(posts)
        })
        delete values.teams;

        // 判断是新增还是编辑
        if (id === undefined) {
          request = DepartmentAction.addDeptNoTeam({
            ...values,
            userId,
            postListJson: JSON.stringify(postListJson),
          })
        } else {
          request = DepartmentAction.updateDepNoTeam({
            ...values,
            depId: id,
            userId,
            postListJson: JSON.stringify(postListJson),
          })
        }
      } else {

        // 判断有无同名班组
        const teamNameArr = teams.map(item => item.name).filter(item => item !== null);
        const newTeamNameArr = [...new Set(teamNameArr)];
        if (teamNameArr.length !== newTeamNameArr.length) {
          Utils.dialog.error("班组名称不能重复！")
          return
        }

        // 集合 key-班组 value-岗位集合，例如 {"早班":["开发岗","运维岗"], "中班":["采购岗"]}
        let mapListJson = {};

        teams.forEach(item => mapListJson[item.name] = item.posts.filter(item => item !== null))
        delete values.teams;


        // 判断是新增还是编辑
        if (id === undefined) {
          request = DepartmentAction.addDepWithTeam({
            ...values,
            userId,
            mapListJson: JSON.stringify(mapListJson),
          })
        } else {
          request = DepartmentAction.updateDepWithTeam({
            ...values,
            depId: id,
            userId,
            mapListJson: JSON.stringify(mapListJson),
          })
        }
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
    const {teamKeys, teams, userName, detail} = this.state;

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
            <FormItem label="部门名称">
              {getFieldDecorator("name", {
                rules: [{required: true, message: '请填写部门名称!'}],
                initialValue: detail.name
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col {...ColLayout}>
            <FormItem label="年假累计">
              {getFieldDecorator("annualleaveAcc", {
                rules: [{required: true, message: '请选择年假累计!'}],
                initialValue: detail.annualleaveAcc !== undefined ? detail.annualleaveAcc : 1
              })(
                <Select>
                  <Option value={0}>是</Option>
                  <Option value={1}>否</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...ColLayout}>
            <FormItem
              label="负责人"
              help="如暂无负责人，可不选"
            >
              <Input value={userName} onClick={this.userModal} />
            </FormItem>
          </Col>

        </Row>

        {
          teamKeys.map((team, index) => (
            <Row gutter={24} key={team.teamKey}>
              <FormItem label="班组" style={{marginBottom: 0}}>
                <div style={{display: 'flex'}}>
                  <div>
                    <FormItem className="flex-form-item" style={{width: 200,}}>
                      {getFieldDecorator(`teams[${team.teamKey}].name`, {
                        // 一个班组时，班组可不填，超过一个班组，该项为必填项
                        rules: [{required: teamKeys.filter(item => item !== null).length > 1, message: '请填写班组!'}],
                        initialValue: teams[team.teamKey] && teams[team.teamKey].name
                      })(
                        <Input />
                      )}
                      {teamKeys.length > 1 ? (
                        <Icon
                          style={{marginLeft: 8}}
                          type="minus-circle-o"
                          onClick={() => this.removeTeam(team.teamKey)}
                        />
                      ) : null}
                    </FormItem>
                  </div>

                  <FormItem label="岗位" style={{marginLeft: 24}}>
                    <div style={{display: 'flex', flexWrap: "wrap",}}>
                      {
                        team.postKeyArr.map(postKey => (
                          <FormItem key={postKey} className="flex-form-item" style={{marginRight: 24}}>
                            {getFieldDecorator(`teams[${team.teamKey}].posts[${postKey}]`, {
                              rules: [{required: true, message: '请填写岗位!'}],
                              initialValue: teams[team.teamKey] && teams[team.teamKey].posts[postKey]
                            })(
                              <Input/>
                            )}
                            {team.postKeyArr.length > 1 ? (
                              <Icon
                                style={{marginLeft: 8}}
                                type="minus-circle-o"
                                onClick={() => this.removePost(team.teamKey, postKey)}
                              />
                            ) : null}
                          </FormItem>
                        ))
                      }

                    </div>
                    <Button type="dashed" onClick={() => this.addPost(team.teamKey)} style={{width: 160}}>
                      <Icon type="plus"/> 添加岗位
                    </Button>
                  </FormItem>


                </div>
              </FormItem>


            </Row>
          ))
        }

        <Row gutter={24}>
          <FormItem>
            <Button type="dashed" onClick={this.addTeam} >
              <Icon type="plus"/> 添加班组
            </Button>
          </FormItem>
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

    const userModalParams = {
      modalOk: this.userModalOk,
      modalCancel: this.userModalCancel,
      modalVisible: this.state.userModalVisible,
    };

    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <span>{id === undefined ? "添加新部门" : "编辑部门"}</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a onClick={() => this.props.history.goBack()}><Icon type="rollback"/>返回上级</a>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="content">
          <div>
            {this.renderForm()}
            <UserModal {...userModalParams} />
          </div>
        </div>
      </div>
    );
  }
}

export default Detail;
