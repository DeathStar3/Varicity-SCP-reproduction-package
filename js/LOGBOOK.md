# SimfinderJS

## How to run the app

> ### Via the Run.sh file:
>> for this procedure, go and check the [README.md](https://github.com/DeathStar3-projects/symfinder-js-ter-m1/blob/main/js/README.md)

> ### Via the manual procedure:

>> There are several steps to follow in order to run the app correctly
>> Here they are:

>> **Prerequisites** : Install Docker, NodeJS, NPM (should be included in NodeJS) and then the TypeScript compiler TSC. You can install it with the following command ``` npm install -g typescript```

>> 1. Run the Neo4J container in Docker ``` docker run -d -p7474:7474 -p7687:7687 -e NEO4J_AUTH=neo4j/root neo4j ``` 
>> 2. Install NPM dependencies in js/app ``` npm install ```
>> 3. Build the app still in js/app ``` npm run build ``` 
>> 4. Download into the experiments folder the Github project you want to analyze. You should consider not including the .git folder to ensure a reasonable processing time.
>> 5. Run the analysis from js/app with the following cmd ``` PROJECT_PATH=experiments/<path/name> node lib/index.js```
>> 6. Finally, you can find some metrics about the project in your console, and you can go visualize it with Neo4J on http://localhost:7474.


## About the choices

> ### The analyzed language :
>> We are actually working on TS and not JS. Why ?
>> There are two reasons about this choice:
>>> 1. The language's dynamism is not in line with analysis process for the moment. Indeed we are performing a static analysis here.So all the dynamic mechanisms that are the strength of JavaScript are here the problem.
>>> 2. Typescript offers more stability than JS in terms of what you can do or not with the code, adn the structure. Also all the today great companies are changing their JS architercture into TS ones.

## First analysis results

> ### Grafana:
>> It is sort of our benchmark since this is the one that has been really studied during the first part of the project. Here are some metrics:
>>> - Number of VPs: 1444
>>> - Number of methods VPs: 1
>>> - Number of constructor VPs: 0
>>> - Number of method level VPs: 1
>>> - Number of class level VPs: 1443
>>> - Number of variants: 135
>>> - Number of methods variants: 2
>>> - Number of constructors variants: 0
>>> - Number of method level variants: 2
>>> - Number of class level variants: 133
>>> - Number of variant files: 229
>>> - Number of variant folder: 113
>>> - Number of vp folder: 20
>>> - Number of proximity entities: 214
>>> - Number of nodes: 22028
>>> - Number of relationships: 30299

> ### Echarts from Apache:

>>> - Number of VPs: 1444
>>> - Number of methods VPs: 28
>>> - Number of constructor VPs: 0
>>> - Number of method level VPs: 28
>>> - Number of class level VPs: 712
>>> - Number of variants: 226
>>> - Number of methods variants: 85
>>> - Number of constructors variants: 0
>>> - Number of method level variants: 85
>>> - Number of class level variants: 141
>>> - Number of variant files: 79
>>> - Number of variant folder: 56
>>> - Number of vp folder: 4
>>> - Number of proximity entities: 66
>>> - Number of nodes: 15749
>>> - Number of relationships: 23487

> ### Azure data studio from Microsoft:

>>> - Number of VPs: 4998
>>> - Number of methods VPs: 176
>>> - Number of constructor VPs: 41
>>> - Number of method level VPs: 217
>>> - Number of class level VPs: 4781
>>> - Number of variants: 3911
>>> - Number of methods variants: 436
>>> - Number of constructors variants: 121
>>> - Number of method level variants: 557
>>> - Number of class level variants: 3354
>>> - Number of variant files: 290
>>> - Number of variant folder: 200
>>> - Number of vp folder: 85
>>> - Number of proximity entities: 530
>>> - Number of nodes: 114854
>>> - Number of relationships: 151918

> ### ZRender:

>>> - Number of VPs: 115
>>> - Number of methods VPs: 14
>>> - Number of constructor VPs: 0
>>> - Number of method level VPs: 14
>>> - Number of class level VPs: 101
>>> - Number of variants: 61
>>> - Number of methods variants: 25
>>> - Number of constructors variants: 0
>>> - Number of method level variants: 25
>>> - Number of class level variants: 36
>>> - Number of variant files: 12
>>> - Number of variant folder: 6
>>> - Number of vp folder: 1
>>> - Number of proximity entities: 71
>>> - Number of nodes: 4599
>>> - Number of relationships: 5761

> ### TypeScript:

>>> - Number of VPs: 1581
>>> - Number of methods VPs: 12
>>> - Number of constructor VPs: 2
>>> - Number of method level VPs: 14
>>> - Number of class level VPs: 1567
>>> - Number of variants: 84
>>> - Number of methods variants: 31
>>> - Number of constructors variants: 6
>>> - Number of method level variants: 37
>>> - Number of class level variants: 47
>>> - Number of variant files: 11
>>> - Number of variant folder: 9
>>> - Number of vp folder: 3
>>> - Number of proximity entities: 142
>>> - Number of nodes: 37642
>>> - Number of relationships: 38397