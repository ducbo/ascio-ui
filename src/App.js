import React from 'react';
import { 
	Router,
	Route,
	Switch,
	Redirect
} from 'react-router-dom';
import { connect } from 'react-redux';
import { history } from './_helpers';
import { alertActions, userActions, recordActions, zoneActions } from './_actions';
import { PrivateRoute } from './_components';
import { LoginPage } from './LoginPage';
import { PasswordResetPage } from './PasswordResetPage';
import { RegisterPage } from './RegisterPage';
import {DnsManager} from './DnsManager';
import {UserManager} from './UserManager';
import {Zone} from './Zone';
import {defaultZoneFilters}  from './defaults';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';



class App extends React.Component {
	constructor(props) {
		super(props);
		this.user = this.props.user ? this.props.user.user : localStorage.getItem('user');
		const self = this;		
		const reAuth =  function() {
			console.log("user:",self.user)
			window.setTimeout(async () => {				
				if(self.user) {
					await props.reAuth();
					if(self.props.user) {
						self.reconnectSocket(self.props.user.token );
						console.log("reauth socket: ",self.props.user.token )
					}
					reAuth()
				}
				
			}, 60*10*1000)
		}
		reAuth()
		history.listen((location, action) => {
			//clear alert on location change
			//this.props.clearAlerts();
		});
	}
	componentDidMount() {
		if(this.props.user) {	
			const self = this		
			this.connectSocket(this.props.user.token)
			window.setTimeout(function() {
				self.props.socket.on("ascio:objects", function(message) {			
					if(message.data.record)	 {
						self.updateRecordSocket(message)
					} else if (message.data.zone) {
						self.props.filter(defaultZoneFilters(self.props.user.user.username)); 
					}
				}) 
			},1)						
		}
	}
	updateRecordSocket(data) {
		console.log("updateRecordSocket", data)
		if(data.data.zoneName !== this.props.records.zoneName) {
			console.log("wrong zone")
			return
		}
		switch(data.action) {
			case "update" : this.props.updateRecordSocket(data.data.record); break
			case "delete" : this.props.deleteRecordSocket(data.data.record); break
			case "create" : this.props.createRecordSocket(data.data.record); break
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
				<Router history={history}>
					<Switch>
						<Route exact path="/" >
							<Redirect to="/dns-manager" />
						</Route>
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
	const {  authentication,records  } = state;
	const { user,socket,token } = authentication;	
	return { user,authentication,socket,token,records};
}

const actionCreators = {
	clearAlerts: alertActions.clear,
	reAuth: userActions.reAuth,
	setSocket : userActions.setSocket,
	updateRecordSocket : recordActions.updateSocket,
	createRecordSocket : recordActions.createSocket,
	deleteRecordSocket : recordActions.deleteSocket,
	filter : zoneActions.filter
};

const connectedApp = connect(mapState, actionCreators)(App);
export default connectedApp ;
