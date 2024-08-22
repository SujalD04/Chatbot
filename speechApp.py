from flask import Flask, request, jsonify, render_template
import speechToText

app= Flask(__name__)

@app.route('/talk')
def talk():
    text=speechToText.word()
    return jsonify({'result':text})

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)