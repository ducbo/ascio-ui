import { connect } from 'react-redux';
import { history, init } from '../_helpers';
import { userActions,userTreeActions } from '../_actions';
import {QR} from './QR'
import React from 'react';
import socketIOClient from "socket.io-client";
import config from '../config';

class Code extends React.Component {
    constructor (props) { 
        super(props)
         
        this.allowBypass = this.props.allowBypass
        this.state = {code : "", submitted: false,buttonText: "Login"}
        this.submitCode = this.submitCode.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.state = {
            qr: null,
            buttonText: "Login",
            activated2fa : false
        }
        
    }
    componentDidMount() {
    }

    handleChange(e) {
        const { value } = e.target;
        this.setState({code: value})
    }
    async submitCode() {        
        const {code} = this.state 
        const {username,password} = this.props.credentials
        await this.props.login(username, password, code, {activate2fa : this.props.qr !== undefined})
        if(this.props.loggedIn === true) {    
            const socket = socketIOClient(config.websocketUrl,{
                transports: ['websocket']
              }) 
            socket.emit("user:login",this.props.user.token)    
            await this.props.getRootDescendants(this.props.user.user.username)  
            await this.props.impersonate(init(this.props.user.user))                          
            history.push("/dns-manager")
        }

    }
    render() {
        const byPass2FA = this.allowBypass && this.props.force2fa
        const {submitted,code}  = this.state
        const buttonText =  this.props.qr ? "Activate 2FA" : "Login"
        const byPassButton = byPass2FA ? <button className="btn btn-primary" onClick={this.props.submitCode}>Setup 2fa later</button> : ""
        return <>
            <QR/>
            <div className={'form-group' + (submitted && !code? ' has-error' : '')}>
                <label htmlFor="code">2FA Code</label>
                <input type="text" className="form-control" name="code" value={code} onChange={this.handleChange} />  
                {submitted && !code &&
                    <div className="help-block">2FA code is required</div>
                }
            </div>
            <button className="btn btn-primary" onClick={this.submitCode}>{buttonText}</button>
            {" "+byPassButton}
        </>
    }
}

const actionCreators = {
    login: userActions.login,
    getRootDescendants : userTreeActions.getRootDescendants,
    impersonate : userTreeActions.impersonate
};
function mapState(state) {
    const {  authentication } = state;
    const { force2fa, qr, loggedIn, user  } = authentication;
    return { force2fa, qr, loggedIn,user };
}
const CodeConnected = connect(mapState, actionCreators)(Code);
export {CodeConnected as Code}