import React from 'react';
import {  FaExclamationTriangle, FaCheck, FaTimes, FaClock, FaLock, FaInfo, FaComments, FaBug } from 'react-icons/fa';

class LogLevel extends React.Component {    
    constructor (props) { 
        super(props);
        this.def = this.getDef()
        this.levelsArray = this.def
        this.levels = {}              
        this.def.forEach((level) => {
            this.levels[level.name] = level
        })

    }
    getDef() {
        return [
            {
                name : "completed",
                color: "black",
                backgroundColor:null,
                icon: <FaCheck style={{color:"darkgreen"}}/>
            },
            {
                name : "failed",
                color: "black",
                backgroundColor:null,
                icon: <FaTimes style={{color:"darkred"}}/>
            },
            {
                name : "waiting",
                color: "black",
                backgroundColor:null,
                icon: <FaClock style={{color:"grey"}}/>
            },
            {
                name : "security",
                color: "darkred",
                backgroundColor:null,
                icon: <FaLock style={{color:"darkred"}}/>
            }, 
            {
                name : "error",
                color: "darkred",
                backgroundColor:null,
                icon:  <FaExclamationTriangle style={{color:"grey"}}/>
            },        
            {
                name : "warn",
                color: "black",
                backgroundColor:null,
                icon: <FaExclamationTriangle style={{color:"yellow"}}/>
            },
            {
                name : "info",
                color: "black",
                backgroundColor:null,
                icon: <FaInfo style={{color:"yellow"}}/>
            },
            {
                name : "verbose",
                color: "black",
                backgroundColor:null,
                icon: <FaComments style={{color:"yellow"}}/>
            },
            {
                name : "debug",
                color: "grey",
                backgroundColor:null,
                icon:  <FaBug style={{color:"grey"}}/>
            },
        ]
    }
    formatForTable() {
        const out = {}
        this.levelsArray.forEach((level) => {
            out[level.name] = level.name
        })
        return out
    }
    getLevel(name) {
        return this.levels[name]
    }
    render() {
        const level = this.getLevel(this.props.name)
        return <span style={{color:level.color, backgroundColor: level.backgroundColor}}>
            {level.icon } {level.name}
        </span>
    }
}

const formatForTable = () => {
    const level = new LogLevel()
    return level.formatForTable()
}

export {LogLevel}
export {formatForTable}