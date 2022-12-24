import '../App.css';
import React, {useState, useRef} from 'react';
import FormInput from '../components/FormInput'

function DDForm() {

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
        name: "alcohol_rate",
        type: "text",
        placeholder: "혈중 알코올 농도가 얼마였는지 기재해주세요.",
        errorMessage: "",
        label:"D. 혈중 알코올 농도"
    },
    {
        id: 2,
        name: "low_age",
        type: "text",
        placeholder: "사회 초년생이신지 여부에 관해 기재해주세요.",
        errorMessage:"",
        label:"E. 연령"
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

export default DDForm;