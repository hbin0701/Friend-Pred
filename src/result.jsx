import logo from './logo.svg';
import './result.css';
import FormInput from './components/FormInput';
import Loading from './components/Loading';
import React, {useState, useRef} from 'react';
import { useSharedRouter } from './router';
import { report } from 'process';

function Result() {
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
          name: "username",
          type: "text",
          placeholder: "Username",
          errorMessage: "Username should be valid username.",
          label:"Username"
        },
        {
          id: 2,
          name: "email",
          type: "text",
          placeholder: "Email",
          errorMessage:"Email should be valid email.",
          label:"Email"
        },
        {
          id: 3,
          name: "birthday",
          type: "text",
          placeholder: "Birthday",
          errorMessage:"Email should be valid email.",
          label:"Birthday"
        },
        {
          id: 4,
          name: "password",
          type: "text",
          placeholder: "Password",
          errorMessage:"Email should be valid email.",
          label:"Password"
        },
        {
          id: 5,
          name: "confirmPassword",
          type: "text",
          placeholder: "Confirm Password",
          errorMessage:"Email should be valid email.",
          label:"Confirm Password"
        },
        
      ]
    
  const [username, setUsername] = useState("");
  const [hovering, setHovering] = useState("");
  const [radioValue, setRadioValue] = useState("");
  const [addResult, setAddResult] = useState({"final_pred": null, "final_text": null});

  const handleSubmit = (e) => {
    e.preventDefault();
    const question = e.target.querySelector('input:checked').nextSibling.textContent;
    const data = {"fact": result, "sel_question": question, "orig_text": [question1, question2]};
    setIsLoading(true);
    console.log(data);
    
    fetch('http://localhost:5000/change_result', {  // Enter your IP address here
      method: 'POST', 
      mode: 'cors', 
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    }).then((res) => res.json())
    .then((json) => {
      setAddResult(json);
      setIsLoading(false);
      debugger;
    });
  }

  const onChange = (e) => {
    setValues({...values, [e.target.name]: e.target.value});
  }


  const { isLoading, result, setResult, setIsLoading, question1, question2} = useSharedRouter();
  
  const renderHighlight = (param, target1, target2) => {
    debugger;
    if (param.includes(target1)) {
        var index = param.indexOf(target1);
        if (param.includes(target2)) {
          debugger;
          var index2 = param.indexOf(target2);
        
          if (index < index2) {
            return <span>
              {param.slice(0,index)}
              <span className='highlight_sub'>{param.slice(index, index+target1.length)}</span>
              {param.slice(index+target1.length, index2)}
              <span className="highlight">{param.slice(index2, index2+target2.length)}</span>
              {param.slice(index2+target2.length, param.length)}
              </span>;
          }
          else if (index > index2) {
            return <span>
              {param.slice(0,index)}
              <span className='highlight'>{param.slice(index2, index2+target2.length)}</span>
              {param.slice(index2+target2.length, index)}
              <span className="highlight_sub">{param.slice(index, index+target1.length)}</span>
              {param.slice(index+target1.length, param.length)}
              </span>;
          }
          else {
            // same
            return <span>{param.slice(0,index)}<span className='highlight_both'>{param.slice(index, index+target1.length)}</span>{param.slice(index+target1.length, param.length)}</span>;
          }
        }
        return <span>{param.slice(0,index)}<span className='highlight_sub'>{param.slice(index, index+target1.length)}</span>{param.slice(index+target1.length, param.length)}</span>;
      }
    else if (param.includes(target2)) {
      var index = param.indexOf(target2);
      return <span>{param.slice(0,index)}<span className='highlight'>{param.slice(index, index+target2.length)}</span>{param.slice(index+target2.length, param.length)}</span>;
    }
    else {
        return param;
    }
  };

  const changeRadio = (e) => {
    setRadioValue(e.target.nextSibling.textContent.trim());
  }

  return ( 
    <div className="Result">
      {isLoading && <Loading></Loading>}
      <form onSubmit={handleSubmit}>
      <h1>생성결과</h1>  
        <p>A. 형량 예측</p>
        <div className="card">
          {result.pred}
        </div>

        <p>B. 양형의 이유 생성</p>
        <div className="card"> 
          { result.output.split('\n').map( (it, i) => <div className="reason_text" key={'x'+i}>{renderHighlight(it, question1[0], question2[0])}<br/></div> )} 
        </div>

        <p> C. 추가 정보 수정</p>
        <fieldset>
          <legend>다양한 정보를 넣어 양형예측을 다르게 생성해보세요.</legend>

          <div>
            <input type="radio" id="feature1" name="question" value="feature1" onChange={(e) => {changeRadio(e);}}/>
            <label for="feature1"> &emsp;&emsp; {question1[0] ? <span className='highlight_sub'> &emsp;{question1[1]} </span> : "동종 범죄 전력이 없었다면?" }</label>
            {/* <label for="huey"> {question1 ? question1[1] : "동종 범죄 전력이 없었다면?" }</label> */}

          </div>

          <div>
            <input type="radio" id="feature2" name="question" value="feature2" onChange={(e) => {changeRadio(e);}}/>
            <label for="feature2"> &emsp;&emsp; {question2[0] ? <span className='highlight'> {question2[1]} </span> : "피해자와 합의가 성사되었다면?" }</label>
          </div>
        </fieldset>
        
        
        <p>D. <span className="underline-animation">"{radioValue ? radioValue: "추가 정보를 선택해주세요"}</span> {radioValue && "에 대한 결과"}</p>
        <div className="card">
          <span className="emphasis">{addResult["pred"] ? addResult["pred"] : ""}</span> <br/> <br/>  
          <span>{addResult["output"] ? addResult["output"].split('\n').map( (it, i) => <div key={'x'+i}>{it}<br/></div> ) : ""}</span>
        </div>
        
{/* 
        <div className="card">
        1. 법률상 처단형의 범위: 징역 1월~5년 <br/>
        2. 양형기준에 따른 권고형의 범위 <br/>  
        [유형의 결정] 성범죄 > 01. 일반적 기준 > 나. 강제추행죄(13세 이상 대상) > [제1유형] 일반강제추행 <br/>
        <span className="changed"> [특별양형인자] 감경요소: 처벌불원</span> <br/>
        [권고영역 및 권고형의 범위] 감경영역, 징역 1월~6월 <br/>
        3. 선고형의 결정 <br/>
        아래의 정상 및 피고인의 나이, 성행, 환경, 범행의 동기 및 수단과 결과, 범행 후의 정황 등 기록과 이 사건 변론에 나타난 여러 가지 양형의 조건을 종합하여 주문과 같이 형을 정한다. <br/>
        <span className="changed">○ 불리한 정상 : 피고인은 자신의 직원이던 피해자를 추행하였는바, 그 범행태양에 비추어 죄질이 나쁘다.</span><br/>
        ○ 유리한 정상 : 피고인은 이 사건 범행을 인정하고 자신의 잘못을 뉘우치며 반성하고 있다. 피해자와 합의하였다. 피고인에게 동종 전력이나 벌금형을 초과하는 형사처벌 전력은 없다. <br/>
        </div>  */}
        <button>Submit</button>
      </form>
    </div>
  );
}

export default Result;
