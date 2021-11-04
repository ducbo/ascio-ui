import React from 'react';
import { connect } from 'react-redux';
import { zoneActions, alertActions } from '../_actions';
import { Button, Form, Col } from 'react-bootstrap';
//import { Combobox } from 'react-widgets';
import { defaultZoneFilters } from '../defaults';
import { AllowedRoles } from '../_components';
import { UserSelector } from '../UserManager';

class CreateZone extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: '',
			zoneName: ""
		};
		this.user = this.props.user.user;
	}
	setUser = (user) => {
		this.setState({ user });
	};
	handleChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};
	componentDidUpdate = () => {
		console.log("update")
	}
	submit = async () => {
		const self = this;
		const username = this.state.user.id;
		const filter = defaultZoneFilters(this.user.username);
		this.props.progress('Creating zone ' + this.state.zoneName + ' for user ' + username);
		await this.props.createZone(this.state.zoneName, username, this.state.api, filter);
		self.props.message(self.props.zones);
		this.setState({ zoneName: '' });
	};
	validate() {
		if (!(this.state.zoneName && this.state.user)) {
			return false;
		}
		if (!this.state.zoneName.match(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/)) {
			return false;
		}
		return true;
	}
	getImpersonated() {
		return this.props.impersonate || defaultZoneFilters(this.user.username).users || this.user.username;
	}
	render() {
		const api = (
			<AllowedRoles roles={[ 'admin' ]}>
				<Form.Row>
					<Col md="5">
						<Form.Label>API</Form.Label>
						<Form.Control as="select" name="api" onChange={this.handleChange} custom>
							<option>Ascio</option>
							<option>Hetzner</option>
						</Form.Control>
					</Col>
				</Form.Row>
			</AllowedRoles>
		);
		const disabled = !this.validate() ? 'disabled' : false;
		const selected = this.getImpersonated()
		console.log('selected: ', selected);
		return (
			<div className="mb-1">
				<AllowedRoles roles={[ 'admin', 'zone_editor' ]}>
					<div className="card">
						<div className="card-header">
							<h5>Create Zone</h5>
						</div>
						<div className="card-body">
							<Form>
								<Form.Row>
									<Col>
										<Form.Control
											name="zoneName"
											placeholder="Zonename"
											value={this.state.zoneName}
											onChange={this.handleChange}
										/>
									</Col>
									<Col>
										<UserSelector
											id={'create-' + this.state.zoneName}
											onChange={this.setUser}
											selected={selected}
										/>
									</Col>
									<Col>
										<Button disabled={disabled} onClick={this.submit}>
											CreateZone
										</Button>
									</Col>
								</Form.Row>
								{api}
							</Form>
						</div>
					</div>
				</AllowedRoles>
			</div>
		);
	}
}
const actionCreators = {
	message: alertActions.message,
	progress: alertActions.progress,
	createZone: zoneActions.create
};
function mapState(state) {
	const { authentication, zones } = state;
	const { user } = authentication;
	const {  impersonate, selectableUsers } = state.usertree;
	return { user, zones, impersonate, selectableUsers };
}
const connectedCreateZone = connect(mapState, actionCreators)(CreateZone);
export { connectedCreateZone as CreateZone };
