from agents import *
from flask import Flask, render_template, request, jsonify, url_for

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route('/favicon.ico')
def favicon():
    return url_for('static', filename='images/open_moji_leg.png')

@app.route("/rewrite", methods=["POST"])
def rewrite():
    data = request.get_json()
    text = data.get("text")
    task = data.get("task")
    model = data.get("model")

    agent = Agent(model=model, task=task, content=text)

    return jsonify(agent)

@app.route("/summarize", methods=["POST"])
def summarize():
    print("Got Request")
    data = request.get_json()
    text = data.get("text")
    model = data.get("model")

    agent = Agent(model=model, task="summarize", content=text, rewrite=False)

    return jsonify(agent)

@app.route("/random", methods=["POST"])
def random_text():
    print("Got Request")
    data = request.get_json()
    model = data.get("model")
    agent = Agent(model=model, task="random", content="Write about anything", rewrite=False)
    return jsonify(agent)

if __name__ == "__main__":
    app.run()
