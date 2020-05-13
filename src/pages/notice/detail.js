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
  Modal,
  Divider,
  Popover,
  Badge,
  DatePicker,
  InputNumber,
  Icon,
} from "antd";

const Option = Select.Option;
const FormItem = Form.Item;


import * as DepartmentAction from "../../services/department";
import * as NoticeAction from "../../services/noitce";
import Utils from "../../utils/utils";

import QuillEditor from "../../component/QuillEditor/index";

@Form.create()
class List extends React.Component {
  state = {
    content: '',

    selectedRowKeys: [],

    // 部门
    departments: [],
  };

  componentDidMount() {
    this.getDetail();

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

  getDetail = () => {
    const id = this.props.match.params.id;
    if(id === undefined) return;

    NoticeAction.findNoticeById({
      id,
    }).then(result => {
      if (result.errorCode === 0) {

        this.setState({
          title: result.body.title,
          content: result.body.notice,
          depaIds: result.body.depaIds,
        })
      }
    });
  }

  handleEditorChange = (value) => {
    this.setState({
      content: value
    })
  }

  handleAdd = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {

      if(err) return;
      const id = this.props.match.params.id;
      const {content} = this.state;
      if (!content) {
        Utils.dialog.error("请填写内容！")
        return
      }

      let request;
      if (id !== undefined) {
        request = NoticeAction.updateNotice({
          ...values,
          id,
          notice: content,
        })
      } else {
        request = NoticeAction.addNotic({
          ...values,
          notice: content,
        })
      }
      request.then(result => {
        if (result.errorCode === 0) {
          Utils.dialog.success("提交成功！")
          this.props.history.goBack();
        }
      });

    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {
      departments,

      title,
      content,
      depIds,
    } = this.state;

    const formItemLayout = {
      labelCol: {span: 2},
      wrapperCol: {span: 12},
    };
    const buttonItemLayout = {
      wrapperCol: {span: 12, offset: 2},
    };

    return (
      <Form
        onSubmit={this.handleAdd}
        autoComplete={'off'}
      >
        <FormItem {...formItemLayout} label="部门">
          {getFieldDecorator('depIds', {
            // rules: [{required: true, message: '请选择部门!'}],
            initialValue: depIds || ""
          })(
            <Select>
              <Option value="">全部</Option>
              {
                departments.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
              }
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="标题">
          {getFieldDecorator('title', {
            rules: [{required: true, message: '请填写标题!'}],
            initialValue: title
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="内容">
          <div>
            <QuillEditor
              value={this.state.content}
              onChange={this.handleEditorChange}
            />
          </div>
        </FormItem>

        <FormItem {...buttonItemLayout}>
          <Button type="primary" htmlType="submit">保存</Button>
        </FormItem>

      </Form>
    );
  }

  render() {
    let { match } = this.props;

    const id = match.params.id;
    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <span>{id !== undefined ? "编辑通知" : "添加通知"}</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a onClick={() => this.props.history.goBack()}><Icon type="rollback"/>返回上级</a>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="content" style={{paddingBottom: 360}}>
          <div>
            {this.renderForm()}
          </div>
        </div>
      </div>
    )
  }

}

export default List;
