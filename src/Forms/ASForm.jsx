import '../App.css';
import React, {useState, useRef} from 'react';
import FormInput from '../components/FormInput'

function ASForm() {

    const [values, setValues] = useState({
        username: "",
        email: "",
        birthday: "",
        password: "",
        confirmPassword: "",
    });
      
    const inputs = [
    {
        id: 1,
        name: "intention",
        type: "text",
        placeholder: "고의성이 있었는지 객관적으로 기재해주세요.",
        errorMessage: "",
        label:"D. 고의성"
    },
    {
        id: 2,
        name: "motivation",
        type: "text",
        placeholder: "범행 동기에 관해 기재해주세요.",
        errorMessage:"",
        label:"E. 범행 동기"
    }
    ]

    return (
    <p>
    {inputs.map(input => (
        <FormInput key={input.id} {...input} values={values[input.name]}/>
    ))}
    </p>
    )     
}

export default ASForm;