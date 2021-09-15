import React, { Component } from 'react';

class RecordField extends Component {
	constructor(props) {
		super(props);
	}
	onChange = (e) =>  {
		this.setState({[e.target.name] : e.target.value});
	}
	render() {
        const name = this.props.name
        const value = this.props.value
		const input = (
			<input
				type="text"
				name={name}
				className="form-control"
				id={'input' + name}
				value={value}
				onChange={this.onChange}
				placeholder={name | this.props.placeholder}
			/>
		);
		return (
			<div className="form-group row">
				<label htmlFor={'input' + name} className="col-sm-2 col-form-label">
					{name}
				</label>
				<div className="col-sm-10">{input}</div>
			</div>
		);
	}
}
export default RecordField