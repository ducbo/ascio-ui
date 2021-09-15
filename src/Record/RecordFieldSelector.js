import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RedirectionType } from './RedirectionType';
import fields from './fields';

function RecordFieldSelector(props) {
	switch (props._type) {
		case "Source": 			return <Source data={props}></Source>
		case "Target": 			return <Target data={props}></Target>
		case "TTL": 			return <TTL data={props}></TTL>
		case "RedirectionType": return <RedirectionType onChange={props.onChange} value={props.value} />
		default:  				return <RecordField data={props}></RecordField>
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
