import { userConstants } from '../_constants';
import config from '../config';
import socketIOClient from "socket.io-client";

let storedUser = localStorage.getItem('user')
let user = storedUser !== "undefined" ? JSON.parse(storedUser) : null;

function setSocket(token) {
  const socket = socketIOClient(config.websocketUrl,{
    transports: ['websocket']
    }) 
  socket.emit("user:login",token)       
  return socket
}

const initialState = user ? { 
  loggedIn: true, 
  active2fa : false, 
  loginStatus: {},
  user,alert : {} } : {};
let socket
export function authentication(state = initialState, action) {
  switch (action.type) {
    //login
    
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user, 
        alert : {}
      };
    case userConstants.LOGIN_SUCCESS:      
      return {
          loggedIn: true,
          user: action.user, 
          loginStatus: {},  
          socket: setSocket(action.user.token)     
        };
    case userConstants.LOGIN_FAILURE:
      return {
          alert: {message: action.error.message},
          qr: action.error.qr,
          code: action.error.code
      };
    case userConstants.LOGOUT:
      return state

    // set socket 
    case userConstants.SET_SOCKET:
      return {
        socket: setSocket(action.token),
        user: state.user,
        loggedIn : true
      }

    // reAuth

    case userConstants.REAUTH_REQUEST:
      return {
        reAuth: true,
        user: state.user,
      };
    case userConstants.REAUTH_SUCCESS:
      return {
        loggedIn: true,
        user: action.user
      };
    case userConstants.REAUTH_FAILURE:
      return {
          alert: {message: "Session expired."},
          code: action.error.code,
          user: null
      };
    // GETQR
      
    case userConstants.GET_QR_REQUEST :
      return {        
        loading: true
      }
    case userConstants.GET_QR_SUCCESS :
      return {
        qr : action.qr
      }
    case userConstants.GET_QR_FAILURE :
      return {
        alert: {qr: action.message}
      }

    // Activate 2FA
      
    case userConstants.ACTIVATE_2FA_REQUEST :
      return {        
        loading: true
      }
    case userConstants.ACTIVATE_2FA_SUCCESS :
      return {
        activate2fa : true
      }
    case userConstants.ACTIVATE_2FA_FAILURE :
      return {
        alert: {message: action.message}
      }

    // Set 2FA Level
      
    case userConstants.FORCE_2FA_REQUEST :
      return {        
        loading: true
      }
    case userConstants.FORCE_2FA_SUCCESS :
      return {
        force2fa : action.level
      }
    case userConstants.FORCE_2FA_FAILURE :
      return {
        alert: {message: action.message}
      }

    // Verify TOTP code request
      
    case userConstants.VERIFY_TOPTP_CODE_REQUEST :
      return {        
        loading: true
      }
    case userConstants.VERIFY_TOPTP_CODE_SUCCESS :
      return {
        activate2fa : true, 
        verifyToptp : true
      }
    case userConstants.VERIFY_TOPTP_CODE_FAILURE :
      return {
        alert: {qr: action.message}
      }
    default:
      return state;
    
  }
}