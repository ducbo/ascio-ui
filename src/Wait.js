import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    position: 'absolute',
    top: "50%",
    left: "50%"
  },
}));

function Wait(props) {
  const classes = useStyles();
  if(props.progress || props.loading) {
    return (
        <div className={classes.root}>
          <CircularProgress />
        </div>
      );
  }
  return false;

}
function createStatus(state,module) {
	if(!state[module]) {
		return null
	}
	const  { loading } = state[module];
	if(loading) {
		return  { loading } 
	}
	return null
}
function mapState(state) {
	return  	createStatus(state,"alert")  ||
    createStatus(state,"zones") ||
		createStatus(state,"records") ||
		createStatus(state,"users") ||
		createStatus(state,"workers") || 
		createStatus(state,"authentication") || 
		createStatus(state,"usertree") 
	
}
const connectedWait = connect(mapState, {})(Wait)
export default connectedWait  