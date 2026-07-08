import urllib.request
import json

req = urllib.request.Request("http://localhost:8000/api/v1/content/chunk/list/")
try:
    with urllib.request.urlopen(req) as response:
        print(json.dumps(json.loads(response.read()), indent=2))
except Exception as e:
    print(e)
