module.exports.Message = require("./Message")
module.exports.UserMessage = require("./UserMessage")
module.exports.ZoneMessage = require("./ZoneMessage")
module.exports.RecordMessage = require("./RecordMessage")

module.exports.createMessage = (messageData) => {
    if( module.exports[messageData.messageClass] ) {
        return new module.exports[messageData.messageClass](messageData)
    } else {
        return new module.exports.Message(messageData)
    }
}