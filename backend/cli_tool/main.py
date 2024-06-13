import os
import json
from library.llms import LLM
from library.intent_recognition import IntentRecognition
from library.pdf_annotations import Reader, Writer
from dotenv import load_dotenv

load_dotenv()
file = open("output_json/test.json","r",encoding='utf-8')
API_KEY = os.getenv("CHATGPT_API_KEY")
form_filling_data = json.loads(file.read())
INITIAL_INTENT_OPTIONS = {
    "0": "The user indicates that he has completed a task or want to log some information.",
    "1": "The user indicates that he want to make or have made a correction to a previous statement or task.",
}
chatgpt = LLM(llm_type="chatgpt", model="gpt-3.5-turbo", api_key=API_KEY)
llm_config_file = open("llm_prompt_config.json", "r")
llm_prompt_config = json.loads(llm_config_file.read())
intent_recognizer = IntentRecognition(llm=chatgpt, config=llm_prompt_config)

filled_form_fields = {}

pdf_reader = Reader(path="../../example_pdfs/example2.pdf")
pdf_writer = Writer(path="../../example_pdfs/example2.pdf")
#print(pdf_reader.all_annotations())

annotation_data = pdf_reader.all_annotations()


def mapping_form_field_locations_to_data(annotation_data: dict, form_filling_data: dict):
    temp_structure = {}
    for task_name, value in form_filling_data.items():
        for key in value:
            temp_structure[key] = task_name


    for id_test, task_name in temp_structure.items():
        print(id_test + " " + task_name)
        form_filling_data[task_name][id_test]["location"] = annotation_data[id_test]


mapping_form_field_locations_to_data(annotation_data=annotation_data, form_filling_data=form_filling_data)

print(form_filling_data)
    



while True:
    text_message = input("enter text:")
    if text_message == "exit":
        break
    
    data_to_write = {}

    response_id = intent_recognizer.inital_intent(
        data=INITIAL_INTENT_OPTIONS, text=text_message
    )

    if response_id == "0":
        task_name, status_id = intent_recognizer.process(
            data=form_filling_data, text=text_message
        )
        data_to_write[task_name] = {"id": status_id}
        if task_name in filled_form_fields:
            filled_form_fields[task_name][status_id] = form_filling_data[task_name][
                status_id
            ]
        else:
            filled_form_fields[task_name] = {
                status_id: form_filling_data[task_name][status_id]
            }

        if form_filling_data[task_name][status_id]["form_input"] == "text":
            substring = intent_recognizer.find_substring(
                substring_description=form_filling_data[task_name][status_id]["name"],
                text=text_message,
            )
            filled_form_fields[task_name][status_id]["text_value"] = substring

            data_to_write[task_name]["text_value"] = substring

    elif response_id == "1":
        task_name, status_id = intent_recognizer.process(
            data=form_filling_data, text=text_message
        )
        data_to_write[task_name] = {"id": status_id}

        if task_name in filled_form_fields:
            filled_form_fields[task_name] = {}
            filled_form_fields[task_name] = {
                status_id: form_filling_data[task_name][status_id]
            }
             

        if form_filling_data[task_name][status_id]["form_input"] == "text":
            substring = intent_recognizer.find_substring(
                substring_description=form_filling_data[task_name][status_id]["name"],
                text=text_message,
            )
            filled_form_fields[task_name][status_id]["text_value"] = substring

            data_to_write[task_name]["text_value"] = substring
        else:
            print("no correction possible")

    print(data_to_write)
    task_name = list(data_to_write)[0]
    id = data_to_write[task_name]["id"]
    value = filled_form_fields[task_name][id]["form_input"]
    if filled_form_fields[task_name][id]["form_input"] == "text":
        value = filled_form_fields[task_name][id]["text_value"]

    pdf_writer.annotation(location=filled_form_fields[task_name][id]["location"], value=value)
    print(filled_form_fields)


