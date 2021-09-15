import React, { Component } from 'react';
import { connect } from 'react-redux';
import { userActions, userTreeActions,alertActions } from '../_actions';
import { UserForm } from './UserForm';
import {ResetQrButton,ResetPasswordButton} from '../2fa'
import { Button } from 'react-bootstrap';

class UpdateUser extends Component {
	constructor(props) {
		super(props);
		this.state =  props.data || { message: false}
		this.state.message = false
	}
	onChange = (e)  => {
		this.setState({[e.target.name] : e.target.value});
	}
	onSubmit = async (e)  => {
		this.props.progress("Updating user "+this.state.username)
		await this.props.updateUser(this.state)
		this.props.message(this.props.users)
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
			</form>
	}
}

const actionCreators = {
	message : alertActions.message,
	progress: alertActions.progress,	
	updateUser: userActions.update,
	refreshTree: userTreeActions.refresh
};
function mapState(state) {
	const { users, authentication, records, usertree } = state;
	const { user } = authentication;
	const { expanded } = usertree;
	return { user, users, records, expanded };
}
const connectedUpdateUser = connect(mapState, actionCreators)(UpdateUser);
export {connectedUpdateUser as UpdateUser};
