import React, { useState } from 'react'
import { FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import {pwStrength} from '../_helpers'


export const UpdatePassword = function (props) {
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [message,setMessage] = useState("")
    
    const formatValidation = (strength) => {
      const list = Object.keys(strength.requires).map((key) => {
        const requirement = strength.requires[key]
        const status = requirement.valid ? <FaCheck style={{color:"darkgreen"}}/> : <FaExclamationTriangle style={{color:"darkred"}}/>
        const value = requirement.value ? ": "+requirement.value : ""
        return <li key={key}>{status} {requirement.name}{value}</li>
      })
      return <ul className="validation-list">{list}</ul>
    }

    const onPwChange = (e) => {
      setPassword(e.target.value)
      const strength = pwStrength(e.target.value,password2)
      setMessage(formatValidation(strength))   
      props.passwordValid(strength.valid,password)  
    } 
    const onPw2Change = (e) => {
      setPassword2(e.target.value)
      const strength = pwStrength(password,e.target.value)
      setMessage(formatValidation(strength)) 
      props.passwordValid(strength.valid,password)  
    } 
    return <>
    <div className='form-group row'>
      <label htmlFor={'inputPassword' } className='col-sm-3 col-form-label'>
        Password
      </label>
      <div className='col-sm-9'>
        <input
          label="Password"
          type='password'
          name="password"
          className='form-control'
          id="inputPassword"
          value={password}
          onChange={onPwChange}
          placeholder="Secure password"
        />
      </div>     
  </div>
  
    <div className='form-group row'>
      <label htmlFor={'inputPassword2' } className='col-sm-3 col-form-label'>
        Repeat
      </label>
      <div className='col-sm-9'>
        <input
          label="Password"
          type='password'
          name="password2"
          className='form-control'
          id="inputPassword2"
          value={password2}
          onChange={onPw2Change}
          placeholder="Secure password"
        />
      </div>
      {message}
  </div>
</>    
}