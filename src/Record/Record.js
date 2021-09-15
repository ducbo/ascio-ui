import React, { Component } from 'react';
import { connect } from 'react-redux';
import { recordActions } from '../_actions';
import { recordToApi, recordFromApi } from '../_helpers';
import { TTL } from './TTL';
import { RedirectionType } from './RedirectionType';
import { alertActions } from '../_actions'; 
import { RecordInfo } from '.';
import fields from '../Record/fields';

class Record extends Component {
	constructor(props) {
		super(props);
		const data = props.data || { TTL: 3600, RedirectionType: 'Permanent' }
		this.state = {...data};
		this.onChange = this.onChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.setNewType = this.setNewType.bind(this);
		this.nameswitch = false
	}
	onChange(e) {
		this.useNameswitch = false; 
		this.setState({[e.target.name] : e.target.value});
	}
	setNewType(event) {
		this.setState({_type: event.target.value });
	}
	displayCreateForm() {
		if (this.props.action !== 'create') return '';
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
	async handleSubmit() {		
		if (this.state.Id) {
			this.props.progress("Updating record in " + this.props.zone);
			await this.props.updateRecord(this.props.zone, this.state);			
		} else {
			this.props.progress("Creating record in " + this.props.zone);
			await this.props.createRecord(this.props.zone, this.state);
			this.setState({Source : "", Target: ""})
		}
		this.props.message(this.props.records)
	}
	renderField(field,data) {
		const typeFields = fields[this.state._type];
		const placeHolder = field === 'Target' ? typeFields.targetDescription : field;
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
		const typeFields = fields[this.state._type];	
		const data = this.getConvertedData(this.state)	
		typeFields.list.forEach((field) => {
			if (field === 'TTL') return;
			html.push(self.renderField(field,data));
		});
		return html;
	}
	getConvertedData() {
		if(this.props.nameswitch === this.nameswitch) {
			return this.state
		}
		if(this.props.nameswitch) {
			const newRecord = recordToApi(this.props.zone, {...this.state} , "Ascio")
			if(newRecord.Target && (!newRecord.Target.indexOf(this.props.zone) && newRecord.Target.indexOf("."))) {
				const last = newRecord.Target.slice(newRecord.Target.length - 1,  newRecord.Target.length)
				if(last !== ".") {
					newRecord.Target += "."
				}
			}
			this.nameswitch =  this.props.nameswitch
			this.setState({data: newRecord})
			return newRecord
        } else {
			const newRecord = recordFromApi(this.props.zone, {...this.state} , "Ascio")
			this.nameswitch =  this.props.nameswitch
			this.setState({data: newRecord})
			return newRecord		
		}

		

	}
	validate() {
		if(! (this.state.Target && this.state.Target)) {
			return false;
		}
		return true;
	}
	renderCreateForm(ttl, use) {
		const self = this
		let html = [];
		let updating = self.state.updating;
		let message = '';
		const typeFields = fields[this.state._type];
		const data = this.getConvertedData(this.state)
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
							action={this.props.action}
							id={this.state.Id}
							onClick={this.handleSubmit}
						>
							{this.props.action} record
						</button>
					</div>
					<div className="col-md-8">
						{' '}
						<div className="alert alert-secondary" role="alert">
							<RecordInfo record={{...self.state}} zone={self.props.zone} {...typeFields}></RecordInfo>
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
		let form = '';
		if (this.props.action === 'create') {
			form = this.renderCreateForm(3600, { type: true });
		} else {
			form = this.renderCreateForm(this.state.TTL, {});
		}

		return (
			<div>
				{form}				
			</div>
		);
	}
}

const actionCreators = {
	message : alertActions.message,
	progress: alertActions.progress,
	updateRecord: recordActions.update,
	createRecord: recordActions.create
};
function mapState(state) {
	const { records,nameswitch } = state;
	return { records, nameswitch };
}
const connectedRecord = connect(mapState, actionCreators)(Record);
export { connectedRecord as Record };
