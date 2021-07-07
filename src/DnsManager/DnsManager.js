import React, { Component } from "react";
import { connect } from 'react-redux';
import {CreateZone, Zones} from '../Zones'
import { userTreeActions } from '../_actions';
import NavProtected from '../NavProtected.js'

class DnsManager extends Component {
    constructor(props) {
        super(props);
        this.state = { selectedSubUsers: []};
        this.user = this.props.user.user
    }
    componentDidMount() {
        this.props.getRootDescendants(this.user.username)
    }
    render() {
        return (
            <>
               <NavProtected  selected={this.props.location.pathname}>
            <div className="card record-inputs">
                <div className="card-header">
                    <h5>Create Zone</h5>
                </div>
                <div className="card-body">
                    <CreateZone></CreateZone>
                </div>
            </div>
                <div className="card">
                    <div className="card-header">
                        <h5>Edit Zones</h5>
                    </div>
                    <div className="card-body card-table">
                        <Zones/> 
                </div>
            </div>
                </NavProtected> 
            </>
        )
    }
}
const actionCreators = {
    getRootDescendants : userTreeActions.getRootDescendants
}
function mapState(state) {
    const {  authentication } = state;
    const { user } = authentication;
    const { rootDescendants } = state.usertree
    return { user,  rootDescendants };
}
const connectedDnsManager = connect(mapState, actionCreators)(DnsManager)
export { connectedDnsManager as DnsManager}
