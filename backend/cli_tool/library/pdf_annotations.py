import json
from pypdf import PdfReader


class Reader:
    def __init__(self, path: str) -> None:
        self.reader = PdfReader(path)
        pass

    def all_annotations(self):
        annotations = {}

        for page in self.reader.pages:
            if "/Annots" in page:
                for annot in page["/Annots"]:
                    obj = annot.get_object()
                    annotations[obj["/Contents"]] = obj["/Rect"]

        return annotations


class Writer:
    def __init__(self, path: str) -> None:
        self.reader = PdfReader(path)

    def annotation(self):
        pass
