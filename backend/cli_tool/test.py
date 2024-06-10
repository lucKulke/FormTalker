import os
import json

file = open("output_json/test.json", "r")

dict_obj = json.loads(file.read())


class Section:
    def __init__(self, ids: list, name: str) -> None:
        self.ids = ids
        self.name = name

    def __str__(self) -> str:
        return f"name: {self.name} ids: {self.ids}"


sections = []

for key, value in dict_obj.items():

    sections.append(Section(ids=value.keys(), name=key))

for section in sections:
    print(section)
