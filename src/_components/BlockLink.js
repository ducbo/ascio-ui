import React from 'react';

export const BlockLink =  (props) => {
    const className = props.href == props.selected ? "active" : "inactive"
    console.log(props)
    return <div><a href={props.href} className={className}>{props.children}</a></div>
}
export default BlockLink