import { connect } from 'react-redux';
import { userActions } from '../_actions';
import { history } from '../_helpers';
import React from 'react';

class LoginButton extends React.Component {
    constructor (props) { 
        super(props)
        this.login = this.login.bind(this);
        this.state = {
            loggingIn : false
        }
    }
    async login() {
        const {username,password,code} = this.state 
        this.setTree({logginIn: true});
        await this.props.login(username, password, code)
        this.setTree({logginIn: false});
        history.push("/dns-manager")
    }
    render() {
        return <><button className="btn btn-primary" onClick={this.login}>Login</button>
        {this.state.loggingIn &&  <img alt="wait" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
        }
        </>
    }
}

function mapState(state) {
    const {  authentication } = state;
    const { code,user } = authentication;
    return { code,user };
}

const actionCreators = {
    activate2fa: userActions.activate2fa 
};

const LoginButtonConnected = connect(mapState, actionCreators)(LoginButton);
export {LoginButtonConnected as LoginButton}