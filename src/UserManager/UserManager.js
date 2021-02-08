import React, { Component } from "react";
import { connect } from 'react-redux';
import {CreateUser, CreateWorker, Users, Workers} from '../UserManager'
import NavProtected from '../NavProtected.js'
import { workerActions } from '../_actions';
import {defaultWorkerFilters} from '../defaults.js'

class UserManager extends Component {
    constructor(props) {
        super(props);
        this.state = { selectedSubUserManager: []};
        this.user = this.props.user.user
        const searchFilters = defaultWorkerFilters(this.user.username)
        this.props.setWorkerFilters(searchFilters)
        this.isWorker = props.location.pathname.search("/workers") > -1
    }
    render() {
        const users = this.isWorker ?  <Workers/> :  <Users />  
        const create  = this.isWorker ?   <CreateWorker/> :  <CreateUser/>  
        return (
            <>
               <NavProtected selected={this.props.location.pathname}>
                 {create}
                 {users}
               </NavProtected> 
            </>
        )
    }
}
const actionCreators = {
    setWorkerFilters: workerActions.setFilter,
  }
function mapState(state) {
    const {  authentication } = state;
    const { user } = authentication;
    return { user };
}
const connectedUserManager = connect(mapState,actionCreators)(UserManager)
export { connectedUserManager as UserManager}
