import '../App.css';
import React, {useState, useRef} from 'react';
import FormInput from '../components/FormInput'

function TAForm() {

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
        name: "recovery_method",
        type: "text",
        placeholder: "피해 회복을 위한 방법이 있다면 자세히 기재해주세요.",
        errorMessage: "",
        label:"D. 피해자 피해 회복 수단 존재 여부 (보험, 공제 조합 등)"
    },
    {
        id: 2,
        name: "accident_place",
        type: "text",
        placeholder: "사고 장소가 어디였는지 자세히 적어주세요.",
        errorMessage:"",
        label:"E. 사고 장소(횡단 보도 등)"
    },
    {
        id: 3,
        name: "victim_fault",
        type: "text",
        placeholder: "피해자의 과실이 있다면 그에 관해 기재해주세요.",
        errorMessage:"",
        label:"F. 피해자의 과실 여부"
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

export default TAForm;