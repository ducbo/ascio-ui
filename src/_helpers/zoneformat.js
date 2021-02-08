function trimDot(value)  {
    return value.replace(/\.$/gm,'')
}
function toFQDN(zoneName, recordContent) {
    if(recordContent.endsWith(zoneName)) {
        return recordContent; 
    }
    if(recordContent === "@") {
        recordContent = zoneName
    } else if(!recordContent.endsWith(".")) {
        recordContent =  recordContent + "."  + zoneName
    } 
    return recordContent
}
function toShortName(zoneName, recordContent) {
    if(recordContent === "@") {
        recordContent =  "@"
    } else if(recordContent.match(/.*@.*/)) {
        // do nothing
    } else if(trimDot(recordContent) === zoneName) {
        recordContent = "@"
    } else if(trimDot(recordContent).endsWith(zoneName)) {
        recordContent =  trimDot(recordContent.replace(zoneName,""))
    }
    return recordContent
}
function fromFQDN (zoneName, recordContent) {
    if(recordContent === zoneName) {
        recordContent = "@"
    } else {
        recordContent = toShortName(zoneName,recordContent)
    }
    return recordContent
}
   
module.exports.recordToApi = function (zoneName, record,api) {
    if(api === "Ascio") {
        record.Source = toFQDN(zoneName,record.Source)
        if(["CNAME","SRV","NS"].includes(record._type )) {
            record.Target = toFQDN(zoneName,record.Target)
        }
    } else {
        record.Source = toShortName(zoneName,record.Source)
        if(["CNAME","SRV","NS"].includes(record._type )) {
            record.Target = toShortName(zoneName,record.Target)
        }
    }
    return record
}
module.exports.recordFromApi = function (zoneName, record,api) {
    if(api === "Ascio") {
        record.Source = fromFQDN(zoneName,record.Source)
        if(record._type === "CNAME") {
            record.Target = fromFQDN(zoneName,record.Target)
        } 
    }     
    return record  
}
module.exports.recordsFromApi = function (zone) {
    zone.Records.Record.forEach(function (record) {
        module.exports.recordFromApi(zone.ZoneName, record,zone.api)
    })
}