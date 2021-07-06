import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import React from "react";
import { connect } from 'react-redux';
import { nameswitchActions } from '../_actions';

class  NameSwitch extends React.Component {
    constructor(props) {
        super(props);
        const user = JSON.parse(localStorage.getItem('user'));
        this.username = user.user.username
        let long = localStorage.getItem("nameswitch_"+this.username);
        long = long == "true"
        this.props.set(long)
        this.state = {long}
    }
    onChange = (long) => {
        this.props.set(long)
        this.setState({long})
        localStorage.setItem("nameswitch_"+this.username,long)
    }
    render () {
        return <>Long Names: <BootstrapSwitchButton
            checked={this.state.long}
            onlabel='On'
            offlabel='Off'
            onChange={this.onChange}
    /></>
   }

}
const actionCreators = {
    set: nameswitchActions.set
  }
  const connectedNameSwitch = connect(null, actionCreators)(NameSwitch)
  export {connectedNameSwitch as NameSwitch}