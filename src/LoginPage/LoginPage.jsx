import React from 'react';
import { connect } from 'react-redux';
import logo from '../logo-black.svg';
import { userActions } from '../_actions';
import { LoginButton, Code } from '../2fa';

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
		const { username, password, submitted, code } = this.state;
		const { alert } = this.props;

		let alertHtml = alert && alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>;
		let loginButton =
			this.props.active2fa === false && this.props.force2fa === 'force' ? (
				<LoginButton credentials={{ username, password, code }} />
			) : (
				''
			);
		return (
			<div className="login">
				<img style={{ width: '100%' }} src={logo} alt="Logo" />
				<div className="card mb-4 rounded-3 shadow-sm mt-5">
					<div className="card-header py-3">
						<h4 className="my-0 fw-normal">Login</h4>
					</div>
					<div className="card-body">
						<div className={'form-group' + (submitted && !username ? ' has-error' : '')}>
							<label htmlFor="username">Username</label>
							<input
								type="text"
								className="form-control"
								name="username"
								value={username}
								onChange={this.handleChange}
							/>
							{submitted && !username && <div className="help-block">Username is required</div>}
						</div>
						<div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
							<label htmlFor="password">Password</label>
							<input
								type="password"
								className="form-control"
								name="password"
								value={password}
								onChange={this.handleChange}
							/>
							{submitted && !password && <div className="help-block">Password is required</div>}
						</div>
						<Code credentials={{ username, password }} />
						{loginButton}
						{alertHtml}
					</div>
				</div>
			</div>
		);
	}
}

function mapState(state) {
	const { loggingIn, alert, active2fa, force2fa, loginStatus } = state.authentication;
	return { loggingIn, alert, active2fa, force2fa, loginStatus };
}

const actionCreators = {
	login: userActions.login,
	logout: userActions.logout
};

const connectedLoginPage = connect(mapState, actionCreators)(LoginPage);
export { connectedLoginPage as LoginPage };
