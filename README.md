## 👨‍💻 Friend-Pred 🤖
---
##### User-Friendly Sentence Prediction AI
###### This project was done in part of KAIST AI599, `Special Topics in Machine Learning <AI for Law>`

### DEMO
https://user-images.githubusercontent.com/57248975/209426313-994d9444-70fa-407b-9ef4-e78ab8fa6cb9.mp4


-----
---
### What is this project about?
This project aims to give a better experience to users for sentence-prediction AI, which is a rising trend among Legal Tech Companies. We sought to provide:
1. **Free-input user form**, that would allow user to freely express one's circumstance and the AI model can thoroughly consider to make an accurate prediction.
2. **Sentence Reason Generation**, to add explainability to the prediction result and help user understand what features have led to result.
3. **What If...?**, users are also curious of "what would have happened if...?"  Therefore, we provide an intuitive way to manipulate diverse key features in input to produce various prediction results, which yet shows some consistency with the reason generated. 

#### Models used:
**Generation-Model**: Both sentence prediction & reason generation are produced in a **generative way**, which takes a baseline model of 'lbox-open', which is a GPT2 model further fine-tuned on korean legal documents.

**NLI-Model**: To automatically detect users' input and accordingly help the process of ``3. What if...``, we utilize koelectra-base for this, and further fine-tune it on KLUE NLI dataset.

#### Front-end:
Front-end was done in `react`. Please refer to `src`.
To start, simply type: `npm start
#### Back-end:
Back-end was done in `Flask`. Please refer to `back`.

### Evaluation Result
<img width="386" alt="image" src="https://user-images.githubusercontent.com/57248975/209426328-0c89a5fd-a776-419c-b5aa-ac48763aaa9c.png">

#### How to train generation model?
If you wish to train our generation model, make sure you replace setup.py in original ``lbox`` repo with the one given in ``temp.py``.
