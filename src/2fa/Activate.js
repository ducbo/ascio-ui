import { connect } from 'react-redux';
import { userActions } from '../_actions';
import { history } from '../_helpers';

import React from 'react';

class Activate2FA extends React.Component {
    constructor (props) { 
        super(props)
        this.sendActivate2fa = this.sendActivate2fa.bind(this);
    }
    async sendActivate2fa() {
        await this.props.activate2fa(this.props.code)
        history.push('/dns-manager')
    }
    render() {
        return <button className="btn btn-primary" onClick={this.sendActivate2fa}>Activate 2FA</button>
    }
}

function mapState(state) {
    const {  authentication } = state;
    const { code } = authentication;
    return { code };
}

const actionCreators = {
    activate2fa: userActions.activate2fa 
};

const ActivateConnected = connect(mapState, actionCreators)(Activate2FA);
export {ActivateConnected as Activate}