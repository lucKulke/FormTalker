import os
import json

from library.llms import LLM
from library.intent_recognition import IntentRecognition
from dotenv import load_dotenv

load_dotenv()
file = open("output_json/test.json", "r")
API_KEY = os.getenv("CHATGPT_API_KEY")
FORM_FILLING_DATA = json.loads(file.read())
INITIAL_INTENT_OPTIONS = {
    "0": "The user indicates that he has completed a task or want to log some information.",
    "1": "The user indicates that he want to make or have made a correction to a previous statement or task.",
}
chatgpt = LLM(llm_type="chatgpt", model="gpt-3.5-turbo", api_key=API_KEY)
llm_config_file = open("llm_prompt_config.json", "r")
llm_prompt_config = json.loads(llm_config_file.read())
intent_recognizer = IntentRecognition(llm=chatgpt, config=llm_prompt_config)

filled_form_fields = {}

while True:
    text_message = input("enter text:")
    if text_message == "exit":
        break

    response_id = intent_recognizer.inital_intent(
        data=INITIAL_INTENT_OPTIONS, text=text_message
    )

    if response_id == "0":
        task_name, status_id = intent_recognizer.process(
            data=FORM_FILLING_DATA, text=text_message
        )
        if task_name in filled_form_fields:
            filled_form_fields[task_name][status_id] = FORM_FILLING_DATA[task_name][
                status_id
            ]
        else:
            filled_form_fields[task_name] = {
                status_id: FORM_FILLING_DATA[task_name][status_id]
            }

        if FORM_FILLING_DATA[task_name][status_id]["form_input"] == "text":
            substring = intent_recognizer.find_substring(
                substring_description=FORM_FILLING_DATA[task_name][status_id]["name"],
                text=text_message,
            )
            filled_form_fields[task_name][status_id]["text_value"] = substring

    elif response_id == "1":
        task_name, status_id = intent_recognizer.process(
            data=FORM_FILLING_DATA, text=text_message
        )
        if task_name in filled_form_fields:
            filled_form_fields[task_name] = {}
            filled_form_fields[task_name] = {
                status_id: FORM_FILLING_DATA[task_name][status_id]
            }
        else:
            print("no correction possible")

    print(filled_form_fields)
