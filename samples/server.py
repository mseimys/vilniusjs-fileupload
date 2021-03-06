import os
from flask import Flask, request, redirect, url_for, jsonify
from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder='')

UPLOAD_FOLDER = '/tmp'


@app.route("/upload", methods=['POST'])
def upload():
    count = 0
    for fh in request.files.getlist('myfile'):
        if fh.filename:
            filename = secure_filename(fh.filename)
            fh.save(os.path.join(UPLOAD_FOLDER, filename))
            count += 1
            app.logger.info("Uploaded %s", filename)
    if request.is_xhr:
        return jsonify(message="{0} files uploaded".format(count))
    else:
        return redirect(url_for('index'))


@app.route("/upload_chunks", methods=['POST'])
def upload_chunks():
    app.logger.info("Chunk info: %s", request.args)
    chunk_content = request.data
    # Check to see if all the chunks are there
    return jsonify(message="Chunk uploaded")


@app.route("/")
def index():
    items = ['<a href="/{0}">{0}</a>'.format(x)
             for x in ['simple', 'async', 'iframe', 'dnd', 'progress', 'filereader', 'chunks']]
    return "<br>".join(items)

@app.route("/simple")
def simple():
    return app.send_static_file("0_simple.html")

@app.route("/async")
def async():
    return app.send_static_file("1_async.html")

@app.route("/iframe")
def iframe():
    return app.send_static_file("2_iframehack.html")

@app.route("/dnd")
def dnd():
    return app.send_static_file("3_dragndrop.html")

@app.route("/progress")
def progress():
    return app.send_static_file("4_progress.html")

@app.route("/filereader")
def filereader():
    return app.send_static_file("5_filereader.html")

@app.route("/chunks")
def chunks():
    return app.send_static_file("6_chunks.html")


if __name__ == "__main__":
    app.run(debug=True)
