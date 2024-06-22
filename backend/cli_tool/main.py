import os
import json
from library.llms import LLM
from library.intent_recognition import IntentRecognition
from library.pdf_annotations import Reader, Writer
from library.data_components import DataMapper, FormData, Fields, Field
from dotenv import load_dotenv


load_dotenv()
file = open("data/test.json", "r", encoding="utf-8")
API_KEY = os.getenv("CHATGPT_API_KEY")
form_representation_data = json.loads(file.read())
INITIAL_INTENT_OPTIONS = {
    "0": "The user indicates that he has completed a task or want to log some information.",
    "1": "The user indicates that he want to make or have made a correction to a previous statement or task.",
}
chatgpt = LLM(llm_type="chatgpt", model="gpt-4o", api_key=API_KEY)
llm_config_file = open("llm_prompt_config.json", "r")
llm_prompt_config = json.loads(llm_config_file.read())
intent_recognizer = IntentRecognition(llm=chatgpt, config=llm_prompt_config)

filled_form_fields = {}
conversation_history = {}

pdf_reader = Reader(path="input_pdfs/example2.pdf")
pdf_writer = Writer(path="../../raw_example_pdfs/example.pdf")
# print(pdf_reader.all_annotations())

annotation_data = pdf_reader.all_annotations()


DataMapper.mapp_anno_to_repre_data(
    annotation_data=annotation_data, form_representation_data=form_representation_data
)


form_data = FormData(data=form_representation_data)


def change_filled_form_fields(
    filled_form_fields: dict,
    form_data: FormData,
    field_to_delete: str,
    field_to_set: str,
    task_name: str,
) -> None:
    del filled_form_fields[task_name][field_to_delete]
    filled_form_fields[task_name][field_to_set] = {
        "form_input": form_data[task_name].fields[status_id].description
    }


while True:
    text_message = input("enter text:")
    if text_message == "exit":
        break

    new_data_to_write = {}

    task_name, status_id, correction = intent_recognizer.process(
        form_data=form_data,
        text=text_message,
        conversation_history=conversation_history,
    )
    print(f"CONVERSATION_HISTORY: {conversation_history}")

    if correction:
        field_to_delete = status_id
        field_to_set = correction

        change_filled_form_fields(
            filled_form_fields=filled_form_fields,
            form_data=form_data,
            field_to_delete=field_to_delete,
            field_to_set=field_to_set,
            task_name=task_name,
        )
        new_data_to_write[task_name] = {"id": field_to_set}
    else:
        if task_name in filled_form_fields:
            filled_form_fields[task_name][status_id] = {
                "form_input": form_data[task_name][status_id].description
            }
            new_data_to_write[task_name] = {"id": status_id}
        else:
            filled_form_fields[task_name] = {
                status_id: {"form_input": form_data[task_name][status_id].description}
            }
            new_data_to_write[task_name] = {"id": status_id}

    print(f"FILLED_FORM_FIELDS: {filled_form_fields}")
    print(f"NEW_DATA_TO_WRITE: {new_data_to_write}")

    # if response_id == "0":
    #     print(">> normal")
    #     task_name, status_id, correction = intent_recognizer.process(
    #         data=form_representation_data, text=text_message
    #     )
    #     data_to_write[task_name] = {"id": status_id}

    #     if task_name in filled_form_fields:
    #         filled_form_fields[task_name][status_id] = form_representation_data[
    #             task_name
    #         ][status_id]
    #     else:
    #         filled_form_fields[task_name] = {
    #             status_id: form_representation_data[task_name][status_id]
    #         }

    #     if form_representation_data[task_name][status_id]["form_input"] == "text":
    #         substring = intent_recognizer.find_substring(
    #             substring_description=form_representation_data[task_name][status_id][
    #                 "name"
    #             ],
    #             text=text_message,
    #         )
    #         filled_form_fields[task_name][status_id]["text_value"] = substring

    #         data_to_write[task_name]["text_value"] = substring

    # elif response_id == "1":
    #     print(">> correction!")
    #     task_name, status_id = intent_recognizer.process(
    #         data=form_representation_data, text=text_message
    #     )
    #     data_to_write[task_name] = {"id": status_id}

    #     if task_name in filled_form_fields:
    #         filled_form_fields[task_name] = {}
    #         filled_form_fields[task_name] = {
    #             status_id: form_representation_data[task_name][status_id]
    #         }
    #     else:
    #         filled_form_fields[task_name] = {
    #             status_id: form_representation_data[task_name][status_id]
    #         }

    #     if form_representation_data[task_name][status_id]["form_input"] == "text":
    #         substring = intent_recognizer.find_substring(
    #             substring_description=form_representation_data[task_name][status_id][
    #                 "name"
    #             ],
    #             text=text_message,
    #         )
    #         filled_form_fields[task_name][status_id]["text_value"] = substring

    #         data_to_write[task_name]["text_value"] = substring

    # task_name = list(data_to_write)[0]
    # id = data_to_write[task_name]["id"]
    # print(f">> New data to be written: {task_name} id: {id}")

    # value = filled_form_fields[task_name][id]["form_input"]
    # if filled_form_fields[task_name][id]["form_input"] == "text":
    #     value = filled_form_fields[task_name][id]["text_value"]

    # pdf_writer.annotation(
    #     location=filled_form_fields[task_name][id]["location"], value=value
    # )
    # print(filled_form_fields)
