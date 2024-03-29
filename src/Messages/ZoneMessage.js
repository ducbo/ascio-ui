const {Message} = require(".")

class ZoneMessage extends Message {
    getTitle() {
        return "["+this.loginUser.username+"] " + this.action.charAt(0).toUpperCase() + this.action.slice(1) + " "+ this.dataClass + ": "+ this.objectName
    }
    getMessage() {
        return this.message
    }
}
export  {ZoneMessage}