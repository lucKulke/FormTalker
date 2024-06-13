import json
from pypdf import PdfReader, PdfWriter
from pypdf.annotations import FreeText


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
        self.path = path
        self.reader = PdfReader(path)
        page = self.reader.pages[0]
        self.writer = PdfWriter()
        self.writer.add_page(page)

    def annotation(self, location: list, value: str):

        annotation = FreeText(
            text=value,
            rect=location,
            font="Arial",
            bold=True,
            italic=True,
            font_size="14pt",
            font_color="00ff00",
            border_color="ffffff",
            background_color="ffffff",
        )
        self.writer.add_annotation(page_number=0, annotation=annotation)
        with open("output_pdfs/fillable_pdf.pdf", "wb") as fp:
            self.writer.write(fp)
