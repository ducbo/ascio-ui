import React from 'react';
import { Alert } from 'react-bootstrap';

class AlertSuccess extends React.Component {
	render() {
        if (this.props.progress) {
			return <Alert className="in" variant="secondary">{this.props.progress}</Alert>
		} else if (this.props.success) {
			return <Alert className="in" variant="success">{this.props.success}</Alert>
		} else if (this.props.error) {
			return <Alert className="in" variant="danger">{this.props.error}</Alert>
		} else return ""
	}
}
export default AlertSuccess;
