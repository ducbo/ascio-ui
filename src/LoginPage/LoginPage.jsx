import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import logo from '../logo.png';
import { userActions } from '../_actions';
import {LoginButton, Code, QR} from "../2fa"
import config from '../config';

class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        // reset login status       

        this.state = {
            username: '',
            password: '',
            code: '',
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
    render() {
        const { loggingIn } = this.props;
        const { username, password, submitted,code } = this.state;
        const { alert } = this.props;

        let alertHtml = alert && alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>
        let loginButton = this.props.active2fa == false && this.props.force2fa=="force" 
            ? <LoginButton credentials={{username,password,code}}></LoginButton> 
            : ""
        
        const options =  { transports: ['websocket'] };
        const uri = config.websocketUrl
        return <div className="login">
                <img style={{width:"200px"}} src={logo} alt="Logo" />
                <h4 className="mb-5">IPanel</h4>
                <h2>Login</h2>
                
                    <div className={'form-group' + (submitted && !username ? ' has-error' : '')}>
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control" name="username" value={username} onChange={this.handleChange} />
                        {submitted && !username &&
                            <div className="help-block">Username is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" name="password" value={password} onChange={this.handleChange} />
                        {submitted && !password &&
                            <div className="help-block">Password is required</div>
                        }
                    </div>
                    <Code credentials={{username,password}}/>                    
                    {loginButton}
                    {alertHtml}

            </div>
    }
}

function mapState(state) {
    const { loggingIn,alert,active2fa, force2fa,loginStatus} = state.authentication;
    return { loggingIn,alert,active2fa, force2fa,loginStatus };
}

const actionCreators = {
    login: userActions.login,
    logout: userActions.logout
};

const connectedLoginPage = connect(mapState, actionCreators)(LoginPage);
export { connectedLoginPage as LoginPage };