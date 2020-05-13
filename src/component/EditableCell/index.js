import React, {PureComponent, Fragment} from 'react';
import {
  Form,
  Input,
  InputNumber,
  Divider,
} from 'antd';

import'./index.less'

const FormItem = Form.Item;

// 可编辑单元格
const EditableContext = React.createContext();
const EditableRow = ({form, index, ...props}) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends PureComponent {
  state = {
    editing: false,
  }

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({editing}, () => {
      if (editing) {
        this.input.focus();
      }
    });
  }

  save = () => {
    const {record, handleSave} = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      handleSave({...record, ...values});
    });
  }

  render() {
    const {editing} = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      ...restProps
    } = this.props;
    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              return (
                editing ? (
                  <FormItem style={{margin: 0}}>
                    {form.getFieldDecorator(dataIndex, {
                      rules: [{
                        required: true,
                        message: `请输入 ${title}`,
                      }],
                      initialValue: record[dataIndex],
                    })(
                      <Input
                        className="component-edit-input"
                        style={{color:'red'}}
                        autoComplete="off"
                        ref={node => (this.input = node)}
                        // onPressEnter={this.save}
                        // onBlur={this.toggleEdit}
                        addonAfter={(
                          <Fragment>
                            <a onClick={this.save}>保存</a>
                            <Divider type="vertical" />
                            <a onClick={this.toggleEdit}>取消</a>
                          </Fragment>
                        )}
                      />
                    )}
                  </FormItem>
                ) : (
                  <span
                    className="editable-cell-value-wrap"
                    style={{paddingRight: 24,verticalAlign:"middle"}}
                    onClick={this.toggleEdit}
                  >
                    {restProps.children}
                  </span>
                )
              );
            }}
          </EditableContext.Consumer>
        ) : restProps.children}
      </td>
    );
  }
}

const editableCell = {
  body: {
    row: EditableFormRow,
    cell: EditableCell,
  },
};

export default editableCell;