import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from 'react-redux';
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import { userTreeActions } from '../_actions';

const useStyles = makeStyles({
  root: {
    marginBottom: "50px",
    flexGrow: 1,
    maxWidth: 400
  }
});

function ImpersonateTree(props) {
  const classes = useStyles();  
  const user = props.user.user  
  const storageId = 'customer_tree_' + user.username
  let initialData = JSON.parse(localStorage.getItem(storageId))
  if(!initialData) {
    initialData =  {
      root: [
        {
          id: props.id,
          label: props.name,
          hasChildren: true
        }
      ],
      1: []
    }
  }
  let initialExpanded =  JSON.parse(localStorage.getItem(storageId+"_expanded"))  ||  []
  
  let [tree, setTree] = useState(initialData);  
  let [expanded, setExpanded] = useState(props.expanded || initialExpanded);  
  // user selector activated
  if(props.expanded && (expanded !== props.expanded)) {
    setExpanded(props.expanded)
    localStorage.setItem(storageId+"_expanded", JSON.stringify(props.expanded))  
    for(let i = 0; i < props.expanded.length; i++) {
      const node = props.expanded[i]
      if(expanded.indexOf(node) < 0) {
        props.getChildren(node).then(children => {
          buildTree(node,children)                  
        })     
      }
    }
  }
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
  const onNodeSelect = async (event, user) => { 
    const impersonate = {
      username: user,
      name: props.selectableUsers[user]
    }
    localStorage.setItem(storageId+"_selected", JSON.stringify(impersonate))      
    await props.setImpersonate(impersonate)
  }
  const buildTree = function(name,nodes) {
      const newChildren = {
        ...tree,
        [name] : nodes.children.map(child => {
          return {
            id : child.id,
            label : child.name,
            hasChildren : child.hasChildren
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
      let childrenNodes =
        tree[child.id] && tree[child.id].length > 0
          ? renderTree(tree[child.id])
          : child.hasChildren ?  <div key={child.key}></div> : []
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
      selected={(props.impersonate && props.impersonate.username) || selectedStorage}
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
  const { refresh,data, impersonate, expanded, selectableUsers } = usertree;
  return { user,refresh, data, impersonate,updatedUser, expanded, selectableUsers };
}
const connectedTreeView = connect(mapState, actionCreators)(ImpersonateTree)
export default connectedTreeView 