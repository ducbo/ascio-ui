import { connect } from 'react-redux';
import { userActions } from '../_actions';
import React from 'react';

class QR extends React.Component {
    constructor (props) { 
        super(props)
        this.state = {qr : ""}
    }
    render() {
        if(  this.props.qr) {
           return <div className={`alert secondary`}> 
            <h4>2 Factor Authentication Setup</h4>
            <p>Please setup your <b>Google Authenticator</b>  on your IPhone, Android-Phone or PC, and scan the QR-code with the <b>Google Authenticator</b> to continue.</p>
            <img
            src={'data:image/svg+xml;utf8,' + this.props.qr}
            style={{width: '100%' }}
            alt="website logo"
            />
        </div>
        } else return ""
        

    }
}

function mapState(state) {
    const {  authentication,users } = state;
    const { user } = authentication;
    const qr = authentication.qr ||users.qr || (users.error && users.error.qr)
    return { user,qr };
}

const actionCreators = {
    getQR: userActions.getQR 
};

const QRconnected = connect(mapState, actionCreators)(QR);
export  { QRconnected as QR }