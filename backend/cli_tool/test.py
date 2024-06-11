import os
import json
from library.components import Section
from library.ais import LLM, IntentRecognition
from dotenv import load_dotenv

load_dotenv()
file = open("output_json/test.json", "r")
API_KEY = os.getenv("CHATGPT_API_KEY")
dict_obj = json.loads(file.read())
TEST_MESSAGE = "Korrigiere, der Reifendruck ist doch nicht in ordnung."

sections = []

for key, value in dict_obj.items():

    sections.append(Section(ids=[*value], name=key, options=value))


data = []
id = 0
for section in sections:
    data.append(f"{id}: {section.name}")
    id += 1

print(data)


chatgpt = LLM(llm_type="chatgpt", model="gpt-3.5-turbo", api_key=API_KEY)
llm_config_file = open("llm_prompt_config.json", "r")
llm_prompt_config = json.loads(llm_config_file.read())
intent_recognizer = IntentRecognition(llm=chatgpt, config=llm_prompt_config)

data = [
    {0: "He has completed a task and wants to log it"},
    {1: "He corrects his statement"},
]
response = intent_recognizer.operation_intent(text=TEST_MESSAGE, data=data)
result = response.choices[0].message.content

if result == "1":
    pass
elif result == "0":
    pass
