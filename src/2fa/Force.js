import { connect } from 'react-redux';
import { userActions } from '../_actions';
import React from 'react';

class Force2fa extends React.Component {
    constructor (props) { 
        super(props)
        this.state = {qr : ""}
        this.sendForce2fa = this.sendForce2fa.bind(this);
    }
    sendForce2fa() {
        this.props.force2fa(this.props.code)
    }
    render() {
        return <button className="btn btn-primary" onClick={this.sendForce2fa}>Force 2FA</button>
    }
}

function mapState(state) {
    const {  authentication } = state;
    const { code } = authentication;
    return { code };
}

const actionCreators = {
    force2fa: userActions.force2fa 
};

const Force2faConnected = connect(mapState, actionCreators)(Force2fa);
export default Force2faConnected