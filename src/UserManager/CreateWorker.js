import React from 'react';
import { connect } from 'react-redux';
import {  workerActions } from '../_actions';
import { Button, Form, Col } from 'react-bootstrap';
import { defaultWorkerFilters}  from '../defaults';
import AlertSuccess from '../AlertSuccess';
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
		try {
			await this.props.createWorker({...this.state, works_for : this.props.impersonate  || this.state.works_for  },filters);
			this.setState({username : '', company : '', email: ''})
		} catch (e) {

		}
	}
	render() {	
		return (      
			<div className="mb-1">			 
				<AllowedRoles roles={["admin","user_editor"]}>
					<div class="card record-inputs">
						<div class="card-header">
						<h5>Create Worker</h5>
						</div>
						<div class="card-body">
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
										<Button onClick={this.submit}>Create Worker</Button>
									</Col>
								</Form.Row>          
								<Form.Row>
									<Col className="mt-2">
									<AlertSuccess 
										success={this.props.success}
										progress={this.props.progress}
										error={this.props.error}
									></AlertSuccess>
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
	createWorker: workerActions.create
};
function mapState(state) {
	const { authentication,usertree,workers } = state;
	const { user } = authentication;
	const { impersonate } = usertree
	const { error, success  } = workers
	return { user,impersonate, error,success};
}
const connectedCreateWorker = connect(mapState, actionCreators)(CreateWorker);
export {connectedCreateWorker as CreateWorker};
