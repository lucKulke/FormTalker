import re
import json
import ast
from .llms import LLM
from .data_components import FormData, Field
from logging import Logger


class IntentRecognitionError(Exception):
    def __init__(self, message, errors):
        # Call the base class constructor with the parameters it needs
        super().__init__(message)

        # Now for your custom code...
        self.errors = errors


class IntentRecognitionIntendedTaskResponseTypeError(IntentRecognitionError):
    pass


class IntentRecognitionIntendedFieldResponseTypeError(IntentRecognitionError):
    pass


class IntentRecognitionSplitIntentsResponseTypeError(IntentRecognitionError):
    pass


class IntentRecognitionCorrectionIntendResponseTypeError(IntentRecognitionError):
    pass


class IntentRecognitionIsCorrectionResponseTypeError(IntentRecognitionError):
    pass


class IntentRecognitionFindRelevantInformationResponseTypeError(IntentRecognitionError):
    pass


class IntentRecognitionCorrectionIntendJsonParsingError(IntentRecognitionError):
    pass


class IntentRecognitionIntendedTaskMatchError(IntentRecognitionError):
    pass


class IntentRecognitionIntendedFieldMatchError(IntentRecognitionError):
    pass


class IntentRecognitionExtractRelevantInformationError(IntentRecognitionError):
    pass


