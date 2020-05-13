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
const dateFormat = "YYYY-MM-DD";
const {RangePicker} = DatePicker;

import * as HolidayAction from "../../services/holiday";
import Utils from "../../utils/utils";
import moment from "moment"


let holidayNum = 1;

@Form.create()
class Vacation extends React.Component {

  state = {


    // 假期的key管理
    holidayKeys: [0,],

    // 编辑详情
    detail: [],
  };


  componentDidMount() {
    this.getDetail()
  }

  getDetail = () => {
    HolidayAction.getLegalHoliday().then(result => {
      if (result.errorCode === 0) {
        const holidays = result.body.map(item => item.holidayDate)
        const detail = this.change2Array(holidays, 7)

        detail.forEach((item, index) => (index !== detail.length - 1) && this.addHoliday())
        this.setState({
          detail,
        })
      }
    })
  }

  /**
   * 将一维数组转换成二维数组
   * @param data 一维数组
   * @param len 每个子数组长度
   * @returns {Array}
   */
  change2Array = (data, len) => {
    let arr = [];
    return (function fnc(data, len, arr) {
      if (data.length <= len) {
        arr.push(data);
        return arr;
      } else {
        arr.push(data.splice(0, len));
        return fnc(data, len, arr);
      }
    })(data, len, arr)
  }

  // 添加假期
  addHoliday = () => {
    const {holidayKeys} = this.state;
    const newHolidayKeys = holidayKeys.concat(holidayNum);
    this.setState({
      holidayKeys: newHolidayKeys,
    }, () => {
      holidayNum++
    })
  }

  // 移出假期
  removeHoliday = holidayKey => {
    const {holidayKeys} = this.state;
    const newHolidayKeys = holidayKeys.filter(item => item !== holidayKey);
    this.setState({
      holidayKeys: newHolidayKeys,
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    const {id} = this.props.match.params;
    this.props.form.validateFields((err, values) => {
      if (err) return;
      console.log('form values', values, values.teams);

      const {holidays} = values;
      // 先转化成一维数组，如果不选择日期，则转化成1970-01-01
      const holidayDateList = holidays
        .reduce((acc, val) => acc.concat(val)
          .map(item => item ? moment(item).format(dateFormat) : moment(0).format(dateFormat)));
      console.log(holidayDateList);

      HolidayAction.addLegalHoliday({
        addOrUpdate: false,
        holidayDateList: holidayDateList.join(),
      }).then(result => {
        if (result.errorCode === 0) {
          Utils.dialog.success("提交成功！");
          // this.props.history.goBack();
        }
      });

    });
  };

  renderForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    const {holidayKeys, detail} = this.state;

    const ColLayout = {
      md: 6,
      sm: 24,
    };

    // 每组7个节日
    let arr = [];
    arr.length = 7;
    arr.fill('holiday');


    return (
      <Form
        className=" tableListForm"
        onSubmit={this.handleSubmit}
        autoComplete={'off'}
      >
        {
          holidayKeys.map((key, index) => (
            <div key={key} style={{display: 'flex', flexWrap: "wrap"}}>
              {
                arr.map((arr, ind) => (
                  <FormItem key={ind} className="flex-form-item" style={{marginRight: 24}}>
                    {getFieldDecorator(`holidays[${key}][${ind}]`, {
                      // rules: [{required: true, message: '请填写日期!'}],
                      initialValue: detail[key] && (
                        detail[key][ind] !== moment(0).format("YYYY-MM-DD")
                          ? moment(detail[key][ind])
                          : undefined
                      )
                    })(
                      <DatePicker/>
                    )}
                    {holidayKeys.length > 1 && ind === 6 ? (
                      <Icon
                        style={{marginLeft: 8}}
                        type="minus-circle-o"
                        onClick={() => this.removeHoliday(key)}
                      />
                    ) : null}
                  </FormItem>
                ))
              }
            </div>
          ))
        }
        <FormItem>
          <Button type="dashed" onClick={this.addHoliday} style={{width: 160}}>
            <Icon type="plus"/> 新增节目组
          </Button>
        </FormItem>


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

    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <span>法定节假日设置</span>
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

export default Vacation;
