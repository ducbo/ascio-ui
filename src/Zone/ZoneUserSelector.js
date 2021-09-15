import React from 'react';
import {UserSelector} from '../UserManager'
import PropTypes from 'prop-types'
import { zoneActions,alertActions } from '../_actions';
import { connect } from 'react-redux';
import { AllowedRoles } from "../_components";

function ZoneUserSelector(props) {
  const onChange = async (user) => {
    if(!user) return
    props.progress("Updating owner of zone "+props.zoneName);
    await props.updateOwner(props.zoneName, user.id)
    if(props.onChange) {
        await props.onChange(user)
    }
    props.success("Owner of zone " + props.zoneName + " changed to "+ user.name + ".",)
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
    selected: PropTypes.object,
    onChange: PropTypes.func,
    zones: PropTypes.object
};

const actionCreators = {
  success : alertActions.success,
	progress: alertActions.progress,
  updateOwner: zoneActions.updateOwner
}
function mapState(state) {
	const { zones } = state;
	return { zones };
} 
const connectedZoneUserSelector = connect(mapState, actionCreators)(ZoneUserSelector)
export {connectedZoneUserSelector as ZoneUserSelector}