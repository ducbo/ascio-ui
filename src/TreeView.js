import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from 'react-redux';
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import defaultZoneFilters from './defaults'
import { zoneActions } from './_actions';
import { userTreeActions } from './_actions';
import { history } from './_helpers';

const useStyles = makeStyles({
  root: {
    marginBottom: "50px",
    flexGrow: 1,
    maxWidth: 400
  }
});

function CustomerTreeItem(props) {
  const classes = useStyles();  
  const user = props.user.user  
  const storageId = 'customer_tree_' + user.username
  let initialData = JSON.parse(localStorage.getItem(storageId))
  if(!initialData) {
    initialData =  {
      root: [
        {
          id: props.id,
          label: props.name
        }
      ],
      1: []
    }
  }
  let initialExpanded = JSON.parse(localStorage.getItem(storageId+"_expanded"))
  initialExpanded = initialExpanded || []
  const selectedItems = {}
  const [tree, setTree] = useState(initialData);  

  const onNodeSelect = async (event, users) => { 
    const filterParams = props.filterParams || defaultZoneFilters(user.username)
    filterParams.users = users
    filterParams.page = 1
    localStorage.setItem(storageId+"_selected", JSON.stringify(users))  
    localStorage.setItem('defaultZoneFilters_' + user.username, JSON.stringify(filterParams))
    await props.filter(filterParams, props.zones)
    if(window.location.pathname!=="/dns-manager") {
      history.push("/dns-manager")
    }
  }
  const buildTree = function(name,nodes) {
    {
      const newChildren = {
        ...tree,
        [name] : nodes.children.map(child => {
          return {
            id : child.id,
            label : child.name
            }
          }
        )
      }
      setTree(newChildren);
      localStorage.setItem(storageId, JSON.stringify(newChildren))  
    }
  }
  const onNodeToggle = (event, nodeId) => {
    localStorage.setItem(storageId+"_expanded", JSON.stringify(nodeId))         
    if(nodeId.length > initialExpanded.length) {    
      initialExpanded = nodeId  
      return props.getChildren(nodeId[0])
        .then(children => {
            buildTree(nodeId[0],children)  
                  
        })         
    } else {
      
    }    
  };
  const renderTree = children => {
    return children.map(child => {
      const childrenNodes =
        tree[child.id] && tree[child.id].length > 0
          ? renderTree(tree[child.id])
          : [<div key={child.id} />];

      return (
        <TreeItem key={child.id} nodeId={child.id} label={child.label}>
          {childrenNodes}
        </TreeItem>
      );
    });
  };
  const renderedChildren = renderTree(tree.root)
  const selected = JSON.parse(localStorage.getItem(storageId+"_selected")) || []
  return (
    <TreeView
      key="tree"
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      onNodeToggle={onNodeToggle}
      onNodeSelect={onNodeSelect}
      expanded={initialExpanded}
      selected={selected}
    >
      {renderedChildren}
    </TreeView>
  );
}

const actionCreators = {
  filter: zoneActions.filter,
  getChildren : userTreeActions.getChildren
}

function mapState(state) {
  const {  authentication } = state;
  const { user } = authentication;
  const { filterParams,zones } = state.zones;
  return { user, filterParams , zones};
}
const connectedTreeView = connect(mapState, actionCreators)(CustomerTreeItem)
export default connectedTreeView 