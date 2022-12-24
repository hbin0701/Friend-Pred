import logo from './logo.svg';
import './App.css';
import FormInput from './components/FormInput';
import { createStore } from "redux";
import { useSharedRouter } from './router';


// List of Forms
import SVForm from './Forms/SVForm';
import OJForm from './Forms/OJForm';
import TAForm from './Forms/TAForm';
import DDForm from './Forms/DDForm';
import FRForm from './Forms/FRForm';
import INForm from './Forms/INForm';
import ASForm from './Forms/ASForm';


import React, {useState, useRef} from 'react';
import { connect } from 'react-redux';


function App(props) {
  // const [username, setUsername] = useState("")
  const [values, setValues] = useState({
    username: "",
    email: "",
    birthday: "",
    password: "",
    confirmPassword: "",
  });

  // Default is violence
  // There is, sexual_violence, obstruction_of_justice, traffic_accident, drunk_driving, fraud, injury, assault
  const [options, setOptions] = useState("sexual_violence")
  const { question1, question2, isLoading, result, setIsLoading, setResult, setQuestion1, setQuestion2 } = useSharedRouter();
  // const [result, setResult] = useState()


  const inputs = [
    {
        id: 1,
        name: "crime_exp", 
        type: "text",
        placeholder: "비슷한 종류의 범죄 처벌 전력이 있는 지 기재해주세요. ex) ~로 처벌 받은 바가 있습니다.",
        errorMessage: "",
        label:"A.  동종, 이종범죄 처벌 전력"
    },
    {
        id: 2,
        name: "forgiveness",
        type: "text",
        placeholder: "피해자와 합의를 본 상태인지 기재해주세요. ex) 피해자와 합의할려고 하였으나 실패했습니다.",
        errorMessage:"",
        label:"B.  피해자와의 합의(또는 용서)"
    },
    {
        id: 3,
        name: "remorse",
        type: "text",
        placeholder: "반성 여부를 보이기 위해 하신 노력들을 기재해주세요.",
        errorMessage:"",
        label:"C.  반성 여부"
    },
  ] 

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const data = new FormData(e.target)
    console.log(JSON.stringify(Object.fromEntries(data.entries())))
    
    fetch('http://localhost:5000/run_model', {  // Enter your IP address here
      method: 'POST', 
      mode: 'cors', 
      body: JSON.stringify(Object.fromEntries(data.entries())) // body data type must match "Content-Type" header
    }).then((res) => res.json())
    .then((json) => {
      console.log(json);
      setResult(json);
      setIsLoading(false);
      setQuestion1(json["hist_question"]);
      setQuestion2(json["agree_question"]);
    });
    
  
  }

    // const data = new FormData(e.target)
    // console.log(Object.fromEntries(data.entries()))
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const data = new FormData(e.target);

  //   fetch('http://localhost:5000/run_model', {  // Enter your IP address here
  //     method: 'POST', 
  //     mode: 'cors', 
  //   })  
  
  // }
  

  const onChange = (e) => {
    setValues({...values, [e.target.name]: e.target.value});
  }


  console.log(values)
  
  return ( 
    <div className="App"> 
      <form onSubmit={handleSubmit}>
      <h1>양형 이유 / 예측 서비스</h1> 
      <label>어떤 일이 있었는지 설명해주세요. (100자 이상)</label>  
      <textarea name="desc"  cols="85" rows="10"></textarea> <br />
      <label> 어떤 종류의 범죄인지 선택하여주세요. </label>  
      
      <select onChange={(e) => {setOptions(e.target.value);}} name="order" form="myForm">
        <option value="sexual_violence">강제추행</option>
        <option value="obstruction_of_justice">공무집행방해</option>
        <option value="traffic_accident">교통사고처리특례법위반(치상)</option>
        <option value="drunk_driving">도로교통법위반(음주운전)</option>
        <option value="fraud">사기</option>
        <option value="injury">상해</option>
        <option value="assault">폭행</option>
      </select>
      
      {inputs.map(input => (
        <FormInput key={input.id} {...input} values={values[input.name]}/>
    ))}
    
    <div className="innerbox">
    세부 질문 <p className="small_text"> (위에 작성했을 시에는 필요 X, 또는 추가정보를 자유롭게 작성해주세요.) </p>
    <div className="toAnim">
      {options==="sexual_violence" && <SVForm></SVForm>}
      {options==="obstruction_of_justice" && <OJForm></OJForm>}
      {options==="traffic_accident" && <TAForm></TAForm>}
      {options==="drunk_driving" && <DDForm></DDForm>}
      {options==="fraud" && <FRForm></FRForm>}
      {options==="injury" && <INForm></INForm>}
      {options==="assault" && <ASForm></ASForm>}
    </div>
    </div>
    
      <button>제출</button>
      </form>
    </div>
  );
}

function mapStateToProps(state) {
  console.log("here")
  // console.log(state)
  return {
    result: state
  };
}

// function mapDispatchToProps() {

// }

// const toDosStore = createStore(reducer);

// export default connect(mapStateToProps, null)(App);
export default App;