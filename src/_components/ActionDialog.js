import React from 'react';
import PropTypes from 'prop-types'
import {Modal, Button} from 'react-bootstrap'

class ActionDialog extends React.Component {
    doAction = () => {
		this.props.progress("Deleting zone "+this.state.deleteZoneName)
        this.props.action(this.objectValue)
		this.props.hide()
		this.props.message(this.props.zoneMessage) 

    }
	render() {
		return (<>
			<Modal style={{ opacity: 1 }} show={this.props.show} onHide={this.props.hide}>
				<Modal.Header closeButton>
					<Modal.Title>{this.props.title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>{this.props.body}</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={this.props.hide}>
						Close
					</Button>
					<Button variant="primary" id={this.props.objectValue} onClick={this.props.action}>
						{this.props.buttonText}
					</Button>
				</Modal.Footer>
			</Modal>
			</>
		);
	}
}
ActionDialog.propTypes = {
    objectName : PropTypes.string.isRequired,
    objectValue : PropTypes.string.isRequired,
    show : PropTypes.bool.isRequired,
	hide : PropTypes.func.isRequired,
    action : PropTypes.func.isRequired,
    title : PropTypes.string.isRequired,
    body : PropTypes.string.isRequired,
    buttonText : PropTypes.string.isRequired,
}
export { ActionDialog };

//Delete {this.props.objectName}: {this.props.objectValue}
//Do you want to delete the {this.props.objectName} {this.props.objectValue}?