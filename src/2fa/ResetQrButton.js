import { connect } from 'react-redux';
import { userActions } from '../_actions';
import React from 'react';
import { Button } from 'react-bootstrap';

class ResetQrButton extends React.Component {
    constructor (props) { 
        super(props)
        this.state = {loading: false}
    }
    sendReset = async () =>  {
        this.setState({loading: true})
        await this.props.resetQR(this.props.username)        
        this.setState({loading: false})
        this.props.setMessage("success","QR Code resetted")
    }
    render() {
       return <Button onClick={this.sendReset} disabled={this.state.loading}>Reset QR-Code</Button>
    }
}

function mapState(state) {
    const {  authentication } = state;
    const { user,qr, loggedIn} = authentication;
    return { user,qr };
}

const actionCreators = {
    resetQR: userActions.resetQR 
};

const ResetQrButtonconnected = connect(mapState, actionCreators)(ResetQrButton);
export  { ResetQrButtonconnected as ResetQrButton }