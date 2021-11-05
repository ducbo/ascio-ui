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
        console.log("usertreeselector",value)
        this.props.requestExpanded(value.id)
        this.props.setImpersonate({username:value.id, name: value.name})      
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
    return { impersonate: state.usertree.impersonate };
  }
  const UserTreeSelectorConnected = connect(mapState, actionCreators)(UserTreeSelector)
  export default UserTreeSelectorConnected 