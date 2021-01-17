import { Combobox } from 'react-widgets';

function RedirectionType (props) {    
    const onChange = (value) => {
        props.onChange({target: {name: "RedirectionType", value}})
    }
    return  <Combobox
                    onChange={onChange}
                    defaultValue= {props.value ||"Permanent"}
                    data={["Permanent","Temporary","Frame"]}
                />
}
 export {RedirectionType}