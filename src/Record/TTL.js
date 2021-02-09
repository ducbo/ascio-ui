import { Combobox } from 'react-widgets';

function TTL (props) {    
    const values = [
        { seconds: 60, text: '1 Minute' },
        { seconds: 300, text: '5 Minutes' },
        { seconds: 600, text: '10 Minutes' },
        { seconds: 1800, text: '30 Minute' },
        { seconds: 3600, text: '1 Hour' },
        { seconds: 86400, text: '1 Day' }
    ];
    const onChange =  (value) =>  {
        const seconds = value.seconds || value;
        return props.onChange({target : {name :"TTL", value: seconds}})
    };
    let widget = (
        <div className="form-group row">
            <label className="col-sm-2 col-form-label">TTL</label>
            <div className="col-sm-10">
                <Combobox
                    onChange={onChange}
                    valueField="seconds"
                    textField="text"
                    defaultValue={parseInt(props.value)}
                    data={values}
                />
            </div>
        </div>
    );
    return widget;

}
 export {TTL}