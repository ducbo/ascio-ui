import React, { useState } from 'react'

export const Username = function (props) {
    const [value, setValue] = useState({value: props.data[props.field]})
    
    const onChange = (e) => {
      setValue({value: e.target.value});
      props.onChange(e)
    } 
    return <div className='form-group row'>
      <label htmlFor={'input' + props.field} className='col-sm-2 col-form-label'>
        {props.name}
      </label>
      <div className='col-sm-10'>
        <input
          label={props.description}
          type='text'
          name={props.field}
          className='form-control'
          id={'input' + props.field}
          value={value.value}
          onChange={onChange}
          placeholder={props.placeHolder}
        />
      </div>
    </div>
}