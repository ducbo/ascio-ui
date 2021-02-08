import React, { Component } from 'react';
import { connect } from 'react-redux';
import { workerActions, userTreeActions } from '../_actions';
import { UserForm } from './UserForm';
import {ResetQrButton,ResetPasswordButton} from '../2fa'
import { Button } from 'react-bootstrap';
import AlertSuccess from '../AlertSuccess';

class UpdateWorker extends Component {
	constructor(props) {
		super(props);
		this.state =  props.data || { message: false}
		this.state.message = false
	}
	onChange = (e)  => {
		this.setState({[e.target.name] : e.target.value});
	}
	onSubmit = async (e)  => {
		await this.props.updateUser(this.state)
	}
	setMessage = (type,message) => {
		this.setState({message: {[type]: message}})
	}
	render() {
		return 	<form onSubmit = {this.onSubmit}>				
				<UserForm 
					onChange = {this.onChange}
					data = {this.state}
				/>
				<Button onClick = {this.onSubmit}>Update</Button> <ResetQrButton setMessage = {this.setMessage} username={this.state.username}/> <ResetPasswordButton setMessage = {this.setMessage} username={this.state.username}/>				
				<AlertSuccess 
					className="mt-2"
                	success={this.state.message.success}
                	progress={this.state.message.progress}
                	error={this.state.message.error}
              ></AlertSuccess>
			</form>
	}
}

const actionCreators = {
	updateUser: workerActions.update,
	refreshTree: userTreeActions.refresh
};
function mapState(state) {
	const { users, authentication, records, usertree } = state;
	const { user } = authentication;
	const { expanded } = usertree;
	return { user, users, records, expanded };
}
const connectedUpdateWorker = connect(mapState, actionCreators)(UpdateWorker);
export {connectedUpdateWorker as UpdateWorker};
