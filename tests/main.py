import requests

projects_names= requests.get('http://localhost:3000/projects/names').json()

try:
    print(projects_names)
    assert len(projects_names) == 26
except:
    exit(1)
