import React, { Component } from "react";
import { connect } from 'react-redux';
import {CreateZone, Zones} from '../Zones'
import NavProtected from '../NavProtected.js'

class DnsManager extends Component {
    constructor(props) {
        super(props);
        this.state = { selectedSubUsers: []};
        this.user = this.props.user.user
    }
    render() {
        return (
            <>
               <NavProtected  selected={this.props.location.pathname}>
                <CreateZone></CreateZone>
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
function mapState(state) {
    const {  authentication } = state;
    const { user } = authentication;
    const { rootDescendants } = state.usertree
    return { user,  rootDescendants };
}
const connectedDnsManager = connect(mapState, null)(DnsManager)
export { connectedDnsManager as DnsManager}
