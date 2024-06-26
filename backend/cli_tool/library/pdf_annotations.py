import json
from .data_components import FormData
from pypdf import PdfReader, PdfWriter
from pypdf.annotations import FreeText, Text
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


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
        pass

    def create_annos(self, form_data):
        annotations = []
        for name in form_data.get_data():
            if form_data[name].is_at_least_one_field_filled():
                for id, data in form_data[name].get_ids_and_locations_and_values().items():
                    value = data["value"]
                    if value:
                        # Use the bottom-left corner of the rectangle for the annotation
                        annotations.append({"text": value, "x": data["location"][0], "y": data["location"][1]})
                        
        return annotations

    def write_to_pdf(self, form_data):
        annotations = self.create_annos(form_data)

        # Paths to the PDFs
        base_pdf_path = "library/example.pdf"
        annotation_pdf_path = "annotation.pdf"
        output_pdf_path = "merged_document.pdf"

        # Get the page size from the base PDF
        reader = PdfReader(base_pdf_path)
        first_page = reader.pages[0]
        page_width = first_page.mediabox.width
        page_height = first_page.mediabox.height

        # Create the annotation PDF
        self.create_annotation_pdf(annotations, annotation_pdf_path, (page_width, page_height))

        # Merge the PDFs
        self.merge_pdfs(base_pdf_path, annotation_pdf_path, output_pdf_path)
    
    def create_annotation_pdf(self, annotation_data, output_path, page_size):
        c = canvas.Canvas(output_path, pagesize=page_size)
        width, height = page_size

        for annotation in annotation_data:
            # Adjust the y-coordinate
            print(f"hight = {height}, with = {width}")
            print(f"x = {annotation['x']}  y = {annotation['y']}")
            c.drawString(annotation["x"]+5, annotation["y"] + 5, annotation["text"])

        c.showPage()
        c.save()
    
    def merge_pdfs(self, base_pdf_path, annotation_pdf_path, output_pdf_path):
        # Read the existing PDF
        with open(base_pdf_path, "rb") as base_pdf_file:
            base_pdf = PdfReader(base_pdf_file)
            base_pdf_writer = PdfWriter()

            # Read the annotation PDF
            with open(annotation_pdf_path, "rb") as annotation_pdf_file:
                annotation_pdf = PdfReader(annotation_pdf_file)

                # Merge each page of the base PDF with the corresponding page of the annotation PDF
                for page_num in range(len(base_pdf.pages)):
                    base_page = base_pdf.pages[page_num]
                    annotation_page = annotation_pdf.pages[0]  # Assuming annotations are on the first page

                    base_page.merge_page(annotation_page)
                    base_pdf_writer.add_page(base_page)

            # Save the merged PDF
            with open(output_pdf_path, "wb") as output_pdf_file:
                base_pdf_writer.write(output_pdf_file)
