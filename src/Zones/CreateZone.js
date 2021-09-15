import React from 'react';
import { connect } from 'react-redux';
import { zoneActions } from '../_actions';
import { Button, Form, Col } from 'react-bootstrap';
import { Combobox } from 'react-widgets';
import {defaultZoneFilters}  from '../defaults';
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
		this.setState({[e.target.name] : e.target.value});
	}
	async submit() {
		const filters = this.props.filterParams || defaultZoneFilters(this.user.username);
		await this.props.createZone(this.state.zoneName, this.state.user.id, this.state.api, filters);
	}
	validate() {
		if(! (this.state.zoneName && this.state.user)) {
			return false;
		}
		if(!this.state.zoneName.match(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/)) {
			return false; 
		}
		return true;
	}
	render() {
		const self = this;
		let onChange = (user) => {
			self.setState({user});
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
		const disabled = !this.validate() ? "disabled" : false
		return (      
			<div className="mb-1">
			 <AllowedRoles roles={["admin","zone_editor"]}>
			 <div className="card">
			 <div className="card-header">
                    <h5>Create Zone</h5>
                </div>
                <div className="card-body">
					<Form>
						<Form.Row>
							<Col>
								<Form.Control name="zoneName" placeholder="Zonename" onChange={this.handleChange} />
							</Col>
							<Col>
								<Combobox onChange={onChange} valueField="id" textField="name" data={users} />
							</Col>
							<Col>						
								<Button disabled={disabled} onClick={this.submit}>CreateZone</Button>
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
	createZone: zoneActions.create
};
function mapState(state) {
	const { authentication } = state;
	const { user } = authentication;
	const { zones, filterParams } = state.zones;
	const { rootDescendants } = state.usertree;
	return { user, zones, filterParams, rootDescendants};
}
const connectedCreateZone = connect(mapState, actionCreators)(CreateZone);
export {connectedCreateZone as CreateZone};
