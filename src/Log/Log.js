import React, { Component } from "react";
import { connect } from 'react-redux';
import {LogTable} from './LogTable'
import { userTreeActions } from '../_actions';
import NavProtected from '../NavProtected.js'

class Log extends Component {
    constructor(props) {
        super(props);
        this.state = { selectedSubUsers: []};
        this.user = this.props.user.user
    }
    componentDidMount() {

    }
    render() {
        return (
            <>
                <NavProtected  selected={this.props.location.pathname}>
                <div className="card">
                    <div className="card-header">
                        <h5>View logs for account {this.props.impersonate.name}</h5>
                    </div>
                    <div className="card-body card-table">
                    <LogTable/>
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
    const { rootDescendants, impersonate } = state.usertree
    return { user,  rootDescendants, impersonate };
}
const connectedLog = connect(mapState, actionCreators)(Log)
export { connectedLog as Log}
