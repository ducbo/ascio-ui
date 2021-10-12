import React from 'react';
import { connect } from 'react-redux';
import { AllowedRoles, BlockLink } from "./_components";
function NavLeft(props) {
    if (props.user) {
        return (
            <div id="nav-left">
                <AllowedRoles roles={["admin"]}>
                    <BlockLink href="/logs" selected={props.selected}>Logs</BlockLink>
                </AllowedRoles>
                <BlockLink href="/dns-manager" selected={props.selected}>Zones</BlockLink>
                <AllowedRoles roles={["admin","user_editor"]}>
                    <BlockLink href="/users" selected={props.selected}>Accounts</BlockLink>
                    <BlockLink href="/workers" selected={props.selected}>Workers</BlockLink>
               </AllowedRoles>         
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
