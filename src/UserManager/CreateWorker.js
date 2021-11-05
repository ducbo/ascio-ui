import React from 'react';
import { connect } from 'react-redux';
import {  workerActions, alertActions } from '../_actions';
import { Button, Form, Col } from 'react-bootstrap';
import { defaultWorkerFilters}  from '../defaults';
import { AllowedRoles } from "../_components";

class CreateWorker extends React.Component {
	constructor(props) {
		super(props);
		this.user = this.props.user.user;
		const defaultFilters = defaultWorkerFilters(this.user.username) 
		const selectedKey = "customer_tree_"+this.user.username+"_selected"
		this.state = {
			username: '',
			type: defaultFilters.type,
			works_for:  JSON.parse(localStorage.getItem(selectedKey))
		};
	}
	handleChange = (e) => {
		this.setState({[e.target.name] : e.target.value});
	}
	submit = async () => {
		const filters = defaultWorkerFilters(this.user.username) ;		
		this.props.progress("Creating user "+this.state.username);
		try {
			await this.props.createWorker({...this.state, works_for : this.props.impersonate.username  || this.state.works_for  },filters);
			this.setState({username : '', company : '', email: ''})
		} catch (e) {
		}
		this.props.message(this.props.workers)
	}
	validate() {
		if (!this.state.username) {
			return false;
		}
		if (!this.state.username.match(/^[a-z0-9_]+$/)) {
			return false;
		}
		if (!this.state.email) {
			return false;
		}
		if (!this.state.email.match( /\S+@\S+\.\S+/)) {
			return false;
		}
		if (!this.state.company) {
			return false;
		}
		return true;
	}	
	render() {
		const disabled = !this.validate() ? 'disabled' : false;
		return (      
			<div className="mb-1">			 
				<AllowedRoles roles={["admin","user_editor"]}>
					<div className="card record-inputs">
						<div className="card-header">
						<h5>Create worker for the account {this.props.impersonate.name}</h5>
						</div>
						<div className="card-body">
							<p>Create a new user that works for the company {this.props.impersonate.name}. Can see/edit  it's zones and all zones of the sub-users. <br></br>Only the character a-z, 0-9 and _ are allowed for the username.  </p>
							<Form>
								<Form.Row>
									<Col>
										<Form.Control name="username" placeholder="Username" onChange={this.handleChange} value={this.state.username}/>
									</Col>
									<Col>
										<Form.Control name="company" placeholder="Company Name" onChange={this.handleChange} value={this.state.company}/>
									</Col>
									<Col>
										<Form.Control name="email" placeholder="Email" onChange={this.handleChange} value={this.state.email}/>
									</Col>
									<Col>                       
										<Button disabled={disabled}  onClick={this.submit}>Create Worker</Button>
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
	message : alertActions.message,
	progress: alertActions.progress,
	createWorker: workerActions.create
};
function mapState(state) {
	const { authentication,usertree,workers } = state;
	const { user } = authentication;
	const { impersonate } = usertree
	return { user,impersonate, workers};
}
const connectedCreateWorker = connect(mapState, actionCreators)(CreateWorker);
export {connectedCreateWorker as CreateWorker};
