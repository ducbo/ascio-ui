module.exports.Message = require("./Message").Message
module.exports.UserMessage = require("./UserMessage").UserMessage
module.exports.ZoneMessage = require("./ZoneMessage").ZoneMessage
module.exports.RecordMessage = require("./RecordMessage").RecordMessage

module.exports.createMessage = (messageData) => {
    if( module.exports[messageData.messageClass] ) {
        return new module.exports[messageData.messageClass](messageData)
    } else {
        return new module.exports.Message(messageData)
    }
}