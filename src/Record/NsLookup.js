import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import React from "react";
import { connect } from 'react-redux';
import { nameswitchActions } from '../_actions';

class  NsLookup extends React.Component {
    constructor(props) {
        super(props);        
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
  const connectedNsLookup = connect(null, actionCreators)(NsLookup)
  export {connectedNsLookup as NsLookup}