import React from 'react';
import { Alert } from 'react-bootstrap';
import { connect } from 'react-redux';

class Status extends React.Component {
	render() {
		const className = "in "+this.props.className

        const error =  this.props.error
        const success =  this.props.success 
        const progress =  this.props.progress

        if (progress) {
			return <Alert className={className} variant="secondary">{progress}</Alert>
		} else 
        if (success) {
			return <Alert className={className} variant="success">{success}</Alert>
		} else 
        if (error) {
			return <Alert className={className} variant="danger">{error.message || error}</Alert>
		} else return ""
	}
}
function mapState(state) {
	const { progress, errror, success } = state.status;
	return { progress, errror, success};
}
const connectedStatus = connect(mapState, null)(Status);
export default connectedStatus;