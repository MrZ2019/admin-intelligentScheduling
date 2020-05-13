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

import * as HolidayAction from "../../services/holiday";
import Utils from "../../utils/utils";
import {GENDER} from "../../utils/constants";
import moment from "moment"

@Form.create()
class Detail extends React.Component {

  state = {
    detail: {},
  };


  componentDidMount() {
    this.getDetail();
  }

  getDetail = (values) => {
    const {id} = this.props.match.params;
    HolidayAction.findByUser({
      userId: id,
      ...values,
    }).then(result => {
      if (result.errorCode === 0) {
        this.setState({
          detail: result.body,
        })
      }
    });
  }

  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const {date} = values;
      values.startDate = Utils.getStringFromMonent(date, 0, dateFormat);
      values.endDate = Utils.getStringFromMonent(date, 1, dateFormat);

      this.getDetail(values);
    });
  };

  renderForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    const {detail} = this.state;

    const ColLayout = {
      md: 6,
      sm: 24,
    };

    return (
      <Form
        className="tableListForm"
        onSubmit={this.handleSearch}
        autoComplete={'off'}
      >
        <Row gutter={24}>
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

        <Row gutter={24}>
          <Col span={6}>
            <Row>
              <div className="form-item-wrapper">
                <p className="label">{detail.userName}</p>
                <p>{GENDER[detail.gender]}</p>
              </div>
            </Row>
            <Row style={{marginBottom: 24}}>
              <img src={detail.headerImg} style={{width:200, height: 200 }} alt="头像"/>
            </Row>
            <Row>
              <div className="form-item-wrapper">
                <p className="label">{detail.deptName}</p>
                <p>{detail.postName}</p>
              </div>
            </Row>
            <Row>
              <div className="form-item-wrapper">
                <p className="label">工号</p>
                <p>{detail.userCode}</p>
              </div>
            </Row>
            <Row>
              <div className="form-item-wrapper">
                <p className="label">手机</p>
                <p>{detail.phone}</p>
              </div>
            </Row>
            <Row>
              <div className="form-item-wrapper">
                <p className="label">总工龄(月)</p>
                <p>{detail.wholeWorkingYears}</p>
              </div>
            </Row>
          </Col>

          <Col span={12}>
            <Row style={{marginBottom: 24}}>所选时间段内，{detail.userName}的休假统计如下</Row>
            {
              detail.vacationMapList &&
              detail.vacationMapList.map((item, index) => (
                <Row key={index}>
                  <div className="form-item-wrapper">
                    <p className="label">{item.key}</p>
                    <p>
                      {
                        item.value &&
                        Object.keys(item.value).map((key,index) => (
                           <span key={index}>
                             <span style={{marginRight: 24}}>{key}天</span>
                             {
                               item.value[key].map((item,i) => <span style={{marginLeft: 12}} key={i}>{item}</span>)
                             }
                           </span>
                        ))
                      }
                    </p>
                  </div>
                </Row>
                )
              )
            }
          </Col>
        </Row>

      </Form>
    );
  }

  render() {
    let {match} = this.props;

    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <span>休假详情</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a onClick={() => this.props.history.goBack()}><Icon type="rollback"/>返回上级</a>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="content">
          <div>
            {this.renderForm()}
          </div>
        </div>
      </div>
    );
  }
}

export default Detail;
