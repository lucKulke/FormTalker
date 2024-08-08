import json

string = "{'43': {'in ordnung': 'None'}, '44': {'nicht in ordnung': 'x'}, '45': {'behoben': 'None'}, '46': {'Mindesthaltbarkeitsdatum': '20.02.23'}}"
json.loads(string)
