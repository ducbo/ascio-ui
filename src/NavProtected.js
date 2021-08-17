import { connect } from 'react-redux';
import { alertActions } from './_actions';
import NavTop from './NavTop';
import NavLeft from './NavLeft';
import Wait from './Wait'
import CustomerTreeItem from './TreeView.js'


function NavProtected (props) {
	const user = props.user.user
	const className = `alert ${props.alert.type} fadeInDown animated`
	window.setTimeout(() => {
		if(props.message) props.clearAlerts()
	},5000)
    return   <> 
			<NavTop></NavTop>
			<div className="container">
			 <div className="row">
				<div className="col-2 col-md-4 col-lg-2">					
					<NavLeft selected={props.selected}></NavLeft>
					<hr/>
					<h4>Impersonate</h4>
					<CustomerTreeItem key={user.username} id={user.username} name={user.company}/>						
					</div>
					<div className="col-lg-10 col-md-12 col-sm-12">
						{props.children}
					</div>
				</div>               
				<Wait></Wait>
				{props.message && <div style={{position:"absolute", marginLeft: "200px", top: "5px", left:"100px", padding: "3px 10px 3px 10px"}} className={className}>{props.message}</div>}
			</div>
			</>
}
function mapState(state) {
	const {  authentication, alert } = state;
    const { user } = authentication;
    const { message, type } = alert;
	return { alert, message, type, user,authentication };
}

const actionCreators = {
	clearAlerts: alertActions.clear,
};

const connectedNavProtected = connect(mapState, actionCreators)(NavProtected);
export default connectedNavProtected ;