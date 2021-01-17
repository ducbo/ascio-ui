import React, { Component } from 'react';
import { connect } from 'react-redux';
import { recordActions } from '../_actions';
import { recordToApi } from '../_helpers';
import { Combobox } from 'react-widgets';
import {TTL} from './TTL'
import {RedirectionType} from './RedirectionType'


function renderInfoText(zone,Source,Target,text,_type) {
		const record = {Source, Target, _type}		
		if((Source && Target) || _type === "SOA") {
			const newRecord = recordToApi(zone,record,"Ascio")
            return <span><b>{newRecord.Source}</b> {text} <b>{newRecord.Target}</b></span>
        } else {
            return "Please enter Source and Target"
        }
    
    
}

const fields = {
	A: {
		list: [ 'Source', 'Target', 'TTL' ],
		targetDescription: 'IPv4 Address',
		text: "will point to"
	},
	AAAA: {
		list: [ 'Source', 'Target', 'TTL' ],
		targetDescription: 'IPv6 Address',
		text: "will point to"
	},
	CNAME: {
		list: [ 'Source', 'Target', 'TTL' ],
		targetDescription: 'Alias',
		text: "will be an alias of"
	},
	MX: {
		list: [ 'Source', 'Target', 'TTL', 'Priority' ],
		targetDescription: 'Mail server',
		text: "will handle mail exchange for"
	},
	TXT: {
		list: [ 'Source', 'Target', 'TTL' ],
		targetDescription: 'Content',
		text: "will include"
	},
	NS: {
		list: [ 'Source', 'Target', 'TTL' ],
		targetDescription: 'Name Server',
		text: "will be managed by"
	},
	SRV: {
		list: [ 'Source', 'Target', 'TTL', 'Priority', 'Weight', 'Port' ],
		targetDescription: 'Target',
		text: "will be serviced by"
	},
	SOA: {
		list: [ 'Source', 'TTL', 'Expire', 'HostmasterEmail', 'PrimaryNameServer', 'Refresh', 'Retry' ],
		targetDescription: 'Value',
		text: "will be defined by",
		type: "SOA"
	},
	MailForward: {
		list: [ 'Source', 'Target', 'TTL' ],
		targetDescription: 'Email Address',
		text: "will forward to"
	},
	WebForward: {
		list: [ 'Source', 'Target', 'TTL','RedirectionType' ],
		targetDescription: 'Website URL',
		text: "will redirect to"
	}
};

