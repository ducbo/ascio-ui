import { connect } from 'react-redux';
import { alertActions } from './_actions';
import NavTop from './NavTop';
import NavLeft from './NavLeft';
import Wait from './Wait'
import ImpersonateTree from './UserManager/ImpersonateTree.js'


function NavProtected (props) {
	const user = props.user.user
	//const className = `alert ${props.alert.type} fadeInDown animated`
    return   <> 
			<NavTop></NavTop>
			<div className="container">
			 <div className="row">
				<div className="col-2 col-md-4 col-lg-2">					
					<NavLeft selected={props.selected}></NavLeft>
					<hr/>
					<h4>Impersonate</h4>
					<ImpersonateTree key={user.username} id={user.username} name={user.company}/>						
					</div>
					<div className="col-lg-10 col-md-12 col-sm-12">
						{props.children}
					</div>
				</div>               
				<Wait></Wait>				
			</div>
			</>
}
function mapState(state) {
	const {  authentication, alert } = state;
    const { user } = authentication;
    const { message, type } = alert;
	return { message, type, user,authentication };
}

const actionCreators = {
	clearAlerts: alertActions.clear,
};

const connectedNavProtected = connect(mapState, actionCreators)(NavProtected);
export default connectedNavProtected ;