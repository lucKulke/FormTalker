import runpod
import os
import json
import ast


class SpeechRecognizer:

    def __init__(self, api_key: str, endpoint_id: str) -> None:
        runpod.api_key = api_key
        self._endpoint = runpod.Endpoint(endpoint_id)

    def request(self, recording_data):
        try:
            run_request = self._endpoint.run_sync(
                {"input": {"audio_base64": recording_data}},
                timeout=60,  # Timeout in seconds.
            )

            print(run_request["segments"][0]["text"])
        except TimeoutError:
            print("Job timed out.")
