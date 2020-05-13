import { Link } from "react-router-dom";
import { Form, Input, Icon, Upload, Button, Select, Row, Col, Breadcrumb, DatePicker, Checkbox } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

import * as Actions from "../actions";
import Utils from "../../../common/utils/utils";
import styles from "./styles.less";

// import * as Actions from './actions'
// import Utils from '../../common/utils/utils'
import axios from 'axios'
import ReactQuill, { Quill, Mixin, Toolbar } from 'react-quill'
var Delta = require('quill-delta/lib/delta');
import 'react-quill/dist/quill.snow.css';
import Column from "antd/lib/table/Column";

const modules = {
    toolbar: {
        container: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
            // [{ 'direction': 'rtl' }],                         // text direction
            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6] }],
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['link', 'image'],
            ['clean']
        ],
    }
}
const CheckboxGroup = Checkbox.Group;

const plainOptions = [
    '查看同部门1级考勤', '查看其他部门1级考勤',
    '查看同部门2级考勤', '查看其他部门2级考勤',
    '查看同部门3级考勤', '查看其他部门3级考勤',
    '查看同部门4级考勤', '查看其他部门4级考勤',
    '查看同部门5级考勤', '查看其他部门5级考勤',
    '查看同部门6级考勤', '查看其他部门6级考勤'
];
// const defaultCheckedList = ['Apple', 'Orange'];

class Detail extends React.Component {
    state = {
        detail: {
            title: '',
            img: '',
            type: 0,
            summary: '',
            content: '',

        },
        id: '',
        checkedList: [],
        indeterminate: true,
        checkAll: false,
    }
    constructor(props) {
        super(props)
    }

