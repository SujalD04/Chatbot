import pyttsx3

engine = pyttsx3.init('sapi5')
voices = engine.getProperty('voices')
engine.setProperty('voice', voices[1].id)
def speak(audio):
    engine.say(audio)
    engine.runAndWait()

import speech_recognition as sr

recognizer = sr.Recognizer()

with sr.Microphone() as source:
    print("Adjusting for ambient noise, please wait...")
    recognizer.adjust_for_ambient_noise(source, duration=1)
    print("Listening...")
    audio = recognizer.listen(source)

try:
    print("Recognizing...")
    text = recognizer.recognize_google(audio, language='en-in')
    print(f"Text: {text}")

except sr.UnknownValueError:
    print("Sorry, I did not understand that.")
except sr.RequestError as e:
    print(f"Could not request results; {e}")

def word():
    return text

