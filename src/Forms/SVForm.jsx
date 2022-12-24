import '../App.css';
import React, {useState, useRef} from 'react';
import FormInput from '../components/FormInput'

function SVForm() {

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
        name: "relationship",
        type: "text",
        placeholder: "피해자와의 관계를 서술해주세요.",
        errorMessage: "",
        label:"D.  피해자와의 관계"
    },
    {
        id: 2,
        name: "sv_level",
        type: "text",
        placeholder: "어떻게 추행을 했는지 상세하게 서술해주세요.",
        errorMessage:"",
        label:"E.  추행의 정도"
    },
    {
        id: 3,
        name: "period",
        type: "text",
        placeholder: "추행이 발생한 기간에 관해 서술해주세요.",
        errorMessage:"",
        label:"F.  기간"
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

export default SVForm;