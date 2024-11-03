import json
import ollama
from time import time, sleep


def load_prompts():
  with open('prompts.json', 'r') as f:
    prompts = json.load(f)
  return prompts

def Agent(model:str, task: str, content: str, rewrite: bool=True):
  prompts = load_prompts()
  system = prompts["rewrite"][task] if rewrite else prompts[task]
  
  start_time = time()
  
  try:
    response = ollama.chat(model=model,
                           messages=[{'role': 'system', 'content': system},
                                     {'role': 'user','content': content}
                                    ])
  except:
    return {"err": "You do not have this model"}
  
  message = response['message']['content']

  end_time = time()
  total_time = end_time - start_time
  total_time = round(total_time, 2)
  
  returned_output = {"time": total_time, "response": message}
  return returned_output
