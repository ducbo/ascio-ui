import React from 'react';
import { connect } from 'react-redux';
function NavLeft(props) {
    if (props.user) {
        return (
            <div id="nav-left">
               <div><a href="/dns-manager">Zones</a></div>
               <div><a href="/users">Users</a></div>
               <div><a href="/workers">Workers</a></div>
            </div>
        );
     } else {
         return "";
     }

}

function mapState(state) {
	const { authentication } = state;
	const { user } = authentication;
	return { user };
}
const connectedNavLeft = connect(mapState, {})(NavLeft);
export default connectedNavLeft;
