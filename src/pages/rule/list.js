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

import * as RuleAction from "../../services/rule";
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
  };

  columns = [
    {
      title: "部门",
      dataIndex: "deptName",
    },
    {
      title: "班次",
      dataIndex: "name",
    },
    {
      title: "班次简写",
      dataIndex: "shortName",
    },
    {
      title: '班时1',
      dataIndex: "startHour1",
      render: (val, record, index) => <span>{val && `${val}-${record.endHour1}`}</span>
    },
    {
      title: "班时2",
      dataIndex: "startHour2",
      render: (val, record, index) => <span>{val && `${val}-${record.endHour2}`}</span>
    },
    {
      title: "考勤对象",
      dataIndex: "userVoList",
      render: val => <a onClick={() => this.showAttendanceObj(val)}>查看</a>
    },
    {
      title: "操作",
      dataIndex: "tableOperation",
      render: (val, record, index) => {
        return (
          <div className='operation'>
            <Link to={`/rule/list/edit/${record.id}`}>编辑</Link>
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

  // 查看考勤对象
  showAttendanceObj = list => {
    const text = list && list.map(item => item.userName).join("  ")
    Modal.info({
      centered: true,
      title: '考勤对象',
      content: text,
    });
  }

  componentDidMount() {
    this.getList();
  }

  // 删除
  delete = shiftsIdList => {
    RuleAction.deleteShift({
      shiftsIdList,
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
    RuleAction.findShiftPage({...newParams}).then(result => {
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
        <Popconfirm placement="left" title={'是否删除选中？'} onConfirm={this.deleteMore}
                    okText="确定" cancelText="取消">
          <Button type="primary" style={{marginRight: 24,}}>删除选中</Button>
        </Popconfirm>
        <Link to={`/rule/list/add`}>
          <Button type="primary" style={{marginRight: 24,}}>添加新班次</Button>
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
            <span>出勤规则</span>
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
