import {Link} from "react-router-dom";
import {
  Button,
  Icon,
  Breadcrumb,
} from "antd";

class Chose extends React.Component {

  renderForm() {
    return (
      <div style={{display: 'flex', justifyContent: 'space-around'}}>
        <Button style={{width: 300, height: 200}}>
          <Link to="/work/list/type1/add">
            <p> 类型1 </p>
            （适用于日常排班）
          </Link>
        </Button>
        <Button style={{width: 300, height: 200}}>
          <Link to="/work/list/type2/add">
            <p> 类型2 </p>
            （适用于高峰期或岗位复杂部门排班）
          </Link>
        </Button>

      </div>
    );
  }

  render() {
    let {match} = this.props;
    const id = match.params.id;

    return (
      <div id="wrap">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <span>新建排班</span>
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

export default Chose;
