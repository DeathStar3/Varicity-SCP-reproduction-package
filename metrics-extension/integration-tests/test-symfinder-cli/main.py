import requests

projects_names= requests.get('http://localhost:3000/projects/names').json()

try:
    assert len(projects_names) == 1
    assert projects_names[0]== 'junit-r4.13.2'
except:
    exit(1)

