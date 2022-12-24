import '../App.css';
import React, {useState, useRef} from 'react';
import FormInput from '../components/FormInput'

function OJForm() {

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
        name: "oj_level",
        type: "text",
        placeholder: "폭행이 어떻게 이루어졌는지 자세히 기재해주세요.",
        errorMessage: "",
        label:"D.  폭행의 정도"
    },
    {
        id: 2,
        name: "intention",
        type: "text",
        placeholder: "고의성이 있었는지 객관적으로 서술해주세요.",
        errorMessage:"",
        label:"E.  고의성"
    },
]

    return (
    <p>
    {inputs.map(input => (
        <FormInput key={input.id} {...input} values={values[input.name]}/>
    ))}
    </p>
    )     
}

export default OJForm;