from flask import Flask, request, jsonify, render_template
import ImCap
import speak
import speech_recognition as sr

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('chat.html')

@app.route('/report')
def report():
    return render_template('report.html')
"""
@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    question = data.get('question')
    if not question:
        return jsonify({'error': 'No question provided'}), 400
    answer = returnAns.returnMessage(question)
    return jsonify({'result': answer})"""

@app.route('/capture',methods=['POST'])
def capture():
    data= request.json
    kword=data.get('kword')
    if not kword:
        return jsonify({'error': 'No question provided'}), 400
    retkword = ImCap.check(kword)
    return jsonify({'result':retkword})
    

@app.route('/speak', methods=['POST'])
def spoke():
    data =request.json
    word=data.get('word')
    if not word:
        return jsonify({'error': 'No question provided'}), 400
    answer = speak.speaks(word)
    return jsonify({'result': answer})

@app.route('/talk', methods=['GET'])
def listen_and_convert():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("Say something!")
        audio = recognizer.listen(source)

    try:
        # Recognize speech using Google Web Speech API
        text = recognizer.recognize_google(audio)
        return jsonify({"message": text})
    except sr.UnknownValueError:
        return jsonify({"message": "Could not understand the audio"}), 400
    except sr.RequestError:
        return jsonify({"message": "Could not request results; check your network connection"}), 500

if __name__ == '__main__':
    app.run(debug=True)
