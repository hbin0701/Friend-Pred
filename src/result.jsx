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
      <h1>????????????</h1>  
        <p>A. ?????? ??????</p>
        <div className="card">
          {result.pred}
        </div>

        <p>B. ????????? ?????? ??????</p>
        <div className="card"> 
          { result.output.split('\n').map( (it, i) => <div className="reason_text" key={'x'+i}>{renderHighlight(it, question1[0], question2[0])}<br/></div> )} 
        </div>

        <p> C. ?????? ?????? ??????</p>
        <fieldset>
          <legend>????????? ????????? ?????? ??????????????? ????????? ??????????????????.</legend>

          <div>
            <input type="radio" id="feature1" name="question" value="feature1" onChange={(e) => {changeRadio(e);}}/>
            <label for="feature1"> &emsp;&emsp; {question1[0] ? <span className='highlight_sub'> &emsp;{question1[1]} </span> : "?????? ?????? ????????? ?????????????" }</label>
            {/* <label for="huey"> {question1 ? question1[1] : "?????? ?????? ????????? ?????????????" }</label> */}

          </div>

          <div>
            <input type="radio" id="feature2" name="question" value="feature2" onChange={(e) => {changeRadio(e);}}/>
            <label for="feature2"> &emsp;&emsp; {question2[0] ? <span className='highlight'> {question2[1]} </span> : "???????????? ????????? ???????????????????" }</label>
          </div>
        </fieldset>
        
        
        <p>D. <span className="underline-animation">"{radioValue ? radioValue: "?????? ????????? ??????????????????"}</span> {radioValue && "??? ?????? ??????"}</p>
        <div className="card">
          <span className="emphasis">{addResult["pred"] ? addResult["pred"] : ""}</span> <br/> <br/>  
          <span>{addResult["output"] ? addResult["output"].split('\n').map( (it, i) => <div key={'x'+i}>{it}<br/></div> ) : ""}</span>
        </div>
        
        <button>Submit</button>
      </form>
    </div>
  );
}

export default Result;
