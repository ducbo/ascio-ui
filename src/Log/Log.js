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
                    <LogTable/>
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
const connectedLog = connect(mapState, actionCreators)(Log)
export { connectedLog as Log}
