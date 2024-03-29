import React from 'react';
import { connect } from 'react-redux';
import logo from '../logo-black.svg';
import { userActions } from '../_actions';
import {TextInput, UpdatePassword} from "../_fields"
import {  FaExclamationTriangle } from 'react-icons/fa';
import {QR} from '../2fa'
import { history } from '../_helpers';

class PasswordResetPage extends React.Component {
    constructor(props) {
        super(props);

        // reset login status       

        this.state = {
            username: '',
            password: '',
            valid: false
        };

        this.token = this.props.match.params.token
    }

    handleChange = (e)  => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
    passwordValid = (valid,password) => {
        this.setState({valid,password})
    }
    checkUsername = async (e) => {
        this.handleChange(e)
        if(this.timeoutHandle) {
            window.clearTimeout(this.timeoutHandle)
        }
        this.timeoutHandle = window.setTimeout(async () => {
            if(this.state.username.length > 1 ) {
                await this.props.verifyUserToken(this.state.username, this.token,this.state.code)
            }
        },500)
        
    }
    sendUpdate = async (e) => {
        e.preventDefault()
        await this.props.updatePassword(this.state.username,this.token,this.state.password,this.state.code)
        if(!this.props.error) {
            history.push("/dns-manager")
        }
    }
    render() {
        let errors
        if(this.props.error) {
             errors = <ul className="validation-list"><li><FaExclamationTriangle style={{color:"darkred"}}/> {this.props.error.message}</li></ul>
        }
        return <div className="login">
				<img style={{ width: '100%' }} src={logo} alt="Logo" />
				<div className="card mb-4 rounded-3 shadow-sm mt-5">
					<div className="card-header py-3">
						<h4 className="my-0 fw-normal">Reset Password</h4>
					</div>
					<div className="card-body">
					<p>Please choose a secure password with lowercase characters, uppercase characters, numbers, special characters or a very long password with more than 29 characters.</p>
                <form onSubmit={this.sendUpdate}>
                <UpdatePassword onChange={this.handleChange} passwordValid={this.passwordValid}></UpdatePassword>                   
                    <TextInput               
                        field="username"
                        name="Username"
                        data={this.state}
                        placeholder = "Username"
                        description = "Please place your username here"
                        pattern = ".{3,}"
                        onChange = {this.checkUsername}></TextInput> 
                    <QR/>
                    <TextInput               
                        field="code"
                        name="2FA Code"
                        data={this.state}
                        placeholder = "xxxx"
                        description = "Please place your 2FA Code here"
                        pattern = ".{3,}"
                        onChange = {this.checkUsername}></TextInput>     
                    {errors}                                    
                    
                   
                    <button className="btn btn-primary" onClick={this.sendUpdate} disabled = {!this.state.valid}>Update password</button>
                </form>
					</div>
				</div>
			</div>               
    }
}


const actionCreators = {
    updatePassword: userActions.updatePassword,
    verifyUserToken: userActions.verifyUserToken
};
function mapState(state) {
    const {error} = state.users;
    return { error };
}
const connectedPasswordResetPage = connect(mapState, actionCreators)(PasswordResetPage);
export { connectedPasswordResetPage as PasswordResetPage };