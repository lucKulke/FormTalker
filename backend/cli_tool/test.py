import os
import json
from library.components import Section
from library.ais import LLM, IntentRecognition
from dotenv import load_dotenv

load_dotenv()
file = open("output_json/test.json", "r")
API_KEY = os.getenv("CHATGPT_API_KEY")
FORM_FILLING_DATA = json.loads(file.read())
TEST_MESSAGE = "Ich habe den Reifendruck aller reifen geprüft und er ist nicht in ordnung."

chatgpt = LLM(llm_type="chatgpt", model="gpt-3.5-turbo", api_key=API_KEY)
llm_config_file = open("llm_prompt_config.json", "r")
llm_prompt_config = json.loads(llm_config_file.read())
intent_recognizer = IntentRecognition(llm=chatgpt, config=llm_prompt_config)

data = {
    "0" : "He has completed a task.",
    "1": "He wants to make a correction."
}

response = intent_recognizer.operation_intent(text=TEST_MESSAGE, data=data)
result = response.choices[0].message.content

if (True):
    print(data[result])

    data = {}

    task_desc_id = 0
    for task_desc, value in FORM_FILLING_DATA.items():
        data[str(task_desc_id)] = task_desc
        task_desc_id += 1
    
    response = intent_recognizer.task_desc_match(text=TEST_MESSAGE, data=data)
    result = response.choices[0].message.content
    print(data[result])
    task_desc_result = data[result]
    option_data = {}
    for operation_id, value in FORM_FILLING_DATA[task_desc_result].items():
        option_data[operation_id] = value["name"]
        
    data = {}
    data[task_desc_result] = option_data
    response = intent_recognizer.option_match(text=TEST_MESSAGE, data=data)
    result = response.choices[0].message.content
    print(option_data[result])
    


elif(result == "1"):
    print(data[result])