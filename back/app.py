from flask_script import Manager, Server
from flask import Flask
from flask import Flask, request, Response, jsonify
from flask_cors import CORS, cross_origin
import transformers
import torch
import flask
import ast
import kss
from itertools import chain
import re


class CustomServer(Server):
    def __call__(self, app, *args, **kwargs):

        global model
        global nli_model
        global tokenizer
        global nli_tokenizer

        tokenizer = transformers.AutoTokenizer.from_pretrained(
            "lbox/lcube-base",
            bos_token="[BOS]",
            unk_token="[UNK]",
            pad_token="[PAD]",
            mask_token="[MASK]",
        )

        model = transformers.GPT2LMHeadModel.from_pretrained("lbox/lcube-base")
        k = {'.'.join(k.split(".")[1:]): v for k, v in torch.load(
            "./lbox-open/GENERATION_MODEL_papago_30_0.8.ckpt").items()}
        model.load_state_dict(k, strict=False)
        model.eval()

        nli_model = transformers.AutoModelForSequenceClassification.from_pretrained(
            "monologg/koelectra-base-v3-discriminator", num_labels=3)
        nli_model.load_state_dict(torch.load(
            "./nli_model_ckpt_1k/pytorch_model.bin", map_location=torch.device("cpu")))
        nli_model.eval()

        nli_tokenizer = transformers.AutoTokenizer.from_pretrained(
            "monologg/koelectra-base-v3-discriminator")

        # Hint: Here you could manipulate app
        return Server.__call__(self, app, *args, **kwargs)


model = None
nli_model = None
tokenizer = None
nli_tokenizer = None
desc = ""
glob_result = {}

app = Flask(__name__)
CORS(app)
manager = Manager(app)
# Remeber to add the command to your Manager instance


@app.route('/run_model', methods=['POST'])
def process():

    global desc
    global result

    result = ast.literal_eval(request.data.decode('utf-8'))

    # Do something, i.e. concat all the texts
    all_text = result['desc'].strip()
    desc = all_text

    for k in result:
        if k != 'desc':
            glob_result[k] = result[k]
        if k != 'desc' and result[k].strip() != '':
            all_text += '\n' + result[k]

    all_text = f"{all_text.strip()}\n요약하시오.\n"

    model_inputs = tokenizer(all_text,
                             max_length=1024,
                             padding=True,
                             truncation=True,
                             return_tensors='pt')

    with torch.no_grad():
        out = model.generate(
            model_inputs["input_ids"],
            max_new_tokens=256,
            pad_token_id=tokenizer.pad_token_id,
            use_cache=True,
            repetition_penalty=1.2,
            top_k=5,
            top_p=0.9,
            temperature=1,
            num_beams=3,
            num_return_sequences=1
        )

    gen_result = tokenizer.batch_decode(out)[0]

    start_idx = gen_result.index("요약하시오.\n") + 8

    if '<|endoftext|>' in gen_result:
        end_idx = gen_result.index('<|endoftext|>')
    else:
        end_idx = len(gen_result)

    final_result = gen_result[start_idx: end_idx]

    # result
    final_pred, final_result = final_result.split(
        "\n")[0], '\n'.join(final_result.split("\n")[2:])

    if final_result[-1] == '다' or final_result[-1] == '.':
        pass
    else:
        final_result += "..."

    final_result_dict = {"output": final_result,
                         "pred": final_pred}  # END OF MODEL PREDICTION

    ###############################################################
    # START NLI.
    history_keywords = ['누범', '전력이', '집행유예 이상', '집행유예 기간',
                        '초범', '동종', '벌금형', '형사처벌']
    agree_keywords = ['합의', '용서', '사죄', '희망', '탄원서', '배상']

    # These premises assume that it has history
    hist_premise = ["누범기간에 저질렀다.", "전력이 있다",
                    "집행유예 이상의 전과가 있다.", "집행유예 기간에 범죄를 저질렀다.", "초범이 아니다.", "동종 범죄 전력이 있다",
                    "벌금형 이외의 동종 범죄 전력이 있다.", "형사처벌을 받은 적이 있다"]
    hist_question = ["동종 범죄 전력이 없었다면?", "동종 범죄 전력이 있었다면?"]

    # These premises assume that it has agreement
    agree_premise = ["합의를 하였다", "피해자가 용서했다.", "피해자에게 사죄했다", "피고인에 대한 선처를 희망한다",
                     "피해자의 선처를 바라는 탄원서를 제출함", "피해를 배상하고자 상당한 돈을 지급하고 합의하였다."]
    agree_question = ["피해자와 합의를 하지 못 한다면?", "피해자와 합의가 성사되었다면?"]

    delimiters = "\n", "점,", "..."
    regex_pattern = '|'.join(map(re.escape, delimiters))
    sents = [x for x in kss.split_sentences(
        re.split(regex_pattern, final_result))]
    sents = [x for x in chain.from_iterable(sents)]

    print("Sentences", sents)
    result1 = 1
    result2 = 1

    sent1_hypothesis = None
    sent1_premise = None
    sent1_flag = False

    for sent in sents:

        for idx, word in enumerate(history_keywords):
            if word in sent:
                sent1_premise = sent
                sent1_hypothesis = hist_premise[idx]
                sent1_flag = True
                break

        if sent1_flag:
            break

    sent2_hypothesis = None
    sent2_premise = None
    sent2_flag = False

    for sent in sents:
        for idx, word in enumerate(agree_keywords):
            if word in sent:
                sent2_premise = sent
                sent2_hypothesis = agree_premise[idx]
                sent2_flag = True
                break

        if sent2_flag:
            break

    # 0: entail, 1: neutral, 2: contrad
    if sent1_hypothesis:
        # run NLI
        inputs1 = nli_tokenizer.encode(sent1_premise, sent1_hypothesis)
        inputs1 = torch.LongTensor(inputs1).unsqueeze(0)

        with torch.no_grad():
            out1 = nli_model(inputs1)

        out1 = out1['logits'].squeeze(0).argmax()

        # consider neutral also as entail for simplicity.
        if out1 <= 1:
            result1 = 0

    if sent2_hypothesis:
        # run NLI
        inputs2 = nli_tokenizer.encode(sent2_premise, sent2_hypothesis)
        inputs2 = torch.LongTensor(inputs2).unsqueeze(0)

        with torch.no_grad():
            out2 = nli_model(inputs2)

        out2 = out2['logits'].squeeze(0).argmax()

        if out2 <= 1:
            result2 = 0

    final_hist_question = hist_question[result1]
    final_agree_question = agree_question[result2]
    ###############################################
    # END OF NLI AND QUESTION GENERATION.
    final_result_dict['hist_question'] = (sent1_premise, final_hist_question)
    final_result_dict['agree_question'] = (sent2_premise, final_agree_question)

    # Run Analysis
    return jsonify(final_result_dict), 200


