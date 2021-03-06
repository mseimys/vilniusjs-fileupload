from flask import Flask
from flask import request
from flask import make_response
from flask import Response
import os

app = Flask(__name__, static_url_path='')

state = {
    'files': {}
}

@app.route("/multipart_files", methods=['POST'])
def multipart_files():
    name = request.files.keys()[0]
    state['files'][name] = request.files[name].stream.read()
    return "done"

@app.route("/files/<name>", methods=['GET', 'POST'])
def files(name):
    if request.method == 'POST':
        state['files'][name] = request.stream.read()
        return Response(status=204)
    else:
        response = make_response(state['files'][name])
        response.headers['Content-Type'] = 'application/octet-stream'
        return response

@app.route("/")
def index():
    return app.send_static_file("index.html")

if __name__ == "__main__":
    app.run(debug=True)
