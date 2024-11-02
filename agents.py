import json
import ollama
from sys import stdout
from time import time, sleep


def load_prompts():
  with open('prompts.json', 'r') as f:
    prompts = json.load(f)
  return prompts

def dolphin(system, content):
  response = ollama.chat(model="qwen2.5:1.5b",
  messages=[
    {
      'role': 'system',
      'content': system
    },
    {
      'role': 'user',
      'content': content,
    }]
  )
  return response['message']['content']

def Agent(task: str, content: str, rewrite: bool=True):
  prompts = load_prompts()
  system = prompts["rewrite"][task] if rewrite else prompts[task]
  
  start_time = time()
  
  response = dolphin(system, content)
  
  end_time = time()
  total_time = end_time - start_time
  total_time = round(total_time, 2)
  
  returned_output = {"time": total_time, "response":response}
  return returned_output