class Record extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: props.data || {TTL: 3600, RedirectionType: "Permanent"},
			zone: props.zone,
			action: props.action
		};
		this.onChange = this.onChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.setNewType = this.setNewType.bind(this);
	}
	componentDidUpdate() {
		console.log('Record component update');
	}
	onChange(e) {
		this.state.data[e.target.name] = e.target.value;
		this.setState(this.state);
	}
	setNewType(event) {
		this.state.data._type = event.target.value;
		this.setState(this.state);
	}
	displayCreateForm() {
		if (this.state.action !== 'create') return '';
		const html = (
			<div>
				<div className="form-group row">
					<label htmlFor="typeSelect" className="col-sm-2 col-form-label">
						Type
					</label>
					<div className="col-sm-10">
						<select id="typeSelect" className="form-control" onChange={this.setNewType}>
							<option>A</option>
							<option>AAAA</option>
							<option>CNAME</option>
							<option>TXT</option>
							<option>SRV</option>
							<option>MX</option>
							<option>MX</option>
							<option>WebForward</option>
							<option>MailForward</option>
						</select>
					</div>
				</div>
			</div>
		);
		return html;
	}
	handleSubmit() {
		if (this.state.data.Id) {
			this.props.updateRecord(this.state.zone, this.state.data);
		} else {
			this.props.createRecord(this.state.zone, this.state.data);
		}
	}
	renderField(field) {
		const typeFields = fields[this.state.data._type];
		const placeHolder = field == 'Target' ? typeFields.targetDescription : field;
		let input = ""
		switch (field) {
			case "RedirectionType" : input = <RedirectionType onChange={this.onChange} value={this.state.data[field]}></RedirectionType>; break;
			default: input = <input	type="text"	name={field} className="form-control" id={'input' + field} value={this.state.data[field]} onChange={this.onChange} placeholder={placeHolder}/>
		}	
		return (
			<div className="form-group row">
				<label htmlFor={'input' + field} className="col-sm-2 col-form-label">
					{field}
				</label>
				<div className="col-sm-10">{input}</div>
			</div>
		);
	}
	renderFields() {
		let html = [];
		const self = this;
		const typeFields = fields[this.state.data._type];
		typeFields.list.forEach((field) => {
            if(field=="TTL") return;
			html.push(self.renderField(field));
		});
		return html;
	}
	renderCreateForm(ttl,use) {
		let type = "";
		if(use.type) {
			type = <div className="form-group row">
			<label htmlFor="typeSelect" className="col-sm-2 col-form-label">
				Type
			</label>
			<div className="col-sm-10">
				<select id="typeSelect" className="form-control" onChange={this.setNewType}>
					<option>A</option>
					<option>AAAA</option>
					<option>CNAME</option>
					<option>TXT</option>
					<option>SRV</option>
					<option>MX</option>
					<option>NS</option>
					<option>WebForward</option>
					<option>MailForward</option>
				</select>
			</div>
		</div>
		}
		return (
			<div>
				<div className="row">
				<div className="col-md-2">
					 {type}
					 <TTL onChange={this.onChange} value={ttl}></TTL>		
				</div>
				<div className="col-md-8">{this.renderFields()}</div>
				</div>				
			</div>
		);
	}
	renderTTL(value) {
		return <TTL onChange={this.onChange} value={value}></TTL>		
	}
	render() {
		let html = [];
		const self = this;
		let message = '';
		const { error, success } = this.props.records;
		if (
			this.props.records.recordId == this.props.data.Id ||
			(this.props.records.newRecord == true && this.props.action == 'create')
		) {
			if (error) {
				message = (
					<div className="alert alert-danger  mt-2 col-md-12" role="alert">
						{error}
					</div>
				);
			}
			if (success) {
				message = (
					<div className="alert alert-success   mt-2 col-md-12" role="alert">
						{this.props.action == 'create' ? 'Create record successful' : 'Update record successful'} 
					</div>
				);
			}
		}
		const typeFields = fields[this.state.data._type];
		typeFields.list.forEach((field) => {
			html.push(self.renderField(field));
		});
		let form = '';
		if (this.state.action == 'create') {
			form = this.renderCreateForm(3600,{type:true});
		} else {
			form = this.renderCreateForm(this.state.data.TTL,{});
		}

		return (
			<div key ={this.state.data.Id}>
				{form}
				<div className="row">
					<div className="col-md-2">
						<button
							className="btn btn-primary"
							disabled={self.state.updating}
							action={this.state.action}
							id={this.state.data.Id}
							onClick={this.handleSubmit}
						>
							{this.state.action} record
						</button>
					</div>
					<div className="col-md-8"> <div className="alert alert-secondary" role="alert">
                    {renderInfoText(
						self.props.zone,
						self.state.data.Source,
						self.state.data.Target || self.state.data.PrimaryNameServer,
						typeFields.text,
						self.state.data._type
						)}
					</div></div>
				</div>
				<div className="row">
					<div className="col-md-10">
					{message}
					</div>
				
				</div>
			</div>
		);
	}
}

const actionCreators = {
	updateRecord: recordActions.update,
	createRecord: recordActions.create
};
function mapState(state) {
	const { users, authentication, records } = state;
	const { user } = authentication;
	return { user, users, records };
}
const connectedRecord = connect(mapState, actionCreators)(Record);
export {connectedRecord as Record};
