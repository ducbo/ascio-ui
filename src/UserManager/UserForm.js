import React, { Component } from 'react';
import { connect } from 'react-redux';
import { userActions } from '../_actions';
import { Combobox } from 'react-widgets';
import {TextInput,Email} from '../_fields'
class UserForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: props.data || { }
		};
	}
	onChange = (e)  =>  {
        this.setState({ [e.target.name] : e.target.value});
        this.props.onChange(e)
    }
	render() {
        return  <>
           <TextInput
               field="company"
               name="Company"
               data={this.state.data}
               placeholder = "My Company"
               description = "Please place your company-name here"
               onChange = {this.onChange}
           />
           <TextInput
               field="phone"
               name="Phone"
               data={this.state.data}
               placeholder = "+49.123453242"
               description = "Please place your phone number"
               onChange = {this.onChange}
           />
           <Email
               field="email"
               name="Email"
               data={this.state.data}
               placeholder = "test@myemail.com"
               description = "Please place email-address"
               onChange = {this.onChange}
           />
        </>
	}
}

const actionCreators = {
	updateUser: userActions.update,
	createUser: userActions.create
};
function mapState(state) {
	const { users, authentication} = state;
	const { user } = authentication;
	return { user, users };
}
const connectedUserForm = connect(mapState, actionCreators)(UserForm);
export {connectedUserForm as UserForm};
