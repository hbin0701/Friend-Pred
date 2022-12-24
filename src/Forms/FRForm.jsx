import '../App.css';
import React, {useState, useRef} from 'react';
import FormInput from '../components/FormInput'

function FRForm() {

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
        name: "fr_qunatity",
        type: "text",
        placeholder: "편취금 규모를 기재해주세요.",
        errorMessage: "",
        label:"D. 편취금 규모"
    },
    {
        id: 2,
        name: "fr_recovery",
        type: "text",
        placeholder: "피해자의 피해 회복이 어느정도 진행되었는지 기재해주세요.",
        errorMessage:"",
        label:"E. 피해자의 피해 회복 정도"
    },
    {
        id: 3,
        name: "relationship",
        type: "text",
        placeholder: "피해자와의 관계에 관해 기재해주세요.",
        errorMessage:"",
        label:"F. 피해자와의 관계"
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

export default FRForm;