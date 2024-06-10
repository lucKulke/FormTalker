import os
import json

file = open("output_json/test.json", "r")

dict_obj = json.loads(file.read())


class Option:
    def __init__(self, id: str, value: str, form_input: str) -> None:
        self.id = id
        self.value = value
        self.form_input = form_input

    def __str__(self) -> str:
        return f"{self.value}"

    def __repr__(self) -> str:
        return f"{self.value}"


class Section:
    def __init__(self, ids: list, name: str, options: dict) -> None:
        self.ids = ids
        self.name = name
        self.options = self.get_options(options)

    def get_options(self, options: dict):
        option_list = []
        for key, value in options.items():
            option_list.append(
                Option(id=key, value=value["name"], form_input=value["form_input"])
            )

        return option_list

    def __str__(self) -> str:
        return f"name: {self.name} ids: {self.ids} options: {self.options}"


class LLM:
    pass


sections = []

for key, value in dict_obj.items():

    sections.append(Section(ids=[*value], name=key, options=value))

for section in sections:
    print(section)
