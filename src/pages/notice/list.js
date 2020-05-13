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
const {TextArea} = Input;
const FormItem = Form.Item;
const dateFormat = "YYYY-MM-DD HH:mm:ss";
const {RangePicker} = DatePicker;

import * as DepartmentAction from "../../services/department";
import * as NoticeAction from "../../services/noitce";
import Utils from "../../utils/utils";
import moment from "moment"



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
  };

  columns = [
    {
      title: "标题",
      dataIndex: "title",
    },
    {
      title: "发送日期",
      dataIndex: "createdTime",
    },
    {
      title: "发送部门",
      dataIndex: "depaIds",
    },
    {
      title: "发送人班组",
      dataIndex: "teamName",
    },
    {
      title: '发送人姓名',
      dataIndex: "createdByUser.userName",
    },
    {
      title: "发送人岗位",
      dataIndex: "postName",
    },
    {
      title: "操作",
      dataIndex: "tableOperation",
      render: (id, record, index) => {
        return (
          <div className='operation'>
            <Link to={`/notice/list/detail/${record.id}`}>编辑</Link>
            <Divider type="vertical"/>
            <Popconfirm placement="left" title={'确定删除？'} onConfirm={() => this.deleteOne(record.id)}
                        okText="确定" cancelText="取消">
              <a href="javascript:;">删除</a>
            </Popconfirm>
          </div>
        );
      }
    }
  ];


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

  // 删除
  delete = ids => {
    NoticeAction.deleteNoticeMore({
      ids,
    }).then(result => {
      if (result.errorCode === 0) {
        Utils.dialog.success("删除成功！");
        this.setState({
          selectedRowKeys: [],
        })
        this.getList()
      }
    });
  }

  deleteOne = id => {
    let list = [];
    list.push(id);
    this.delete(list.join("#"));
  }

  // 批量删除
  deleteMore = () => {
    const {selectedRowKeys} = this.state;
    if(selectedRowKeys.length < 1){
      Utils.dialog.error("请至少选择一个！");
      return;
    }
    console.log(selectedRowKeys);
    this.delete(selectedRowKeys.join("#"));
  }


  // 获取表格数据
  getList = params => {
    const newParams = {
      ...this.state.tableConfig,
      ...this.state.filters,
      ...params,
    };

    this.setState({loading: true});
    NoticeAction.findNoticePage({...newParams}).then(result => {
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
    const {departments} = this.state;

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
            <FormItem label="部门">
              {getFieldDecorator("depIds", {
                initialValue: ""
              })(
                <Select>
                  <Option value="">全部</Option>
                  {
                    departments.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
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
        <Popconfirm placement="left" title={'是否删除选中？'} onConfirm={this.deleteMore}
                    okText="确定" cancelText="取消">
          <Button type="primary" style={{marginRight: 24,}}>删除选中</Button>
        </Popconfirm>
        <Link to={`/notice/list/add`}>
          <Button type="primary" style={{marginRight: 24,}}>添加新通知</Button>
        </Link>
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
            <span>通知列表</span>
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
