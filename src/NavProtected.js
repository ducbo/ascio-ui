import { connect } from 'react-redux';
import NavTop from './NavTop';
import NavLeft from './NavLeft';
import Wait from './Wait'
import logo from './logo.png';
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
             <div className="col-2" style={{minWidth:"230px"}}>
					<img style={{width:"200px"}} src={logo} alt="Logo" />
					<h4 className="mb-5">DNS-Manager</h4>									
						<NavLeft></NavLeft>
						<CustomerTreeItem key={user.username} id={user.username} name={user.company}/>						
                    </div>
                    <div className="col-10">
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