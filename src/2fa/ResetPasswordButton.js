import { connect } from 'react-redux';
import { userActions } from '../_actions';
import Code from './Code'
import Activate from './Activate'
import React from 'react';
import { Button } from 'react-bootstrap';


class ResetPasswordButton extends React.Component {
    constructor (props) { 
        super(props)
        this.state = {loading: false}
    }
    sendReset = async () =>  {
        this.setState({loading: true})
        await this.props.resetPassword(this.props.username)
        this.setState({loading: false})
        this.props.setMessage("success","Password reset link sent.")
    }
    render() {
       return <Button onClick={this.sendReset} disabled={this.state.loading}>Reset Password</Button>
    }
}

function mapState(state) {
    const {  authentication } = state;
    const { user,qr, loggedIn} = authentication;
    return { user,qr };
}

const actionCreators = {
    resetPassword: userActions.resetPassword 
};

const ResetPasswordButtonconnected = connect(mapState, actionCreators)(ResetPasswordButton);
export  { ResetPasswordButtonconnected as ResetPasswordButton }