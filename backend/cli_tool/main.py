from pypdf import PdfReader
import os
import json

reader = PdfReader("../../example_pdfs/example2.pdf")

annotations = {}

for page in reader.pages:
    if "/Annots" in page:
        for annot in page["/Annots"]:
            obj = annot.get_object()
            annotations[obj["/Contents"]] = {"location": obj["/Rect"]}


json_file = open("output_json/test.json", "w")
json.dump(annotations, json_file)

print(annotations)
