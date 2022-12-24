import './Loading.css';
import React, {useState, useRef} from 'react';

const Loading = (props) => {
    return (
        <div class="wrapper">
        <div class="loading">Loading</div>
        <div class="load_text">생성 중입니다... <br/> 잠시만 기다려주세요!</div>
        </div>
    )
}

export default Loading;