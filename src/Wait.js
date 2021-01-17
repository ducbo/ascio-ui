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
  console.log("wait", props)
  if(props.progress || props.loading) {
    return (
        <div className={classes.root}>
          <CircularProgress />
        </div>
      );
  }
  return false;

}
function mapState(state) {
    const { progress } = state.zones;
    const { loading } = state.records;
    return {progress,loading};
}
const connectedWait = connect(mapState, {})(Wait)
export default connectedWait  