import json
import os
file = open("../backend/cli_tool/data/test.json","r",encoding='utf-8')
form_filling_data = json.loads(file.read())

#print(form_filling_data)

class Field():
    def __init__ (self, id: str, description: str, form_input_type: str, location: list) -> None:
        self.id = id
        self.description = description
        self.form_input_type = form_input_type
        self.location = location
    
    def __repr__(self):
        return f"id: {self.id} | description: {self.description} | form_input_type: {self.form_input_type} | location: {self.location}"

class Fields():

    def __init__ (self, fields: dict) -> None:
        self._fields = self.init_fields(fields=fields)
    
    def init_fields(self, fields: dict):
        data = {}
        for id, propertys in fields.items(): 
            data[id] = Field(id=id, description=propertys["name"], form_input_type=propertys["form_input"], location=[1,1,3,3])
        return data
    def __repr__(self):
        return f"{self._fields}"

class FormData():
    def __init__ (self, json_data: dict) -> None:
        self._data = self.convert_to_sections(json_data=json_data)

    def __getitem__(self, key):
        return self._data[key]
    
    def __setitem__(self, key, value):
        self._data[key] = value
    
    def __delitem__(self, key):
        del self._data[key]
    
    def __repr__(self):
        return f"{self._data}"

    def convert_to_sections(self, json_data: dict) -> list:
        data = {}
        for task_name, fields in json_data.items():
            data[task_name] = Fields(fields=fields)

        return data

formdata = FormData(json_data=form_filling_data)#["Batterie prüfen (Ladezustand, Kontrollzelle)"]#.fields["0"]
del formdata["Batterie prüfen (Ladezustand, Kontrollzelle)"].fields[""]
print(formdata)