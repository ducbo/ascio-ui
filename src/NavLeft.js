import React from 'react';
import { connect } from 'react-redux';
import { userActions } from './_actions';
function NavTop(props) {
    if (props.user) {
        return (
            <div id="nav-left">
               <div><a href="/dns-manager">Zones</a></div>
            </div>
        );
     } else {
         return "";
     }

}
const actionCreators = {
	createZone: userActions.logout
};
function mapState(state) {
	const { authentication } = state;
	const { user } = authentication;
	return { user };
}
const connectedNavTop = connect(mapState, actionCreators)(NavTop);
export default connectedNavTop;
