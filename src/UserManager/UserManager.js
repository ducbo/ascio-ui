import React, { Component } from "react";
import { connect } from 'react-redux';
import {CreateUser, Users} from '../UserManager'
import NavProtected from '../NavProtected.js'

class UserManager extends Component {
    constructor(props) {
        super(props);
        this.state = { selectedSubUserManager: []};
        this.user = this.props.user.user
        this.isWorker = props.location.pathname.search("/workers") > -1
    }
    render() {
        return (
            <>
               <NavProtected>
                 <CreateUser isWorker={this.isWorker}></CreateUser>
                 <Users isWorker={this.isWorker}/>  
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
