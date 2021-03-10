import { connect } from 'react-redux';
import NavTop from './NavTop';
import NavLeft from './NavLeft';
import Wait from './Wait'
import logo from './logo.svg';
import CustomerTreeItem from './TreeView.js'


function NavProtected (props) {
	const user = props.user.user
	if(!props.user) {
		console.log("logout")
		return ""
	}
    return   <> 
			<NavTop></NavTop>
			<div className="container">
			 {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
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
			</div>
			</>
}
function mapState(state) {
	const {  authentication } = state;
    const { user } = authentication;
	const { alert } = state;
	return { alert, user,authentication };
}

const actionCreators = {
	
};

const connectedNavProtected = connect(mapState, actionCreators)(NavProtected);
export default connectedNavProtected ;