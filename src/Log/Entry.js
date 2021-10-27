import React from 'react';

class Entry extends React.Component{
    constructor (props) {
        super(props)
        for(const key in props.data) {
            this[key] = props.data[key]
        }
        this.exclude =  ["_clientIdSearch","_clientIdSearch","_parent","_objectName","_dbDate","deleted","key","Id"]
    }
    replaceKey(key) {
        const map = {
            "_type" : "Type",
            "_clientId" : "Owner"
        }
        return map[key] || key
    }
    renderSingle(data) {
        const entries = Object.keys(data).map(key => {
            let element = data[key]
            if(this.exclude.includes(key)  || key.endsWith("Search")) {
                return ""
            }
            if(element instanceof Object) {
                element = JSON.stringify(element)
            }
            return <tr>
                <th>{this.replaceKey(key)}</th>
                <td>{element}</td>
            </tr>
        });
        return <>
             <h4>{this.message}</h4>
            <table class="table table-dark table-sm striped" style={{width:"400px"}}>
                <tr>
                    <th style={{width:"150px"}}>Property</th>
                    <th>Value</th>
                </tr>
            {entries}
            </table>
        </>
    }
    renderOldNew(data) {
        const entries = Object.keys(data).map(key => {
            const element = data[key]
            if(this.exclude.includes(key)  || key.endsWith("Search")) {
                return ""
            }
            return <tr>
                <th>{this.replaceKey(key)}</th>
                <td>{element.old}</td>
                <td>{element.new}</td>
            </tr>
        });
        return <>
            <h4>{this.message}</h4>
            <table class="table table-dark table-sm striped" >
                <tr>
                    <th style={{width:"150px"}}>Property</th>
                    <th>Old value</th>
                    <th>New value</th>
                </tr>
            {entries}
            </table>
        </>
    }
    render () {
        if(this.data) {
            return this.renderOldNew(this.data)
        } if(this.oldData || this.newData) {
            return this.renderSingle(this.oldData || this.newData)
        }  else return ""   
    }

}
export {Entry}