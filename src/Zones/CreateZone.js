import React from 'react';
import { connect } from 'react-redux';
import { zoneActions } from '../_actions';
import { Button, Form, Col } from 'react-bootstrap';
import { Combobox } from 'react-widgets';
import defaultZoneFilters  from '../defaults';
import AlertSuccess from '../AlertSuccess';
import { AllowedRoles } from "../_components";

class CreateZone extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: '',
			zoneName: null
		};
		this.handleChange = this.handleChange.bind(this);
		this.submit = this.submit.bind(this);
		this.user = this.props.user.user;
	}
	handleChange(e) {
		this.state[e.target.name] = e.target.value;
		this.setState(this.state);
	}
	submit() {
		const filters = this.props.filterParams || defaultZoneFilters(this.user.username);
		this.props.createZone(this.state.zoneName, this.state.user.id, this.state.api, filters);
	}
	render() {
		const self = this;
		let onChange = (user) => {
			this.state.user = user;
			self.setState(this.state);
		};
		const api = (
			<AllowedRoles roles={["admin","zone_editor"]}>
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
		
   	 const users = this.props.rootDescendants || [];    
		return (      
			<div className="mb-1">
			 <AllowedRoles roles={["admin","zone_editor"]}>
			 <Form>
					<Form.Row>
						<Col>
							<Form.Control name="zoneName" placeholder="Zonename" onChange={this.handleChange} />
						</Col>
						<Col>
							<Combobox onChange={onChange} valueField="id" textField="name" data={users} />
						</Col>
						<Col>						
							<Button onClick={this.submit}>CreateZone</Button>
						</Col>
					</Form.Row>          
					{api}
          <Form.Row>
            <Col className="mt-2">
              <AlertSuccess 
                success={this.props.success}
                progress={this.props.progress}
                error={this.props.error}
              ></AlertSuccess>
            </Col>
          </Form.Row>
				</Form>
			 </AllowedRoles>

			</div>
		);
	}
}
const actionCreators = {
	createZone: zoneActions.create
};
function mapState(state) {
	const { authentication } = state;
	const { user } = authentication;
	const { zones, filterParams, progress, success, error } = state.zones;
	const { rootDescendants } = state.usertree;
	return { user, zones, filterParams, rootDescendants, progress, success, error };
}
const connectedCreateZone = connect(mapState, actionCreators)(CreateZone);
export {connectedCreateZone as CreateZone};
