import React from 'react';
import { Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { alertActions } from './_actions'; 
import {  FaExclamationTriangle, FaCheck, FaTimes, FaClock, FaLock, FaInfo, FaComments, FaBug } from 'react-icons/fa';
function AlertSuccess (props) {
	const iconMap = {
		"alert-info" : <FaClock/>,
		"alert-success" : <FaCheck/>,
		"alert-danger" : <FaTimes/>
	}
	if( props.type==="alert-success" || props.type==="alert-danger") {
		window.setTimeout(() => {
			props.clear ()
		},5000)
	}
	const className = "navi-alert  "+ (props.type || "")
	if (props.type) {			
		if (props.progress) {
			return <Alert className={className} variant="primary">{props.progress || props.message}</Alert>
		} else if (props.success) {
			return <Alert className={className} variant="success">{props.success|| props.message}</Alert>
		} else if (props.error) {
			return <Alert className={className} variant="danger">{props.error}</Alert>
		} else return  <Alert className={className} variant={props.variant}>{iconMap[props.type]}{props.message}</Alert>
	} else return ""


}

const actionCreators = {
	clear: alertActions.clear
}
function mapState(state) {
	const {alert} = state
	const  { progress, success, error,message,type } = alert;
	return  { progress, success, error,message,type } 
}
const connectedAlertSuccess = connect(mapState, actionCreators)(AlertSuccess);
export default connectedAlertSuccess 