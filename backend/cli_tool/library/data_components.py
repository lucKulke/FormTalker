class DataMapper:

    @classmethod
    def mapp_anno_to_repre_data(
        cls, annotation_data: dict, form_representation_data: dict
    ):
        for annotaition_id, location in annotation_data.items():
            for task_name, fields in form_representation_data.items():
                for id in fields:
                    if id == annotaition_id:
                        form_representation_data[task_name][id]["location"] = location

        # for task_name, value in form_representation_data.items():
        #     for key in value:
        #         temp_structure[key] = task_name

        # print(temp_structure)
        # for id_test, task_name in temp_structure.items():
        #     form_representation_data[task_name][id_test]["location"] = annotation_data[
        #         id_test
        #     ]


class Field:
    def __init__(
        self, id: str, description: str, form_input_type: str, location: list
    ) -> None:
        self.id = id
        self.description = description
        self.form_input_type = form_input_type
        self.location = location

    def __repr__(self):
        return f"id: {self.id} | description: {self.description} | form_input_type: {self.form_input_type} | location: {self.location}"


class Fields:

    def __init__(self, fields: dict) -> None:
        self._fields = {}
        self.init_fields(fields=fields)

    def init_fields(self, fields: dict):
        self._fields = {}
        for id, propertys in fields.items():
            # print(id)
            self._fields[id] = Field(
                id=id,
                description=propertys["option_name"],
                form_input_type=propertys["form_input"],
                location=propertys["location"],
            )

    def get_field_id_and_description(self):
        data = {}
        for id in self._fields:
            data[id] = self._fields[id].description
        return data

    def __getitem__(self, key):
        return self._fields[key]

    def fields(self):
        return self._fields

    def __repr__(self):
        return f"{self._fields}"


class FormData:
    def __init__(self, data: dict) -> None:
        self._data = self.convert_to_sections(dict_data=data)

    def __getitem__(self, key):
        return self._data[key]

    def __setitem__(self, key, value):
        self._data[key] = value

    def __delitem__(self, key):
        del self._data[key]

    def __repr__(self):
        return f"{self._data}"

    def list_of_task_names(self):
        return list(self._data)

    def convert_to_sections(self, dict_data: dict) -> list:
        data = {}
        for task_name, fields in dict_data.items():
            data[task_name] = Fields(fields=fields)

        return data