class IntentRecognition:

    def __init__(self, logger: Logger, llm: LLM, config: dict) -> None:
        self.logger = logger
        self.config = config
        self.llm = llm

    def split(self, user_text_message: str) -> str:
        static_system_prompt = self.config["split_message_into_itents"]["system"]
        examples = "Examples:\n1. Input: 'Der reifenluftdruck ist nicht in ordnung, deswegen habe ich den reifenluftdruck angepasst.' Output: ['Reifenluftdruck ist nicht in ordnung', 'Reifenluftdruck wurde angepasst']\nInput: 'Ich habe die Fanghaken gefettet und die Batterie geprüft und sie ist in ordnung.' Output: ['Fanghaken gefettet', 'Batterie ist in ordnung']\nInput: 'Die Profiltiefe beträgt 7 mm und der Reifendruck ist bei 2.5 bar.' Output: ['Profiltiefe beträgt 7 mm', 'Reifendruck ist bei 2.5 bar']\nInput: 'Ich habe den luftdruck aller reifen überprüft und er war in ordnung.' Output: ['Luftdruck aller reifen ist in ordnung']\nInput: 'Ich habe die Batterie geprüft aber sie war nicht in ordnung.' Output: ['Batterie nicht in ordnung']\n Your goal is to accurately and consistently identify and extract individual tasks from the user's input. It is possible that there is only one task in the user's input."
        system_prompt = {"role": "system", "content": static_system_prompt + examples}
        user_message = {"role": "user", "content": user_text_message}
        messages = [system_prompt, user_message]
        response = self.get_llm_response(messages=messages)
        response = self.extract_list_out_of_string(text=response)
        if self.check_if_only_one_intent(message=response):
            self.logger.info(f"Only one intent: {user_message}")
            return str([user_text_message])
        self.logger.info(f"More than one intents: {response}")
        return response

    def check_if_only_one_intent(self, message: str):
        response = re.match(pattern="(None|null|none)", string=message)
        if response:
            return True
        return False

    def extract_list_out_of_string(self, text: str):
        pattern = r'\[\s*(?:"(?:[^"]|\\")*"|\'(?:[^\']|\\\')*\')\s*(?:,\s*(?:"(?:[^"]|\\")*"|\'(?:[^\']|\\\')*\')\s*)*\]'
        match = re.search(pattern, text)

        if match:
            return match.group(0)
        else:
            raise IntentRecognitionSplitIntentsResponseTypeError(
                message=f"Raw llm response: {text}", errors=1
            )

    def process(
        self,
        form_data: FormData,
        user_text_message: str,
    ):
        task_name = self.intendet_task(form_data=form_data, text=user_text_message)
        self.logger.info(f"intendet task: {task_name}")
        response_id = self.intended_field(
            form_data=form_data, task_name=task_name, text=user_text_message
        )
        self.logger.info(
            f"intendet field: {form_data[task_name][response_id].description}"
        )

        if not form_data[task_name][response_id].form_input_type == "x":
            relevant_information = self.find_relevant_information(
                field=form_data[task_name][response_id], text=user_text_message
            )
            self.logger.info(
                f"relevant information for {form_data[task_name][response_id].description} field: {relevant_information}"
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
                self.logger.info(f"this is a correction")

                corrected_fields = self.correction_intent(
                    form_data=form_data,
                    task_name=task_name,
                    text=user_text_message,
                )

                return task_name, corrected_fields

        self.logger.info(
            f"Normal setting of a cross in '{form_data[task_name][response_id].description}' field."
        )

        fields = form_data[task_name].get_minimal_fields_information()
        fields[response_id] = {form_data[task_name][response_id].description: "x"}

        return task_name, fields

    def find_relevant_information(self, field: Field, text: str) -> str:
        static_system_prompt = self.config["find_matching_substring"]["system"]
        examples = ""
        for id, data in field.trainings_data.items():
            examples += f"{id}. Input: {data['user_message']} -> Ouput: {data['system_response']}\n"

        dynamic_system_prompt = f"Instructions:\n1. Extract the relevant value: Based on the field type '{field.form_input_type}', isolate the relevant value from the user's input.\n2. Return the value: Provide the extracted value as a standalone string, formatted appropriately for the field type.\n\nExamples:\n{examples}\n\nIf you cant find any relevant value from the user's input, respond with 'None'."
        system_prompt = {
            "role": "system",
            "content": static_system_prompt + dynamic_system_prompt,
        }
        user_message = {"role": "user", "content": text}
        messages = [system_prompt, user_message]
        response = self.get_llm_response(messages=messages)
        if self.check_if_none(raw_llm_response=response):
            raise IntentRecognitionExtractRelevantInformationError(
                message="Can't find any relevant information",
                errors=1,
            )

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

        raw_llm_response = self.get_llm_response(messages=messages)

        response = self.extract_json_object(raw_llm_response=raw_llm_response)
        return response

    def extract_json_object(self, raw_llm_response: str):
        pattern = r"\{\s*(?:[^{}]*\{\s*[^{}]*\}\s*)*\}"

        match = re.search(pattern, raw_llm_response, re.DOTALL)

        if match:
            json_string = match.group(0)
            json_string = json_string.replace("\n", "")
            try:
                json_object = ast.literal_eval(json_string)
                return json_object
            except Exception as e:
                raise IntentRecognitionCorrectionIntendJsonParsingError(
                    message=f"Raw llm response: {raw_llm_response}. Cleand string: {json_string}",
                    errors=2,
                )
        else:
            raise IntentRecognitionCorrectionIntendResponseTypeError(
                message=f"Raw llm response: {raw_llm_response}",
                errors=2,
            )

    def is_correction(self, text: str, task_name: str, form_data: FormData):

        fields = form_data[task_name].get_description_and_value()
        system_message = self.config["correction_intend"]["system"] + str(fields)

        system_prompt = {"role": "system", "content": system_message}
        user_message = {"role": "user", "content": text}

        messages = [system_prompt, user_message]

        raw_llm_response = self.get_llm_response(messages=messages)
        response_id = self.extract_response_id(raw_llm_response=raw_llm_response)
        if not self.is_valid_response_id(id=response_id, possible_ids=["1", "0"]):
            raise IntentRecognitionIsCorrectionResponseTypeError(
                message=f"Raw llm response: {raw_llm_response}",
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

        raw_llm_response = self.get_llm_response(messages=messages)
        if self.check_if_none(raw_llm_response=raw_llm_response):
            raise IntentRecognitionIntendedFieldMatchError(
                message=f"No task match found.",
                errors=1,
            )
        response_id = self.extract_response_id(raw_llm_response=raw_llm_response)
        if not self.is_valid_response_id(
            id=response_id, possible_ids=list(form_fields)
        ):
            raise IntentRecognitionIntendedFieldResponseTypeError(
                message=f"Raw llm response: {raw_llm_response}",
                errors=2,
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

        raw_llm_response = self.get_llm_response(messages=messages)
        if self.check_if_none(raw_llm_response=raw_llm_response):
            raise IntentRecognitionIntendedTaskMatchError(
                message=f"No task match found.",
                errors=1,
            )
        response_id = self.extract_response_id(raw_llm_response=raw_llm_response)
        if not self.is_valid_response_id(
            id=response_id, possible_ids=list(filterd_data)
        ):
            raise IntentRecognitionIntendedTaskResponseTypeError(
                message=f"Raw llm response: {raw_llm_response}",
                errors=2,
            )
        return filterd_data[response_id]

    def extract_response_id(self, raw_llm_response: str):
        id = re.search("\d+", raw_llm_response)
        if id:
            return id.group(0)
        else:
            return None

    def get_llm_response(self, messages: list):

        # self.logger.info(f"LLM request: {messages}")
        return (
            self.llm.selected_model.chat_completation(messages=messages)
            .choices[0]
            .message.content
        )

    def is_valid_response_id(self, id: str, possible_ids: dict):
        if id in possible_ids:
            return True
        return False

    def message_compiler(self, user_text: str, data: dict):
        return f" User Text: '{user_text}' Options: {data}"

    def check_if_none(self, raw_llm_response: str):
        match = re.match(pattern="(None|null|none)", string=raw_llm_response)
        if match:
            return True
        return False