    onChangeAuthority = checkedList => {
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
            checkAll: checkedList.length === plainOptions.length,
        });
    };

    onCheckAllChange = e => {
        this.setState({
            checkedList: e.target.checked ? plainOptions : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    };

    componentDidMount() {
        let _this = this, { dispatch, match } = this.props, id = match.params.id;
        this.setState({
            id: id ? id : ""
        })
        if (id !== undefined) {
            this.getUser(id)
        }
    }

    //获取员工详情
    getUser = (id) => {
        let _this = this;
        Actions.getUser({ id }).then(response => {
            if (response.errorCode === 0) {
                let banner = response.body;
                _this.setState({
                    detail: banner,
                });
            } else {
                Utils.dialog.error(response.msg)
            }
        })
    }

    handleEditorChange = (value) => {
        this.state.detail.content = value
        this.setState({
            detail: this.state.detail
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.id === '') {
            let { dispatch, match, history } = this.props, _this = this;
            this.props.form.validateFields((err, values) => {
                console.log(values)
                if (!err) {
                    values.linkType = 'text'
                    // values.value = this.state.detail;
                    Actions.creatUser(values).then(response => {
                        if (response.errorCode == 0) {
                            Utils.dialog.success('保存成功', () => {
                                history.push('/user/list/index')
                            })
                        } else {
                            Utils.dialog.error(response.msg)
                        }
                    })
                }
            });
        } else {
            console.log('修改')
            let { dispatch, match } = this.props, _this = this;
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    values.id = this.state.detail.id;
                    values.linkType = 'text'
                    Actions.updateUser(values).then(response => {
                        if (response.errorCode == 0) {
                            Utils.dialog.success('修改成功', () => {
                                history.push('/user/list/index')
                            })
                        } else {
                            // console.log("修改"+response.msg)
                            Utils.dialog.error(response.msg)
                        }
                    })
                }
            });
        }
    }


    beforeUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片大小不能超过2MB!');
        }
        return isLt2M;
    }

    shandleChange = ({ file, fileList }) => {
        if (file.response && file.response.errorCode === 0) {
            let detail = this.state.detail
            detail.img = file.response.body
            this.setState({ detail })
        } else if (file.response && file.response.errorCode !== 0) {
            Utils.dialog.error(file.response.msg)
        }
    }

    normFile = (e) => {
        let fileList = e.fileList.filter((file) => {
            if (file.response) {
                if (file.response.errorCode === 0) {
                    file.url = file.response.body
                    return true;
                }
            }
            return true;
        }).slice(-1);
        return fileList[0].url;
    }

    onChangeTime = (date, dateString) => {
        // console.log(date, dateString);
    }

    onChange = (e) => {
        // console.log(`checked = ${e.target.checked}`);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { detail, parmas, pagePath } = this.state;
        const config = {
            rules: [{ type: 'object', required: true, message: 'Please select time!' }],
        };
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 3,
                },
            },
        };
        const props = {
            className: "avatar-uploader",
            action: Actions.uploadFileUrl,
            showUploadList: false,
            withCredentials: true,
            beforeUpload: this.beforeUpload.bind(this),
            onChange: this.shandleChange.bind(this),
            name: 'upfile',
            accept: "image/*",
            data: {
                withStatus: true
            },
            headers: {
                'X-Requested-With': null,
            },
            onProgress: null,
            disabled: false
        }
        return (
            <div id="wrap">
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>
                        <span>添加新员工 &nbsp;&nbsp;&nbsp;&nbsp;    <a>   返回</a></span>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div className="content">
                    <Form onSubmit={this.handleSubmit}>
                        <Row gutter={16}>
                            <Col className="gutter-row" span={6}>
                                <FormItem
                                    {...formItemLayout}
                                    label="姓名"
                                    hasFeedback
                                >
                                    {getFieldDecorator('name', {
                                        rules: [{
                                            required: true, message: '请输入姓名',
                                        }],
                                        initialValue: detail.name
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="性别">
                                    {getFieldDecorator('gender', {
                                        rules: [{
                                            required: true, message: '请选择性别',
                                        }],
                                        initialValue: detail.gender
                                    })(
                                        <Select>
                                            {/* <Option>请选择部门</Option> */}
                                            <Option value={0}>男</Option>
                                            <Option value={1}>女</Option>
                                            {/* <Option value={2}>数据报告</Option> */}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem
                                    {...formItemLayout}
                                    label="出生日期"
                                    hasFeedback
                                >
                                    {getFieldDecorator('birthday', {
                                        rules: [{
                                            required: true, message: '请输入出生日期',
                                        }],
                                        initialValue: detail.birthday
                                    })(
                                        <DatePicker onChange={this.onChangeTime()} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem
                                    {...formItemLayout}
                                    label="手机号"
                                    hasFeedback
                                >
                                    {getFieldDecorator('phone', {
                                        rules: [{
                                            required: true, message: '请输入手机号',
                                        }],
                                        initialValue: detail.phone
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col className="gutter-row" span={6}>
                                <FormItem
                                    {...formItemLayout}
                                    label="所属部门"
                                    hasFeedback
                                >
                                    {getFieldDecorator('deptId', {
                                        rules: [{
                                            required: true, message: '请选择部门',
                                        }],
                                        initialValue: detail.deptId
                                    })(
                                        <Select>
                                            <Option value={0}>请选择</Option>
                                            <Option value={1}>男</Option>
                                            <Option value={2}>女</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout} label="所属班组">
                                    {getFieldDecorator('teamId', {
                                        rules: [{
                                            required: false, message: '请选择班组',
                                        }],
                                        initialValue: detail.teamId
                                    })(
                                        <Select>
                                            <Option value={0}>请选择</Option>
                                            <Option value={1}>男</Option>
                                            <Option value={2}>女</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem
                                    {...formItemLayout}
                                    label="所属岗位"
                                    hasFeedback
                                >
                                    {getFieldDecorator('postId', {
                                        rules: [{
                                            required: false, message: '请选择岗位',
                                        }],
                                        initialValue: detail.postId
                                    })(
                                        <Select>
                                            <Option value={0}>请选择</Option>
                                            <Option value={1}>男</Option>
                                            <Option value={2}>女</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem
                                    {...formItemLayout}
                                    label="外单位工龄"
                                    hasFeedback
                                >
                                    {getFieldDecorator('outWorkYears', {
                                        rules: [{
                                            required: true, message: '请输入工龄',
                                        }],
                                        initialValue: detail.outWorkYears
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col className="gutter-row" span={6}>
                                <FormItem
                                    {...formItemLayout}
                                    label="入职时间"
                                    hasFeedback
                                >
                                    {getFieldDecorator('entryTime', {
                                        rules: [{
                                            required: true, message: '请选择入职时间',
                                        }],
                                        initialValue: detail.entryTime
                                    })(
                                        <DatePicker onChange={this.onChangeTime()} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem
                                    {...formItemLayout}
                                    label="工号"
                                    hasFeedback
                                >
                                    {getFieldDecorator('code', {
                                        rules: [{
                                            required: true, message: '请输入工号',
                                        }],
                                        initialValue: detail.code
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem
                                    {...formItemLayout}
                                    label="是否持证"
                                    hasFeedback
                                >
                                    {getFieldDecorator('isCertificate', {
                                        rules: [{
                                            required: true, message: '请选择',
                                        }],
                                        initialValue: detail.isCertificate
                                    })(
                                        <Select>
                                            <Option value=''>请选择</Option>
                                            <Option value={0}>是</Option>
                                            <Option value={1}>否</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <FormItem
                                    {...formItemLayout}
                                    label="所属级别"
                                    hasFeedback
                                >
                                    {getFieldDecorator('levelId', {
                                        rules: [{
                                            required: true, message: '请选择',
                                        }],
                                        initialValue: detail.levelId
                                    })(
                                        <Select>
                                            <Option value={0}>请选择</Option>
                                            <Option value={1}>男</Option>
                                            <Option value={2}>女</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        {/* <Row>
                            <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                                <Checkbox onChange={this.onChangeCheckbox()}>允许此人有审批权限</Checkbox>
                            </Col>
                            <Col xs={{ span: 11, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                                <Checkbox onChange={this.onChangeCheckbox()}>允许此人有登录后台权限</Checkbox>
                            </Col>
                            <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                                所有员工账号为工号,初始密码为123456
                            </Col>
                        </Row> */}
                        <Row type="flex" justify="start">
                            {/* <Col span={3}>
                            </Col> */}
                            <Col span={2}>
                            </Col>
                            <Col span={4}>
                                {/* <Checkbox style={{ color: 'red' }} onChange={this.onChange()}>允许此人有审批权限</Checkbox> */}
                                <FormItem>
                                    {getFieldDecorator('isApproval', {
                                        rules: [{
                                            required: false, message: '',
                                        }],
                                        initialValue: detail.isApproval
                                    })(
                                        <Checkbox style={{ color: 'red' }}>允许此人有审批权限</Checkbox>
                                    )}
                                </FormItem>

                            </Col>
                            <Col span={4}>
                                {/* <Checkbox style={{ color: 'red' }} onChange={this.onChange()}>允许此人有登录后台权限</Checkbox> */}
                                <FormItem>
                                    {getFieldDecorator('type', {
                                        rules: [{
                                            required: false, message: '',
                                        }],
                                        initialValue: detail.type
                                    })(
                                        <Checkbox style={{ color: 'red' }}>允许此人有登录后台权限</Checkbox>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={4}>
                                <Icon style={{ color: 'red', marginTop: 10 }} type="exclamation-circle" />&nbsp;&nbsp;所有员工账号为工号,初始密码为123456
                            </Col>

                        </Row><br /><br />
                        <Row type="flex" justify="start">
                            <div style={{ width: 400 }}>
                                <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                                    <span style={{ color: 'red', margintRight: 10 }}>查看类角色权限 </span>&nbsp;&nbsp;&nbsp;
                            <Checkbox
                                        style={{ margintRight: 10 }}
                                        indeterminate={this.state.indeterminate}
                                        onChange={this.onCheckAllChange}
                                        checked={this.state.checkAll}
                                    >
                                        所有权限
                            </Checkbox>
                                </div>
                                <br />
                                {/* <CheckboxGroup
                                    style={{ display: 'flex-wrap', flexDirection: 'row' }}
                                    options={plainOptions}
                                    value={this.state.checkedList}
                                    onChange={this.onChangeAuthority}
                                /> */}
                               

                                <FormItem>
                                    {getFieldDecorator('permissionIdList', {
                                        rules: [{
                                            required: true, message: '',
                                        }],
                                        initialValue: detail.permissionIdList
                                    })(
                                        <CheckboxGroup
                                             style={{display:'flex-wrap', flexDirection:'row'}}
                                             options={plainOptions}
                                             value={this.state.checkedList}
                                             onChange={this.onChangeAuthority}
                                            />
                                    )}
                                </FormItem>

                            </div>
                            {/* <Col span={2}>
                                <span style={{ color: 'red' }}>查看类角色权限 </span>
                            </Col>
                            <Col span={4}>
                                <Checkbox onChange={this.onChange()}>所有权限</Checkbox>
                            </Col> */}
                        </Row>
                        {/* <Row>
                            <Checkbox.Group style={{ width: '100%' }}
                             value={this.state.checkedList} 
                             onChange={this.onChangeAuthority}
                            >
                                <Row type="flex" justify="start">
                                    <Col span={3}>
                                        <Checkbox value="A">查看同部门1级考勤</Checkbox>
                                    </Col>
                                    <Col span={4}>
                                        <Checkbox value="B">查看其他部门1级考勤</Checkbox>
                                    </Col>
                                </Row>
                                <Row type="flex" justify="start">
                                    <Col span={3}>
                                        <Checkbox value="C">查看同部门2级考勤</Checkbox>
                                    </Col>
                                    <Col span={4}>
                                        <Checkbox value="D">查看其他部门2级考勤</Checkbox>
                                    </Col>
                                </Row>
                                <Row type="flex" justify="start">
                                    <Col span={3}>
                                        <Checkbox value="E">查看同部门3级考勤</Checkbox>
                                    </Col>
                                    <Col span={4}>
                                        <Checkbox value="F">查看其他部门3级考勤</Checkbox>
                                    </Col>
                                </Row>
                                <Row type="flex" justify="start">
                                    <Col span={3}>
                                        <Checkbox value="G">查看同部门4级考勤</Checkbox>
                                    </Col>
                                    <Col span={4}>
                                        <Checkbox value="H">查看其他部门4级考勤</Checkbox>
                                    </Col>
                                </Row>
                                <Row type="flex" justify="start">
                                    <Col span={3}>
                                        <Checkbox value="I">查看同部门5级考勤</Checkbox>
                                    </Col>
                                    <Col span={4}>
                                        <Checkbox value="J">查看其他部门5级考勤</Checkbox>
                                    </Col>
                                </Row>
                                <Row type="flex" justify="start">
                                    <Col span={3}>
                                        <Checkbox value="K">查看同部门6级考勤</Checkbox>
                                    </Col>
                                    <Col span={4}>
                                        <Checkbox value="L">查看其他部门6级考勤</Checkbox>
                                    </Col>
                                </Row>
                            </Checkbox.Group>
                        </Row> */}
                        <Row type="flex" justify="start">
                            <Col span={4}></Col>
                            <Col span={20}>
                                <FormItem{...tailFormItemLayout}>
                                    {
                                        <div>
                                            <Button type='primary' htmlType="submit" size='large' style={{ marginRight: 10 }}>保存</Button>
                                        </div>
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        );
    }
}

const UserListDetail = Form.create()(Detail)
export default UserListDetail

