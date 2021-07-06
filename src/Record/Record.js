import React, { Component } from 'react';
import { connect } from 'react-redux';
import { recordActions } from '../_actions';
import { recordToApi, recordFromApi } from '../_helpers';
import { TTL } from './TTL';
import { RedirectionType } from './RedirectionType';
import fields from './fields';
import {RecordInfo}  from './RecordInfo';

function renderInfoText(zone, Source, Target, text, _type) {
	const record = { Source, Target, _type };
	if ((Source && Target) || _type === 'SOA') {
		const newRecord = recordToApi(zone, record, 'Ascio');
		const dot = fields[_type].dot
		let dotText = ""
		if(dot && (Target.indexOf(".") > -1)) {
			dotText = <span>Please add a  <b>dot</b> at the end for a targets outside of  {zone}</span>
		}
		return (
			<span>
				<b>{newRecord.Source}</b> {text} <b>{newRecord.Target}</b><br></br>
				{dotText}
			</span>
		);
	} else {
		return 'Please enter Source and Target';
	}
}

class Record extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: props.data || { TTL: 3600, RedirectionType: 'Permanent' },
			zone: props.zone,
			action: props.action,	
		};
		this.onChange = this.onChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.setNewType = this.setNewType.bind(this);
		this.nameswitch = false
	}
	componentDidUpdate() {
		console.log('Record component update');
	}
	onChange(e) {
		this.useNameswitch = false; 
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
	renderField(field,data) {
		const typeFields = fields[this.state.data._type];
		const placeHolder = field == 'Target' ? typeFields.targetDescription : field;
		let input = '';
		switch (field) {
			case 'RedirectionType':
				input = <RedirectionType onChange={this.onChange} value={data[field]} />;
				break;
			default:
				input = (
					<input
						type="text"
						name={field}
						className="form-control"
						id={'input' + field}
						value={data[field]}
						onChange={this.onChange}
						placeholder={placeHolder}
					/>
				);
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
		const data = this.getConvertedData(this.state.data)	
		typeFields.list.forEach((field) => {
			if (field == 'TTL') return;
			html.push(self.renderField(field,data));
		});
		return html;
	}
	getConvertedData() {
		if(this.props.nameswitch === this.nameswitch) {
			console.log("same",this.state.data)
			return this.state.data
		}
		if(this.props.nameswitch) {
			const newRecord = recordToApi(this.props.zone, {...this.state.data} , "Ascio")
			this.nameswitch =  this.props.nameswitch
			this.setState({data: newRecord})
			console.log("long format",newRecord)
			return newRecord
        } else {
			const newRecord = recordFromApi(this.props.zone, {...this.state.data} , "Ascio")
			this.nameswitch =  this.props.nameswitch
			this.setState({data: newRecord})
			console.log("long format",newRecord)
			return newRecord		
		}

		

	}
	validate() {
		if(! (this.state.data.Target && this.state.data.Target)) {
			return false;
		}
		return true;
	}
	renderCreateForm(ttl, use) {
		const self = this
		let html = [];
		let updating = self.state.updating;
		let message = '';
		const typeFields = fields[this.state.data._type];
		const data = this.getConvertedData(this.state.data)
		typeFields.list.forEach((field) => {
			html.push(self.renderField(field, data));
		});
		if(!this.validate()) {
			updating = "disabled";
		}
		let type = '';
		if (use.type) {
			type = (
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
							<option>NS</option>
							<option>WebForward</option>
							<option>MailForward</option>
						</select>
					</div>
				</div>
			);
		}
		return <>
				<div className="row">
					<div className="col-md-2">						
						{type}
						<TTL onChange={this.onChange} value={ttl} />
					</div>
					<div className="col-md-8">{this.renderFields()}</div>
				</div>
				<div className="row">
					<div className="col-md-2">
						<button
							className="btn btn-primary"
							disabled={updating}
							action={this.state.action}
							id={this.state.data.Id}
							onClick={this.handleSubmit}
						>
							{this.state.action} record
						</button>
					</div>
					<div className="col-md-8">
						{' '}
						<div className="alert alert-secondary" role="alert">
							<RecordInfo record={{...self.state.data}} zone={self.props.zone} text={typeFields.text}></RecordInfo>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-md-10">{message}</div>
				</div>
		</>
	}
	renderTTL(value) {
		return <TTL onChange={this.onChange} value={value} />;
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
						{error || this.state.error}
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

		let form = '';
		if (this.state.action == 'create') {
			form = this.renderCreateForm(3600, { type: true });
		} else {
			form = this.renderCreateForm(this.state.data.TTL, {});
		}

		return (
			<div key={this.state.data.Id}>
				{form}
				
			</div>
		);
	}
}

const actionCreators = {
	updateRecord: recordActions.update,
	createRecord: recordActions.create
};
function mapState(state) {
	const { users, authentication, records,nameswitch } = state;
	const { user } = authentication;
	return { user, users, records, nameswitch };
}
const connectedRecord = connect(mapState, actionCreators)(Record);
export { connectedRecord as Record };
