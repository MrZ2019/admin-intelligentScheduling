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

import * as workAction from "../../services/work";
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
  };

  columns = [
    {
      title: "排班表名称",
      dataIndex: "schedulingName",
    },
    {
      title: "建立时间",
      dataIndex: "createdTime",
    },
    {
      title: "建立者",
      dataIndex: "userName",
    },
    {
      title: "建立者部门",
      dataIndex: "deptName",
    },
    {
      title: "建立者班组",
      dataIndex: "teamName",
    },
    {
      title: "建立者岗位",
      dataIndex: "postName",
    },
    {
      title: "操作",
      dataIndex: "tableOperation",
      render: (val, record, index) => {

        // scheduleType 排班类型(0: 类型1, 1: 类型2按岗位)
        let url;
       switch (record.scheduleType) {
         case 0 :
           url = `/work/list/type1/edit/${record.id}`;
           break;
         case 1 :
           url = `/work/list/type2/edit/${record.id}`;
           break;
         default:
       }

        return (
          <div className='operation'>
            {/*<a href="javascript:;">新建副本</a>*/}
            {/*<Divider type="vertical"/>*/}
            {
              url && (
                <React.Fragment>
                  <Link to={url}>编辑</Link>
                  <Divider type="vertical"/>
                </React.Fragment>
              )
            }
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
  }

  // 删除
  delete = ids => {
    workAction.deleteShiftMore({
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
    workAction.findShiftsPage({...newParams}).then(result => {
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
            <FormItem label="排班表名称">
              {getFieldDecorator("schedulingName")(
                <Input/>
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
        <Link to={`/work/list/choose`}>
          <Button type="primary" style={{marginRight: 24,}}>新建排班</Button>
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
            <span>排班管理</span>
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
