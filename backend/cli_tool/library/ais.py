from openai import OpenAI
import openai
import requests
import json
class LLM:
    def __init__(self, llm_type: str, model: str, api_key: str) -> None:
        match llm_type:
            case "chatgpt":
                self.current_llm = ChatGPT(model=model, api_key=api_key) 




class ChatGPT:
    def __init__(self, model: str, api_key: str) -> None:
        print(model)
        result = self.validate_init_arguments(model=model, api_key=api_key)    
        print(result)

    def validate_init_arguments(self, model: str, api_key: str):
       
        client = OpenAI(api_key=api_key)
        try:
            response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "Respond with yes."},
                {"role": "user", "content": "is this a test?"},
            ])
            # Raises an HTTPError for bad responses (4xx and 5xx)
            # Assuming the response is in JSON format
            return response
        except openai.NotFoundError as err:
            print(err.message)
        except  openai.AuthenticationError as err: 
            print(err.message)
        
         