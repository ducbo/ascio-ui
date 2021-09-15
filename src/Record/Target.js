import React, { Component } from 'react';
import fields from './fields';
import RecordField from './RecordField'
class Target extends Component {
	constructor(props) {
		super(props);
	}
	onChange = (e) =>  {
		this.setState({[e.target.name] : e.target.value});
	}
	render() {
		const placeHolder = fields[this.state._type].targetDescription;
		return <RecordField props={props} placeHolder={placeHolder}></RecordField>
	}
}
function mapState(state) {
	const { nameswitch } = state;
	return { nameswitch };
}
const connectedTarget = connect(mapState, actionCreators)(Target);
export { connectedTarget as Target };

// convert name when switching nameswitch
// validate target with dig