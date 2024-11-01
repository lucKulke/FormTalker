import os
import json
import ast
import logging
import keyboard
import time
import argparse
from library.llms import LLM, ChatGPTInitializationError
from library import intent_recognition
from library.pdf_annotations import Reader, Writer
from library.data_components import DataMapper, FormData, Fields, Field
from dotenv import load_dotenv
from library.voice_recorder import VoiceRecorder
from library.speech_recognition import SpeechRecognizer

load_dotenv()
API_KEY = os.getenv("CHATGPT_API_KEY")
RUNPOD_API_KEY = os.getenv("RUNPOD_API_KEY")
RUNPOD_ENDPOINT_ID = os.getenv("RUNPOD_ENDPOINT_ID")


# Create the parser
parser = argparse.ArgumentParser(description="A simple example script.")

# Add arguments
parser.add_argument(
    "--base_pdf_path",
    type=str,
    help="Path for raw pdf",
    default="../../raw_example_pdfs/example.pdf",
)

parser.add_argument(
    "--annotated_pdf_path",
    type=str,
    help="Path for preped pdf",
    default="annotated_pdfs/annotated.pdf",
)
parser.add_argument(
    "--output_pdf_path",
    type=str,
    help="Path of output pdf",
    default="output_pdfs/filled_pdf_.pdf",
)

parser.add_argument(
    "--form_representation_data",
    type=str,
    help="Path to json file that represents form data",
    default="data/form_representation_data.json",
)
parser.add_argument(
    "--form_trainings_data",
    type=str,
    help="Path to json file that contains trainings data for specific fields in form",
    default="data/trainings_data.json",
)
parser.add_argument(
    "--llm_config",
    type=str,
    help="Path to json file that contains llm config information",
    default="configs/llm_prompt_config.json",
)

# Parse the arguments
args = parser.parse_args()


def setup_logging():
    logger = logging.getLogger(__name__)
    logger.setLevel(logging.DEBUG)

    console_handler = logging.StreamHandler()
    file_handler = logging.FileHandler("app.log")

    console_handler.setLevel(logging.INFO)
    file_handler.setLevel(logging.ERROR)

    console_formatter = logging.Formatter("%(name)s - %(levelname)s - %(message)s")
    file_formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )

    console_handler.setFormatter(console_formatter)
    file_handler.setFormatter(file_formatter)

    logger.addHandler(console_handler)
    logger.addHandler(file_handler)
    return logger


def handle_intent_recognition_error(e):
    if isinstance(e, intent_recognition.IntentRecognitionIntendedTaskResponseTypeError):
        logging.error(f"IntentRecognitionIntendedTaskResponseTypeError: {e}")
    elif isinstance(
        e, intent_recognition.IntentRecognitionIntendedFieldResponseTypeError
    ):
        logging.error(f"IntentRecognitionIntendedFieldResponseTypeError: {e}")
    elif isinstance(
        e, intent_recognition.IntentRecognitionSplitIntentsResponseTypeError
    ):
        logging.error(f"IntentRecognitionSplitIntentsResponseTypeError: {e}")
    elif isinstance(
        e, intent_recognition.IntentRecognitionCorrectionIntendResponseTypeError
    ):
        logging.error(f"IntentRecognitionCorrectionIntendResponseTypeError: {e}")
    elif isinstance(
        e, intent_recognition.IntentRecognitionIsCorrectionResponseTypeError
    ):
        logging.error(f"IntentRecognitionIsCorrectionResponseTypeError: {e}")
    elif isinstance(
        e, intent_recognition.IntentRecognitionFindRelevantInformationResponseTypeError
    ):
        logging.error(f"IntentRecognitionFindRelevantInformationResponseTypeError: {e}")
    elif isinstance(
        e, intent_recognition.IntentRecognitionCorrectionIntendJsonParsingError
    ):
        logging.error(f"IntentRecognitionCorrectionIntendJsonParsingError: {e}")
    elif isinstance(e, intent_recognition.IntentRecognitionIntendedTaskMatchError):
        logging.error(f"IntentRecognitionIntendedTaskMatchError: {e}")
    elif isinstance(e, intent_recognition.IntentRecognitionIntendedFieldMatchError):
        logging.error(f"IntentRecognitionIntendedFieldMatchError: {e}")
    elif isinstance(
        e, intent_recognition.IntentRecognitionExtractRelevantInformationError
    ):
        logging.error(f"IntentRecognitionExtractRelevantInformationError: {e}")
    else:
        logging.exception("An unexpected error occurred")


def print_filled_sections(form_data: FormData) -> None:
    for name in form_data.get_data():
        if form_data[name].is_at_least_one_field_filled():
            print(f"FORM_FIELDS of {name}:")
            for id, value in form_data[name].get_minimal_fields_information().items():
                print(id + " " + str(value))


def main():
    logger = setup_logging()
    logger.info("Programm Started")

    try:
        with open(args.form_representation_data, "r", encoding="utf-8") as file:
            form_representation_data = json.load(file)
        logger.info("Successfully loaded form_representation_data.json")

        with open(args.form_trainings_data, "r", encoding="utf-8") as file:
            form_trainings_data = json.load(file)
        logger.info("Successfully loaded trainings_data.json")

        with open("configs/llm_prompt_config.json", "r", encoding="utf-8") as file:
            llm_prompt_config = json.load(file)
        logger.info("Successfully loaded trainings_data.json")

    except FileNotFoundError as e:
        logger.error(f"File not found: {e.filename}")
        return 1
    except json.JSONDecodeError as e:
        logger.error(f"Error decoding JSON from file: {e.msg}")
        return 1
    except Exception as e:
        logger.exception("An unexpected error occurred")
        return 1

    try:
        chatgpt = LLM(logger=logger, llm_type="chatgpt", model="gpt-4", api_key=API_KEY)
    except ChatGPTInitializationError as e:
        logger.error(
            "Chat-GPT is not available because the api key or model is wrong! Programm exists now.."
        )
        return 1

    intent_recognizer = intent_recognition.IntentRecognition(
        logger=logger, llm=chatgpt, config=llm_prompt_config
    )

    try:
        pdf_reader = Reader(path=args.annotated_pdf_path)
        pdf_writer = Writer(
            output_pdf_path=args.output_pdf_path,
            base_pdf_path=args.base_pdf_path,
        )
    except Exception as e:
        logger.error(
            "Error is thrown during initialization of PDF Reader and Writer! Programm exits now.."
        )
        return 1

    DataMapper.mapp_data_to_form_representation_data(
        annotation_data=pdf_reader.all_annotations(),
        form_representation_data=form_representation_data,
        form_trainings_data=form_trainings_data,
    )

    form_data = FormData(data=form_representation_data)

    while True:

        text_message = input(">> Enter Text: ")
        intents = intent_recognizer.split(
            user_text_message=text_message,
            trainings_data=form_trainings_data["multi_intent_splitting"],
        )
        logger.info(intents)
        intents_list = ast.literal_eval(intents)

        for intent in intents_list:
            try:
                task_name, fields = intent_recognizer.process(
                    form_data=form_data,
                    user_text_message=intent,
                )
                form_data[task_name].update(fields)
            except intent_recognition.IntentRecognitionError as e:
                handle_intent_recognition_error(e)

        print_filled_sections(form_data=form_data)

        text_message = input("save to pdf and exit? (y/enter to continue): ")
        if text_message == "y":
            pdf_writer.write_to_pdf(form_data=form_data)
            logger.info("Programm ended")
            break


if __name__ == "__main__":
    main()
