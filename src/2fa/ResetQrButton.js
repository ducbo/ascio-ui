import { connect } from 'react-redux';
import { userActions, alertActions } from '../_actions';
import React from 'react';
import { Button } from 'react-bootstrap';

class ResetQrButton extends React.Component {
    constructor (props) { 
        super(props)
        this.state = {loading: false}
    }
    sendReset = async () =>  {
        this.setState({loading: true})
        this.props.progress("Updating QR-Code for "+this.props.username)
        await this.props.resetQR(this.props.username)        
        this.setState({loading: false})
        this.props.message(this.props.users)
    }
    render() {
       return <Button onClick={this.sendReset} disabled={this.state.loading}>Reset QR-Code</Button>
    }
}

function mapState(state) {
    const {  authentication, users } = state;
    const { user,qr } = authentication;
    return { user,qr,users };
}

const actionCreators = {
    message : alertActions.message,
	progress: alertActions.progress,
    resetQR: userActions.resetQR 
};

const ResetQrButtonconnected = connect(mapState, actionCreators)(ResetQrButton);
export  { ResetQrButtonconnected as ResetQrButton }