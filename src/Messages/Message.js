module.exports = class Message {
    constructor(messageData) {
        for(const key in messageData) {
            this[key] = messageData[key]
        }
    }
    getTitle() {
        return "["+this.loginUser.username+"] " + this.action.charAt(0).toUpperCase() + this.action.slice(1) + " "+ this.dataClass + ": "+ this.objectName
    }
    getMessage() {
        return this.message
    }
}