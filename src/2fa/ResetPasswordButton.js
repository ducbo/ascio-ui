import { connect } from 'react-redux';
import { userActions, alertActions } from '../_actions';
import React from 'react';
import { Button } from 'react-bootstrap';


class ResetPasswordButton extends React.Component {
    constructor (props) { 
        super(props)
        this.state = {loading: false}
    }
    sendReset = async () =>  {
        this.setState({loading: true})
        this.props.progress("Sending password reset mail to "+this.props.username)
        await this.props.resetPassword(this.props.username)
        this.setState({loading: false})
        this.props.message(this.props.users)
    }
    render() {
       return <Button onClick={this.sendReset} disabled={this.props.users.loading}>Reset Password</Button>
    }
}

function mapState(state) {
    const {  authentication, users  } = state;
    const { user,qr } = authentication;
    return { user,qr,users  };
}

const actionCreators = {
    message : alertActions.message,
	progress: alertActions.progress,
    resetPassword: userActions.resetPassword 
};

const ResetPasswordButtonconnected = connect(mapState, actionCreators)(ResetPasswordButton);
export  { ResetPasswordButtonconnected as ResetPasswordButton }