import React from 'react';
import { 
	Router,
	Route,
	Switch,
	Redirect
} from 'react-router-dom';
import { connect } from 'react-redux';
import {defaultZoneFilters}  from './defaults';
import { history } from './_helpers';
import ReactNotification from 'react-notifications-component' 
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'
import 'animate.css';

import { alertActions, logActions, userActions, recordActions, zoneActions } from './_actions';
import {ReAuth} from './_helpers';
import { PrivateRoute } from './_components';
import { LoginPage } from './LoginPage';
import { PasswordResetPage } from './PasswordResetPage';
import { RegisterPage } from './RegisterPage';
import {DnsManager} from './DnsManager';
import {Log} from './Log';
import {UserManager} from './UserManager';
import {Zone} from './Zone';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { userTreeActions } from './_actions';
import { createMessage } from "./Messages"

class App extends React.Component {
	constructor(props) {
		super(props);
		this.user = this.props.user ? this.props.user.user : localStorage.getItem('user');
		const self = this;
		const re =  React.createElement("h2",ReAuth)
		let timer;						
		const reAuth =  function() {
			timer = window.setTimeout(async () => {				
				if(window.location.pathname !== "/login" && props.user) {
					await props.reAuth();
					self.reconnectSocket(props.user.token );
				}		
				reAuth()
			}, 60*10*1000) 
		}
		reAuth()
	}
	componentDidMount() {
		if(this.props.user) {	
			const self = this		
			this.connectSocket(this.props.user.token)
			const impersonatedJson = localStorage.getItem('customer_tree_'+self.props.user.user.username+'_selected');
			let impersonated = null
			if(impersonatedJson) {
				impersonated = JSON.parse(impersonatedJson)
				self.props.setImpersonate(impersonated)
			}
			window.setTimeout(function() {
				self.props.socket.on("ascio:objects", function(message) {			
					if(message.data.record)	 {
						self.updateRecordSocket(message)
					} else if (message.data.zone) {
						let action = "none"
						switch(message.action) {
							case "create" : action = "Created" ; break; 
							case "update" : action = "Updated" ; break; 
							case "delete" : action = "Deleted" ; break; 
							case "sync" : action = "Synced" ; break; 
							default : action = message.action;
						}
						self.props.filter(defaultZoneFilters(self.props.user.user.username)); 
						self.props.success(action + " zone: " + message.data.zone.ZoneName);						
					}
				}) 
				self.props.socket.on("ascio.log", function(data) {						
					if(self.props.logFilters) {
						self.props.filterLogs(self.props.logFilters)	
					}
					if(data.level !== "completed") return 
					const message = createMessage(data)
					store.addNotification({
						title: message.getTitle(),
						id: data.key,
						message: message.getMessage(),
						type: "success",
						insert: "top",
						container: "top-right",
						animationIn: ["animate__animated", "animate__fadeIn"],
						animationOut: ["animate__animated", "animate__fadeOut"],						
						dismiss: {
						  duration: 5000,
						  pauseOnHover: true,
						  onScreen: true
						}
					  });
				}) 
			},1)						
		}
	}
	updateRecordSocket(data) {
		if(data.data.zoneName !== this.props.records.zoneName) {
			return
		}		
		const record = data.data.record
		const message = record._type+" record with Source: "+ record.Source
		switch(data.action) {
			case "update" : this.props.updateRecordSocket(record); this.props.success("Updated "+ message); break
			case "delete" : this.props.deleteRecordSocket(record); this.props.success("Deleted "+ message);break
			case "create" : this.props.createRecordSocket(record); this.props.success("Created "+ message);break
			default: break;
		}
	}
	connectSocket (token) { 
		const socket =  this.props.setSocket(token)			 
		return socket
	}
	reconnectSocket (token) {
		if(this.props.socket) {
			this.props.socket.disconnect()
		}
		this.connectSocket(token)
	}
	render() {
		return (
			<> 
				<ReactNotification/>
				<Router history={history}>
					<Switch>
						<Route exact path="/" >
							<Redirect to="/dns-manager" />
						</Route>
						<PrivateRoute path="/logs" exact component={Log} />
						<PrivateRoute path="/dns-manager" exact component={DnsManager} />
						<PrivateRoute path="/users" exact component={UserManager} />
						<PrivateRoute path="/workers" exact component={UserManager} />
						<PrivateRoute path="/zone/:zoneName" component={Zone} />
						<Route path="/login" component={LoginPage} />
						<Route path="/password-reset/:token" component={PasswordResetPage} />
						<Route path="/register" component={RegisterPage} />						
						<Redirect from="*" to="/" />
					</Switch>
				</Router> 				   
			</>
		);
	}
}
function mapState(state) {
	const {  authentication,log,records  } = state;
	const {  filters } = log;
	const { user,socket,token } = authentication;	
	return { user,authentication,socket,token,records, logFilters: filters};
}

const actionCreators = {
	clearAlerts: alertActions.clear,
	success: alertActions.success,
	reAuth: userActions.reAuth,
	setSocket : userActions.setSocket,
	setImpersonate : userTreeActions.impersonate,
	updateRecordSocket : recordActions.updateSocket,
	createRecordSocket : recordActions.createSocket,
	deleteRecordSocket : recordActions.deleteSocket,
	filter : zoneActions.filter,
	filterLogs : logActions.filter,
	refreshZones: zoneActions.refresh
};

const connectedApp = connect(mapState, actionCreators)(App);
export default connectedApp ;
