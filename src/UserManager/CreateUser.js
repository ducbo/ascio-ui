import React from 'react';
import { connect } from 'react-redux';
import { userActions, workerActions } from '../_actions';
import { Button, Form, Col } from 'react-bootstrap';
import { defaultAccountFilters }  from '../defaults';
import AlertSuccess from '../AlertSuccess';
import { AllowedRoles } from "../_components";

class CreateUser extends React.Component {
	constructor(props) {
		super(props);
		this.user = this.props.user.user;
		this.isWorker = this.props.isWorker
		this.defaultFilters = defaultAccountFilters(this.user.username) 
		const selectedKey = "customer_tree_"+this.user.username+"_selected"
		
		this.state = {
			username: '',
			type: this.defaultFilters.type,
			parent: this.props.impersonate || JSON.parse(localStorage.getItem(selectedKey))
		};
	}
	handleChange = (e) => {
		this.setState({[e.target.name] : e.target.value});
	}
	submit = () => {
		const filters =  this.defaultFilters;		
		this.props.createUser(this.state,filters);
	}
	render() {	
		return (      
			<div className="mb-1">
			 <AllowedRoles roles={["admin","user_editor"]}>
			 <Form>
					<Form.Row>
						<Col>
							<Form.Control name="username" placeholder="Username" onChange={this.handleChange} />
						</Col>
						<Col>
							<Form.Control name="company" placeholder="Company Name" onChange={this.handleChange} />
						</Col>
						<Col>
							<Form.Control name="email" placeholder="Email" onChange={this.handleChange} />
						</Col>
						<Col>						
							<Button onClick={this.submit}>CreateUser</Button>
						</Col>
					</Form.Row>          
          <Form.Row>
            <Col className="mt-2">
              <AlertSuccess 
                success={this.props.success ? "User created" : null}
                progress={this.props.progress}
                error={this.props.error && this.props.error.message}
              ></AlertSuccess>
            </Col>
          </Form.Row>
				</Form>
			 </AllowedRoles>

			</div>
		);
	}
}
const actionCreators = {
	createUser: userActions.create
};
function mapState(state) {
	const { authentication,usertree } = state;
	const { users } = state;
	const { error, success } = users;
	const { user } = authentication;
	const { impersonate } = usertree
	return { user,impersonate, error, success };
}
const connectedCreateUser = connect(mapState, actionCreators)(CreateUser);
export {connectedCreateUser as CreateUser};
