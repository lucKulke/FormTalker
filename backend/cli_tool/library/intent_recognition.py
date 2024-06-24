import re
import json
from .llms import LLM
from .data_components import FormData, Field


class IntentRecognitionResponseTypeError(Exception):
    def __init__(self, message, errors):
        # Call the base class constructor with the parameters it needs
        super().__init__(message)

        # Now for your custom code...
        self.errors = errors


class IntentRecognition:

    def __init__(self, llm: LLM, config: dict) -> None:
        self.config = config
        self.llm = llm

    def split(self, user_text_message: str) -> list:
        static_system_prompt = self.config["split_message_into_itents"]["system"]
        examples = "Examples:\n1. Input: 'Der reifenluftdruck ist nicht in ordnung, deswegen habe ich den reifenluftdruck angepasst.' Output: ['Reifenluftdruck ist nicht in ordnung', 'Reifenluftdruck wurde angepasst']\nInput: 'Ich habe die Fanghaken gefettet und die Batterie geprüft und sie ist in ordnung.' Output: ['Fanghaken gefettet', 'Batterie geprüft und sie ist in ordnung']\nInput: 'Die Profiltiefe beträgt 7 mm und der Reifendruck ist bei 2.5 bar.' Output: ['Profiltiefe beträgt 7 mm', 'Reifendruck ist bei 2.5 bar']\nInput: 'Ich habe den luftdruck aller reifen überprüft und er war in ordnung.' Output: ['Ich habe den luftdruck aller reifen überprüft und er war in ordnung']\n\n Your goal is to accurately and consistently identify and extract individual tasks from the user's input, whether it contains multiple tasks, and return them as a list of strings. If there is only a single task return the string 'None'."
        system_prompt = {"role": "system", "content": static_system_prompt + examples}
        user_message = {"role": "user", "content": user_text_message}
        messages = [system_prompt, user_message]
        response = self.get_llm_response(messages=messages)
        if self.check_if_more_than_one_intent(message=response):
            return str([user_text_message])
        return response
    
    def check_if_more_than_one_intent(self, message: str):
        response = re.match(pattern='(None|null)', string=message)
        if response:
            return True
        return False

    def process(
        self,
        form_data: FormData,
        user_text_message: str,
    ):
        task_name = self.intendet_task(form_data=form_data, text=user_text_message)
        print("intendet_task response => " + task_name)
        response_id = self.intended_field(
            form_data=form_data, task_name=task_name, text=user_text_message
        )
        print("intendet_field response => " + response_id)

        if not form_data[task_name][response_id].form_input_type == "x":
            relevant_information = self.find_relevant_information(
                field=form_data[task_name][response_id], text=user_text_message
            )

            fields = form_data[task_name].get_minimal_fields_information()
            fields[response_id] = {
                form_data[task_name][response_id].description: relevant_information
            }
            return task_name, fields

        if form_data[task_name].is_at_least_one_field_filled():
            if self.is_correction(
                text=user_text_message, task_name=task_name, form_data=form_data
            ):

                corrected_fields = self.correction_intent(
                    form_data=form_data,
                    task_name=task_name,
                    text=user_text_message,
                )
                print("correction_intent => " + str(corrected_fields))

                return task_name, corrected_fields

        fields = form_data[task_name].get_minimal_fields_information()
        fields[response_id] = {form_data[task_name][response_id].description: "x"}

        return task_name, fields

    def find_relevant_information(self, field: Field, text: str) -> str:
        static_system_prompt = self.config["find_matching_substring"]["system"]

        dynamic_system_prompt = f"Instructions:\n1. Extract the relevant value: Based on the field type '{field.form_input_type}', isolate the relevant value from the user's input.\n2. Return the value: Provide the extracted value as a standalone string, formatted appropriately for the field type.\n\nExamples:\n{field.trainings_data}"
        system_prompt = {
            "role": "system",
            "content": static_system_prompt + dynamic_system_prompt,
        }
        user_message = {"role": "user", "content": text}
        messages = [system_prompt, user_message]
        response = self.get_llm_response(messages=messages)

        print("substring response = " + response)
        return response

    def correction_intent(
        self,
        form_data: FormData,
        task_name: str,
        text: str,
    ):

        current_fields = form_data[task_name].get_minimal_fields_information()
        messages = []
        example = "Form fields: {'1': {'in ordnung': 'x'} '2': {'nicht in ordnung': 'None'} '3': {'behoben': 'None'}}\nUser Text: Die Reifenart ist doch nicht in ordnung\nSystem response: {'1': {'in ordnung': 'None'} '2': {'nicht in ordnung': 'x'} '3': {'behoben': 'None'}}"
        additional_system_prompt_message = f"\nForm decription: {task_name}\n Form fields: {current_fields}\n\nYour response should be a JSON object\nExamples:\n{example}"
        system_prompt = {
            "role": "system",
            "content": self.config["best_match_for_correction"]["system"]
            + additional_system_prompt_message,
        }
        messages.append(system_prompt)

        messages.append({"role": "user", "content": text})
        response = self.get_llm_response(messages=messages)
        print("correction response = " + response)
        response = self.extract_json_object(text=response)
        return response

    def extract_json_object(self, text: str):
        pattern = r"\{\s*(?:[^{}]*\{\s*[^{}]*\}\s*)*\}"

        match = re.search(pattern, text, re.DOTALL)

        if match:
            json_string = match.group(0)
            try:
                json_object = json.loads(json_string)
                return json_object  # This should print <class 'dict'>
            except json.JSONDecodeError as e:
                print("Error parsing JSON:", e)
        else:
            raise IntentRecognitionResponseTypeError(
                message=f"Correction Intent Classification. AI output: {text}",
                errors=2,
            )

    def is_correction(self, text: str, task_name: str, form_data: FormData):

        fields = form_data[task_name].get_description_and_value()
        system_message = self.config["correction_intend"]["system"] + str(fields)

        system_prompt = {"role": "system", "content": system_message}
        user_message = {"role": "user", "content": text}

        messages = [system_prompt, user_message]

        response_id = self.get_llm_response(messages=messages)
        response_id = self.clean_response_id(response_id=response_id)
        if not self.is_valid_response_id(id=response_id, data=[]):
            raise IntentRecognitionResponseTypeError(
                message=f"Correction Intent Classification. AI output: {response_id}",
                errors=2,
            )
        if response_id == "1":
            return True
        return False

    def intended_field(self, form_data: FormData, task_name: str, text: str):
        form_fields = form_data[task_name].get_field_id_and_description()

        system_prompt = self.config["intended_field"]["system"]
        user_message = self.config["intended_field"]["user"] + self.message_compiler(
            user_text=text, data=form_fields
        )
        system_prompt = {"role": "system", "content": system_prompt}
        user_message = {"role": "user", "content": user_message}

        messages = [system_prompt, user_message]

        response_id = self.get_llm_response(messages=messages)
        response_id = self.clean_response_id(response_id=response_id)
        if not self.is_valid_response_id(id=response_id, data=form_fields):
            raise IntentRecognitionResponseTypeError(
                message=f"Status Intent Classification. AI output: {response_id}",
                errors=3,
            )
        return response_id

    def intendet_task(self, form_data: FormData, text: str):
        filterd_data = {}
        id = 0

        for key in form_data.list_of_task_names():
            filterd_data[str(id)] = key
            id += 1
        
        
        system_prompt = self.config["intended_task"]["system"]
        user_message = f" User Text: '{text}' Tasks: {filterd_data}" 
        system_prompt = {"role": "system", "content": system_prompt}
        user_message = {"role": "user", "content": user_message}
        messages = [system_prompt, user_message]

        response_id = self.get_llm_response(messages=messages)
        print(f"response id intendet task: {response_id}")
        response_id = self.clean_response_id(response_id=response_id)
        if not self.is_valid_response_id(id=response_id, data=filterd_data):
            raise IntentRecognitionResponseTypeError(
                message=f"Task Intent Classification. AI output: {response_id}",
                errors=2,
            )
        return filterd_data[response_id]

    def clean_response_id(self, response_id: str):
        response_id = response_id.strip()
        id = re.search("\d+", response_id)
        if id:
            return id.group(0)
        else:
            return None

    def get_llm_response(self, messages: list):

        print(">>--Messages--<<")
        print(messages)
        print(">>---------<<")
        return (
            self.llm.selected_model.chat_completation(messages=messages)
            .choices[0]
            .message.content
        )

    def is_valid_response_id(self, id: str, data: dict):
        result = re.search("\D", id)
        if result:
            return False
        return True

    def is_valid_response_substring(self, substring: str, text: str):
        return len(list(substring)) < len(list(text))

    def message_compiler(self, user_text: str, data: dict):
        return f" User Text: '{user_text}' Options: {data}"
