import React from 'react';
import { connect } from 'react-redux';
import { userActions, alertActions } from '../_actions';
import { Button, Form, Col } from 'react-bootstrap';
import { defaultAccountFilters }  from '../defaults';
import { AllowedRoles } from "../_components";

class CreateUser extends React.Component {
	constructor(props) {
		super(props);
		this.user = this.props.user.user;
		this.isWorker = this.props.isWorker
		const defaultFilters = defaultAccountFilters(this.user.username) 
		const selectedKey = "customer_tree_"+this.user.username+"_selected"
		
		this.state = {
			username: '',
			type: defaultFilters.type,
			parent: JSON.parse(localStorage.getItem(selectedKey))
		};
	}
	handleChange = (e) => {
		this.setState({[e.target.name] : e.target.value});
	}
	submit = async () => {
		this.props.progress("Creating user "+this.state.username);
		const filters =   defaultAccountFilters(this.user.username) ;		
		await this.props.createUser({...this.state, parent : this.props.impersonate },filters);
		this.props.message(this.props.users)
	}
	render() {	
		return (      
			<div className="mb-1">
			 <AllowedRoles roles={["admin","user_editor"]}>
			 <div className="card record-inputs">
				<div className="card-header">
					<h5>Create Account</h5>
				</div>
				<div className="card-body">
				<Form>
                    <Form.Row>
                        <Col>
                            <Form.Control name="username" placeholder="Username" onChange={this.handleChange} value={this.state.username}/>
                        </Col>
                        <Col>
                            <Form.Control name="company" placeholder="Company Name" onChange={this.handleChange} value={this.state.company} />
                        </Col>
                        <Col>
                            <Form.Control name="email" placeholder="Email" onChange={this.handleChange} value={this.state.email} />
                        </Col>
                        <Col>                       
                            <Button onClick={this.submit}>CreateUser</Button>
                        </Col>
                    </Form.Row>         					
                </Form>
        </div>
</div>
			 </AllowedRoles>

			</div>
		);
	}
}
const actionCreators = {
	createUser: userActions.create,
	message : alertActions.message,
	progress: alertActions.progress
};
function mapState(state) {
	const { authentication,usertree } = state;
	const { users } = state;
	const { error, success } = users;
	const { user } = authentication;
	const { impersonate } = usertree
	return { user,impersonate, error, success, users };
}
const connectedCreateUser = connect(mapState, actionCreators)(CreateUser);
export {connectedCreateUser as CreateUser};
