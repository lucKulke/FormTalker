import os
import json
from library.components import Section
from library.ais import LLM

file = open("output_json/test.json", "r")
API_KEY = input("enter api key for chatgpt:")
dict_obj = json.loads(file.read())




sections = []

for key, value in dict_obj.items():

    sections.append(Section(ids=[*value], name=key, options=value))

for section in sections:
    print(section)


llm = LLM(llm_type="chatgpt", model="gpt-3.5-turbo", api_key=API_KEY)
