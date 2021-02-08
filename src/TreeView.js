import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from 'react-redux';
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import { userTreeActions } from './_actions';

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
  let initialExpanded =  JSON.parse(localStorage.getItem(storageId+"_expanded"))  ||  []
  
  let [tree, setTree] = useState(initialData);  
  let [expanded, setExpanded] = useState(initialExpanded);  
  
  if(props.updatedUser) {
    Object.keys(tree).forEach((key) => {
      tree[key].forEach(child => {
        if(child.id === props.updatedUser.username) {
          child.label = props.updatedUser.company
        }
      });
    })
    localStorage.setItem(storageId, JSON.stringify(tree))  
  }

  if(props.data) Object.keys(props.data).forEach(key => {
    tree[key] = props.data[key]
  })
  const onNodeSelect = async (event, users) => { 
    localStorage.setItem(storageId+"_selected", JSON.stringify(users))      
    await props.setImpersonate(users)
  }
  const buildTree = function(name,nodes) {
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
  const onNodeToggle = (event, nodeId) => {
    localStorage.setItem(storageId+"_expanded", JSON.stringify(nodeId))  
    setExpanded(nodeId)     
    props.setExpanded(nodeId)     
    if(nodeId.length > initialExpanded.length) {    
      initialExpanded = nodeId  
      return props.getChildren(nodeId[0])
        .then(children => {
            buildTree(nodeId[0],children)  
                  
        })         
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
  const selectedStorage = JSON.parse(localStorage.getItem(storageId+"_selected")) || []
  return <>
    <TreeView
      key="tree"
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      onNodeToggle={onNodeToggle}
      onNodeSelect={onNodeSelect}
      expanded={expanded || initialExpanded}
      selected={props.impersonate || selectedStorage}
    >
      {renderedChildren}
    </TreeView>
  </>;
}

const actionCreators = {
  getChildren : userTreeActions.getChildren,
  setImpersonate : userTreeActions.impersonate,
  setData : userTreeActions.setData,
  setExpanded : userTreeActions.setExpanded,
}

function mapState(state) {
  const {  authentication, usertree, users } = state;
  const { user } = authentication;
  const {updatedUser} = users
  const { refresh,data, impersonate } = usertree;
  return { user,refresh, data, impersonate,updatedUser };
}
const connectedTreeView = connect(mapState, actionCreators)(CustomerTreeItem)
export default connectedTreeView 