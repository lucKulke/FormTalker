import os
import json
import ast
from library.llms import LLM
from library.intent_recognition import IntentRecognition
from library.pdf_annotations import Reader, Writer
from library.data_components import DataMapper, FormData, Fields, Field
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("CHATGPT_API_KEY")

file = open("data/form_representation_data.json", "r", encoding="utf-8")
form_representation_data = json.loads(file.read())
file.close()

file = open("data/trainings_data.json", "r", encoding="utf-8")
form_trainings_data = json.loads(file.read())
file.close()


INITIAL_INTENT_OPTIONS = {
    "0": "The user indicates that he has completed a task or want to log some information.",
    "1": "The user indicates that he want to make or have made a correction to a previous statement or task.",
}
chatgpt = LLM(llm_type="chatgpt", model="gpt-4o", api_key=API_KEY)
llm_config_file = open("llm_prompt_config.json", "r")
llm_prompt_config = json.loads(llm_config_file.read())
intent_recognizer = IntentRecognition(llm=chatgpt, config=llm_prompt_config)


conversation_history = {}

pdf_reader = Reader(path="input_pdfs/example2.pdf")
pdf_writer = Writer(path="../../raw_example_pdfs/example.pdf")
# print(pdf_reader.all_annotations())

annotation_data = pdf_reader.all_annotations()


DataMapper.mapp_data_to_form_representation_data(
    annotation_data=annotation_data,
    form_representation_data=form_representation_data,
    form_trainings_data=form_trainings_data,
)


form_data = FormData(data=form_representation_data)


while True:
    text_message = input("enter text:")
    if text_message == "exit":
        break

    new_data_to_write = {}

    intents = intent_recognizer.split(user_text_message=text_message)
    intents_list = ast.literal_eval(intents)
    print(intents)
    for intent in intents_list:
        task_name, fields = intent_recognizer.process(
            form_data=form_data,
            user_text_message=intent,
        )
        print("------fields-------")
        print(fields)
        print("--------------------")
        form_data[task_name].update(fields)

    for name in form_data.get_data():
        if form_data[name].is_at_least_one_field_filled():
            print(f"FORM_FIELDS of {name}:")
            for id, value in form_data[name].get_minimal_fields_information().items():
                print(id + " " + str(value))
