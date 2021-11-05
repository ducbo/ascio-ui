import React from "react";
import { UserSelector } from ".";
import { userTreeActions} from "../_actions"
import { connect } from 'react-redux';

class UserTreeSelector extends React.Component {
    onChange =  async(value) => {
        if(!value) {
            return
        }
        const impersonate = {username:value.id, name: value.name}
        let worker = null
        if(this.props.user.type === "worker") {
            worker = this.props.user.username
        }
        this.props.requestExpanded(value.id, worker)
        this.props.setImpersonate(impersonate)   
        const storageId = 'customer_tree_' + this.props.user.username
        localStorage.setItem(storageId+"_selected", JSON.stringify(impersonate))         
    }
    render () {
        return  <>
                <UserSelector
                    selected = {this.props.impersonate}
                    onChange = {this.onChange}
                    id = "tree-selector"
                ></UserSelector><hr></hr>

            </>
    }

}

const actionCreators = {
    setImpersonate : userTreeActions.impersonate,
    setExpanded : userTreeActions.setExpanded,
    requestExpanded : userTreeActions.requestExpanded,
  }
  
  function mapState(state) {
    const {user} = state.authentication
    return { 
        user: user.user, 
        impersonate: state.usertree.impersonate 
    };
  }
  const UserTreeSelectorConnected = connect(mapState, actionCreators)(UserTreeSelector)
  export default UserTreeSelectorConnected 