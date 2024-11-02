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
    
    agent = Agent(task=task, content=text)

    return jsonify(agent)

@app.route("/summarize", methods=["POST"])
def summarize():
    data = request.get_json()
    text = data.get("text")

    agent = Agent(task="summarize", content=text, rewrite=False)
    time = agent["time"]
    response = agent["response"]

    print(time)

    return jsonify(agent)

@app.route("/random", methods=["GET"])
def random_text():
    agent = Agent(task="random", content="Write about anything", rewrite=False)
    return jsonify(agent)

if __name__ == "__main__":
    app.run()
