import React from "react";
import { UserSelector } from ".";
import { userTreeActions} from "../_actions"
import { connect } from 'react-redux';

class UserTreeSelector extends React.Component {
    test = () =>  {
        console.log("click")
        //this.props.setExpanded(["tucows","ascio"])   
        this.props.requestExpanded("softgarden")
        this.props.setImpersonate({username:"softgarden", name: "Softgarden"})        
    }
    onChange =  async(value) => {
        const impersonate = {username:value.id, name: value.name}
        this.props.requestExpanded(value.id)
        this.props.setImpersonate(impersonate)   
        const storageId = 'customer_tree_' + this.props.user.username
        localStorage.setItem(storageId+"_selected", JSON.stringify(impersonate))         
    }
    render () {
        return  <>
                <button className="btn btn-default" onClick={this.test}>tucows/ascio/epag</button>
                <UserSelector
                    selected = {this.props.impersonate}
                    onChange = {this.onChange}
                    id = "tree-selector"
                ></UserSelector>

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