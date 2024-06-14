import re
from .llms import LLM


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

    def process(self, data: dict, text: str):
        task_name = self.task_intent(data=data, text=text)
        print(task_name)
        status_id = self.status_intent(data=data[task_name], text=text)
        return task_name, status_id

    def find_substring(self, substring_description: str, text: str):
        system_prompt = self.config["find_substring"]["system"]
        user_message = (
            self.config["find_substring"]["user"]
            + f" '{substring_description}'. Text: {text}."
        )
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ]
        print(f"input {messages[1]['content']}")
        response_string = (
            self.llm.selected_model.chat_completation(messages=messages)
            .choices[0]
            .message.content
        )

        if not self.is_valid_response_substring(substring=response_string, text=text):
            raise IntentRecognitionResponseTypeError(
                message=f"Substring Intent Classification. AI output: {response_string}", errors=4
            )
        return response_string

    def status_intent(self, data: dict, text: str):
        filterd_data = {}

        for id, value in data.items():
            filterd_data[id] = value["name"]

        response_id = self.best_match(data=filterd_data, text=text)
        if not self.is_valid_response_id(id=response_id, data=filterd_data):
            raise IntentRecognitionResponseTypeError(
                message=f"Status Intent Classification. AI output: {response_id}", errors=3
            )
        return response_id

    def task_intent(self, data: dict, text: str):
        filterd_data = {}
        id = 0
        for key in data:
            filterd_data[str(id)] = key
            id += 1

        response_id = self.best_match(data=filterd_data, text=text)
        if not self.is_valid_response_id(id=response_id, data=filterd_data):
            raise IntentRecognitionResponseTypeError(
                message=f"Task Intent Classification. AI output: {response_id}", errors=2
            )
        return filterd_data[response_id]

    def inital_intent(self, data: dict, text: str):
        response_id = self.best_match(data=data, text=text)
        if not self.is_valid_response_id(id=response_id, data=data):
            raise IntentRecognitionResponseTypeError(
                message="Initial Intent Classification", errors=1
            )
        return response_id

    def best_match(self, data: dict, text: str):
        system_prompt = self.config["best_match"]["system"]
        user_message = self.config["best_match"]["user"] + self.message_compiler(
            user_text=text, data=data
        )
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ]

        return (
            self.llm.selected_model.chat_completation(messages=messages)
            .choices[0]
            .message.content
        )

    def is_valid_response_id(self, id: str, data: dict):
        result = re.search("\D", id)
        if result:
            return False
        try:
            data[id]
        except KeyError as err:
            return False
        return True

    def is_valid_response_substring(self, substring: str, text: str):
        return len(list(substring)) < len(list(text))

    def message_compiler(self, user_text: str, data: dict):
        return f" Sentence: '{user_text}' Options: {data}"
