import React from 'react';
import { connect } from 'react-redux';
import { userActions } from './_actions';
import logo from './logo.svg';

function NavTop(props) {
    if (props.user) {
        return (
            <div id="nav-top">
            <img style={{marginLeft:"20px", width:"200px"}} src={logo} alt="Logo" />
                <div className="logout">
                <a onClick={props.logout} href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                        <path d="M0 0h24v24H0z" fill="white" />
                        <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                    </svg>{' '}
                    Logout {props.user.user ? props.user.user.username : ""}
                    </a>
                </div>
            </div>
        );
     } else {
         return "";
     }
}
const actionCreators = {
	logout: userActions.logout
};
function mapState(state) {
	const { authentication } = state;
	const { user } = authentication;
	return { user };
}
const connectedNavTop = connect(mapState, actionCreators)(NavTop);
export default connectedNavTop;
