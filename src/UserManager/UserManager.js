import React, { Component } from "react";
import { connect } from 'react-redux';
import {CreateUser, Users} from '../UserManager'
import NavProtected from '../NavProtected.js'

class UserManager extends Component {
    constructor(props) {
        super(props);
        this.state = { selectedSubUserManager: []};
        this.user = this.props.user.user
    }
    render() {
        return (
            <>
               <NavProtected>
                 <CreateUser></CreateUser>
                 <Users/>  
                </NavProtected> 
            </>
        )
    }
}
function mapState(state) {
    const {  authentication } = state;
    const { user } = authentication;
    return { user };
}
const connectedUserManager = connect(mapState,{})(UserManager)
export { connectedUserManager as UserManager}
