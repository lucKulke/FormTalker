import sounddevice as sd
import numpy as np
import wave
import keyboard
import threading
import time
import sys

class VoiceRecorder:
    def __init__(self, filename="recording.wav", samplerate=44100, channels=2):
        self.filename = filename
        self.samplerate = samplerate
        self.channels = channels
        self.recording = False
        self.frames = []
        self.stream = None
        self.animation_thread = None

    def audio_callback(self, indata, frames, time, status):
        if self.recording:
            self.frames.append(indata.copy())

    def start_recording(self):
        self.recording = True
        self.frames = []
        self.stream = sd.InputStream(samplerate=self.samplerate, channels=self.channels, callback=self.audio_callback)
        self.stream.start()
        print("Recording started... Press 'R' to stop.")
        self.animation_thread = threading.Thread(target=self.show_animation)
        self.animation_thread.start()

    def stop_recording(self):
        self.recording = False
        self.stream.stop()
        self.stream.close()
        self.save_recording()
        self.animation_thread.join()
        print("Recording stopped. File saved as 'recording.wav'.")

    def save_recording(self):
        wf = wave.open(self.filename, 'wb')
        wf.setnchannels(self.channels)
        wf.setsampwidth(2)
        wf.setframerate(self.samplerate)
        wf.writeframes(b''.join([frame.tobytes() for frame in self.frames]))
        wf.close()

    def show_animation(self):
        animation = "|/-\\"
        idx = 0
        while self.recording:
            sys.stdout.write("\r" + animation[idx % len(animation)])
            sys.stdout.flush()
            idx += 1
            time.sleep(0.1)
        sys.stdout.write("\r \r")  # Clear the animation

