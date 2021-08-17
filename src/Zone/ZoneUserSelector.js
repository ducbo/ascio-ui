import React from 'react';
import {UserSelector} from '../UserManager'
import PropTypes from 'prop-types'
import { zoneActions } from '../_actions';
import { connect } from 'react-redux';
import { AllowedRoles } from "../_components";

function ZoneUserSelector(props) {
  const onChange = (user) => {
    props.updateOwner(props.zoneName, user.id)
    if(props.onChange) {
        props.onChange(user)
    }
  }
  return (<>
    <AllowedRoles roles={["admin","zone_editor"]}>
      <UserSelector
        id={props.zoneName}
        onChange={onChange}
        selected={props.selected}
    /></AllowedRoles>
      <AllowedRoles>
          {props.selected}
      </AllowedRoles>
    </>

  );
}
ZoneUserSelector.propTypes = {
    zoneName: PropTypes.string.isRequired,
    selected: PropTypes.string,
    onChange: PropTypes.func
};

const actionCreators = {
    updateOwner: zoneActions.updateOwner
} 
const connectedZoneUserSelector = connect(null, actionCreators)(ZoneUserSelector)
export {connectedZoneUserSelector as ZoneUserSelector}