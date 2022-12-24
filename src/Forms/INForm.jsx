import '../App.css';
import React, {useState, useRef} from 'react';
import FormInput from '../components/FormInput'

function INForm() {

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
        name: "victim_fault",
        type: "text",
        placeholder: "피해자의 과실이 있다면 그에 관해 기재해주세요.",
        errorMessage: "",
        label:"D. 피해자의 과실(피해자의 폭행 유도 유무)"
    },
    {
        id: 2,
        name: "recovery_rate",
        type: "text",
        placeholder: "피해 회복이 이루어졌다면 그에 관해 기재해주세요.",
        errorMessage:"",
        label:"E. 피해자의 피해 회복 여부"
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

export default INForm;