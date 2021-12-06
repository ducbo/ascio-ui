import { store } from 'react-notifications-component';

const maxSize = 100
const lastMessages = []

function notify(title,message,key) {
    if(lastMessages.includes(key)) {
        return
    } else {
        store.addNotification({
            title: title,
            id: key,
            message: message,
            type: "success",
            insert: "top",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],						
            dismiss: {
              duration: 2500,
              pauseOnHover: true,
              onScreen: true
            }
        });
        lastMessages.push(key)
        if(lastMessages.length >= maxSize) {
            lastMessages.shift()
        }
    }
}
export {notify}
