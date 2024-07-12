from openai import OpenAI
import openai
from logging import Logger


class ChatGPTInitializationError(Exception):
    def __init__(self, message, errors):
        # Call the base class constructor with the parameters it needs
        super().__init__(message)

        # Now for your custom code...
        self.errors = errors


class LLM:
    def __init__(self, logger: Logger, llm_type: str, model: str, api_key: str) -> None:
        match llm_type:
            case "chatgpt":
                self.selected_model = ChatGPT(
                    logger=logger, model=model, api_key=api_key
                )


class ChatGPT:
    def __init__(self, logger: Logger, model: str, api_key: str) -> None:
        self.openai_client = OpenAI(api_key=api_key)
        self.model = model
        self.logger = logger
        if not (self.validate_init_arguments()):
            raise ChatGPTInitializationError(
                "ChatGPT error during validation of parameters. View log file for more information.",
                403,
            )

    def validate_init_arguments(self):
        test_messages = [
            {"role": "system", "content": "Respond with yes."},
            {"role": "user", "content": "is this a test?"},
        ]
        if self.chat_completation(messages=test_messages):
            return True
        return False

    def chat_completation(self, messages: list):
        try:
            response = self.openai_client.chat.completions.create(
                model=self.model, messages=messages
            )
            return response
        except openai.NotFoundError as err:
            self.logger.critical(err.message)
        except openai.AuthenticationError as err:
            self.logger.critical(err.message)
        return None
