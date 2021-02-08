import React from 'react';
import { Alert } from 'react-bootstrap';

class AlertSuccess extends React.Component {
	render() {
		const className = "in "+this.props.className
		if (this.props.progress) {
			return <Alert className={className} variant="secondary">{this.props.progress}</Alert>
		} else if (this.props.success) {
			return <Alert className={className} variant="success">{this.props.success}</Alert>
		} else if (this.props.error) {
			return <Alert className={className} variant="danger">{this.props.error}</Alert>
		} else return ""
	}
}
export default AlertSuccess;
