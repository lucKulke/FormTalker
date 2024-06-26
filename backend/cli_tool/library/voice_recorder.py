import pyaudio
import wave
import keyboard
import threading
import time
import sys
import base64
from io import BytesIO


class VoiceRecorder:
    def __init__(
        self, filename="recording.wav", samplerate=44100, channels=1, chunk=1024
    ):
        self.filename = filename
        self.samplerate = samplerate
        self.channels = channels
        self.chunk = chunk
        self.recording = False
        self.frames = []
        self.stream = None
        self.animation_thread = None
        self.pyaudio_instance = pyaudio.PyAudio()
        self.set_input_device()

    def set_input_device(self):
        devices = []
        print("Available input devices:")
        for i in range(self.pyaudio_instance.get_device_count()):
            info = self.pyaudio_instance.get_device_info_by_index(i)
            if info["maxInputChannels"] > 0:
                devices.append(i)
                print(
                    f"{i}: {info['name']} (max input channels: {info['maxInputChannels']})"
                )

        try:
            input_device_index = int(input("Select input device index: "))
            if input_device_index not in devices:
                raise ValueError
            self.input_device_index = input_device_index
        except (ValueError, IndexError):
            print("Invalid device index. Using default device.")
            self.input_device_index = (
                self.pyaudio_instance.get_default_input_device_info()["index"]
            )

    def start_recording(self):
        try:
            self.recording = True
            self.frames = []
            self.stream = self.pyaudio_instance.open(
                format=pyaudio.paInt16,
                channels=self.channels,
                rate=self.samplerate,
                input=True,
                input_device_index=self.input_device_index,
                frames_per_buffer=self.chunk,
            )

            threading.Thread(target=self.record).start()
        except Exception as e:
            print(f"Error starting recording: {e}")

    def record(self):
        while self.recording:
            try:
                data = self.stream.read(self.chunk)
                self.frames.append(data)
            except Exception as e:
                print(f"Error recording audio: {e}")
                break

    def stop_recording(self):
        self.recording = False
        if self.stream is not None:
            self.stream.stop_stream()
            self.stream.close()
            self.stream = None
        if self.animation_thread is not None:
            self.animation_thread.join()
            self.animation_thread = None

        base64_audio = self.encode_recording_to_base64()
        self.frames = []
        return base64_audio

    def save_recording(self):
        try:
            with wave.open(self.filename, "wb") as wf:
                wf.setnchannels(self.channels)
                wf.setsampwidth(self.pyaudio_instance.get_sample_size(pyaudio.paInt16))
                wf.setframerate(self.samplerate)
                wf.writeframes(b"".join(self.frames))
        except Exception as e:
            print(f"Error saving recording: {e}")

    def show_animation(self):
        animation = "|/-\\"
        idx = 0
        while self.recording:
            sys.stdout.write("\r" + animation[idx % len(animation)])
            sys.stdout.flush()
            idx += 1
            time.sleep(0.1)
        sys.stdout.write("\r \r")  # Clear the animation

    def close(self):
        if self.pyaudio_instance is not None:
            self.pyaudio_instance.terminate()
            self.pyaudio_instance = None

    def encode_recording_to_base64(self):
        try:
            buffer = BytesIO()
            with wave.open(buffer, "wb") as wf:
                wf.setnchannels(self.channels)
                wf.setsampwidth(self.pyaudio_instance.get_sample_size(pyaudio.paInt16))
                wf.setframerate(self.samplerate)
                wf.writeframes(b"".join(self.frames))

            buffer.seek(0)
            audio_data = buffer.read()
            base64_audio = base64.b64encode(audio_data).decode("utf-8")
            return base64_audio
        except Exception as e:
            print(f"Error encoding recording to Base64: {e}")
            return None
