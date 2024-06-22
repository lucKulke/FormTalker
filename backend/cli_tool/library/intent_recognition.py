import re
from .llms import LLM
from .data_components import FormData


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

    def process(self, form_data: FormData, text: str, conversation_history: dict):
        task_name = self.task_intent(form_data=form_data, text=text)
        response_id, user_message = self.status_intent(
            form_data=form_data, task_name=task_name, text=text
        )

        if task_name in conversation_history:
            correction_id, correction_message = self.correction_intent(
                form_data=form_data,
                task_name=task_name,
                text=text,
                conversation_history=conversation_history,
            )
            if correction_id == None:
                return task_name, response_id, None
            conversation_history[task_name].append(
                {
                    "user_message": correction_message,
                    "response_id": correction_id,
                }
            )

            return task_name, response_id, correction_id
        else:
            conversation_history[task_name] = [
                {
                    "user_message": user_message,
                    "response_id": response_id,
                }
            ]
            return task_name, response_id, None

    def correction_intent(
        self,
        form_data: FormData,
        task_name: str,
        text: str,
        conversation_history: dict,
    ):

        if self.is_correction(
            conversation_history=conversation_history,
            text=text,
            task_name=task_name,
            form_data=form_data,
        ):
            messages = self.get_previous_conversation(
                conversation_history=conversation_history, task_name=task_name
            )
            # for user_text in conversation_history[task_name].items()

            options = {}
            for message_data in conversation_history[task_name]:
                response_id = message_data["response_id"]
                options[response_id] = form_data[task_name][response_id].description

            options["400"] = "nothing of the given options"
            correction_message = (
                self.config["best_match"]["user"]
                + " Which is the opposite option of the one he wants to correct? Only select one of these options!"
                + self.message_compiler(user_text=text, data=options)
            )

            messages.append({"role": "user", "content": correction_message})
            response_id = self.best_match(messages=messages)
            return response_id, correction_message
        return None, None

    def get_previous_conversation(self, conversation_history: dict, task_name: str):
        system_prompt = self.config["best_match"]["system"]  # get system prompt for llm
        messages = [{"role": "system", "content": system_prompt}]

        for message_data in conversation_history[task_name]:
            messages.append({"role": "user", "content": message_data["user_message"]})
            messages.append(
                {"role": "assistant", "content": message_data["response_id"]}
            )

        return messages

    def is_correction(
        self, conversation_history: dict, text: str, task_name: str, form_data: FormData
    ):

        messages = self.get_previous_conversation(
            conversation_history=conversation_history,
            task_name=task_name,
        )

        options = {}
        options[task_name] = {
            "1": "yes, he want to correct one of his previous statements",
            "2": "no, he doese not want to correct one of his previous statements",
        }

        correction_message = (
            self.config["best_match"]["user"]
            + " Doese the user want to correct one of his previous statements?"
            + self.message_compiler(user_text=text, data=options)
        )

        messages.append({"role": "user", "content": correction_message})

        response_id = self.best_match(messages=messages)

        response_id = response_id.strip()
        if not self.is_valid_response_id(id=response_id, data=[]):
            raise IntentRecognitionResponseTypeError(
                message=f"Correction Intent Classification. AI output: {response_id}",
                errors=2,
            )
        if response_id == "1":
            return True
        return False

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
                message=f"Substring Intent Classification. AI output: {response_string}",
                errors=4,
            )
        return response_string

    def status_intent(self, form_data: FormData, task_name: str, text: str):
        filterd_data = form_data[task_name].get_field_id_and_description()

        system_prompt = self.config["best_match"]["system"]
        user_message = self.config["best_match"]["user"] + self.message_compiler(
            user_text=text, data=filterd_data
        )
        system_prompt = {"role": "system", "content": system_prompt}
        user_message = {"role": "user", "content": user_message}

        messages = [system_prompt, user_message]

        response_id = self.best_match(messages=messages)
        response_id = self.clean_response_id(response_id=response_id)
        if not self.is_valid_response_id(id=response_id, data=filterd_data):
            raise IntentRecognitionResponseTypeError(
                message=f"Status Intent Classification. AI output: {response_id}",
                errors=3,
            )
        return response_id, user_message["content"]

    def task_intent(self, form_data: FormData, text: str):
        filterd_data = {}
        id = 0

        for key in form_data.list_of_task_names():
            filterd_data[str(id)] = key
            id += 1

        system_prompt = self.config["best_match"]["system"]
        user_message = self.config["best_match"]["user"] + self.message_compiler(
            user_text=text, data=filterd_data
        )
        system_prompt = {"role": "system", "content": system_prompt}
        user_message = {"role": "user", "content": user_message}
        messages = [system_prompt, user_message]

        response_id = self.best_match(messages=messages)
        response_id = self.clean_response_id(response_id=response_id)
        if not self.is_valid_response_id(id=response_id, data=filterd_data):
            raise IntentRecognitionResponseTypeError(
                message=f"Task Intent Classification. AI output: {response_id}",
                errors=2,
            )
        return filterd_data[response_id]

    def clean_response_id(self, response_id: str):
        response_id = response_id.strip()
        id_char_list = list(response_id)
        if id_char_list[0] == '"' or id_char_list[0] == "'":
            response_id = "".join(id_char_list[1:-1])
        return response_id

    def best_match(self, messages: list):

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
        return f" Sentence: '{user_text}' Options: {data}"