@app.route('/change_result', methods=['POST'])
def change_result():

    q_to_t = {"피해자와 합의를 하지 못 한다면?": "피해자와 합의를 하지 못하였습니다.",
              "피해자와 합의가 성사되었다면?": "피해자와 합의를 원만히 하였습니다.",
              "동종 범죄 전력이 없었다면?": "범죄 전력이 없는 초범입니다.",
              "동종 범죄 전력이 있었다면?": "이미 동종 범죄를 저지른 기록이 수차례 있습니다."}

    init_result = request.data.decode('utf-8').replace("null", "None")

    result = ast.literal_eval(init_result)
    sel_question = result['sel_question'].strip()
    new_text = q_to_t[sel_question]

    if '합의' in sel_question:
        chosen_key = 'forgiveness'
    else:
        chosen_key = 'crime_exp'

    new_desc = desc

    for key in glob_result:
        if key != chosen_key and glob_result[key] != '':
            new_desc += glob_result[key] + "\n"

    new_desc += new_text + '\n요약하시오.\n'

    model_inputs = tokenizer(new_desc,
                             max_length=1024,
                             padding=True,
                             truncation=True,
                             return_tensors='pt')

    with torch.no_grad():
        out = model.generate(
            model_inputs["input_ids"],
            max_new_tokens=256,
            pad_token_id=tokenizer.pad_token_id,
            use_cache=True,
            repetition_penalty=1.2,
            top_k=5,
            top_p=0.9,
            temperature=1,
            num_beams=3,
            num_return_sequences=1
        )

    gen_result = tokenizer.batch_decode(out)[0]

    start_idx = gen_result.index("요약하시오.\n") + 8

    if '<|endoftext|>' in gen_result:
        end_idx = gen_result.index('<|endoftext|>')
    else:
        end_idx = len(gen_result)

    final_result = gen_result[start_idx: end_idx]

    # result
    final_pred, final_result = final_result.split(
        "\n")[0], '\n'.join(final_result.split("\n")[2:])

    final_result_dict = {"desc": new_desc, "output": final_result,
                         "pred": final_pred}  # END OF MODEL PREDICTION

    return jsonify(final_result_dict), 200


@app.route('/', methods=['GET'])
def default():
    return "HELLO WORLD!"


if __name__ == "__main__":
    manager.add_command('runserver', CustomServer(
        use_debugger=True,
        use_reloader=True,
        host='0.0.0.0')
    )
    manager.run()
