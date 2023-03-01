# SimfinderJS

## Dependencies

This project is in TypeScript.
It also used a test framework, [Jest](https://jestjs.io/fr/) and the framework used to detect code duplication is Jscpd, repo [here](https://github.com/kucherenko/jscpd) and the npm doc [here](https://www.npmjs.com/package/jscpd).

All Javascript dependencies are specified in the **package.json** file and can be installed with the ```npm install```command or by exec ```./prepare.sh```.

## Preparation

To install all dependencies:

>>```./prepare.sh```


## Run SymfinderJS

### Via the Run.sh file:

#### Not sending result 

>>```./run.sh <githuburl>```

#### Sending result

>>```./run.sh <githuburl> -http <targeturl>```

``<targeturl>`` can be empty or invalid. In this case, it will use the default value ``http://localhost:3000/projects`` who is the url for the local docker container of the Varicity-Backend.
The format of the data sent is the object the Varicity-Backend expect for a project. 

For example:

>>```./run.sh https://github.com/apache/echarts```

### Via the manual procedure:

>> There are several steps to follow in order to run the app correctly
>> All explanations are focused on the project **Echarts**, more info at the end
>> Here they are:

>> **Prerequisites** : Install Docker, NodeJS, NPM (should be included in NodeJS) and then the TypeScript compiler TSC. You can install it with the following command ``` npm install -g typescript```
>> 1. Create a folder **experiments** at the same level as app (in /js)
>> 2. Download into the experiments folder the Github project you want to analyze (echarts link : https://github.com/apache/echarts). You should consider not including the .git folder to ensure a reasonable processing time. You can either do a git clone or download the zip file and unzip it into the experiments folder.
>> 3. Run the Neo4J container in Docker ``` docker run -d -p7474:7474 -p7687:7687 -e NEO4J_AUTH=neo4j/root neo4j:4.1.9 ```
>> 4. Install NPM dependencies in js/app ``` npm install ```
>> 5. Build the app still in js/app ``` npm run build ```
>> 6. Run the analysis from js/app with the following cmd ``` PROJECT_PATH=experiments/echarts node lib/index.js```. Here applied to echarts </br>
>> 7. It is possible to run the analysis process from a specific directory and not from the root as you can see [here](https://github.com/DeathStar3-projects/symfinder-js-ter-m1/blob/main/js/neo4J%20analysis%20results/ECharts/echart-chart_analysis.png). To replicate this picture the command is ``` PROJECT_PATH=experiments/echarts/src/chart node lib/index.js```
>> 8. Anyway all visuals can be find even from the project's root. This [one](https://github.com/DeathStar3-projects/symfinder-js-ter-m1/blob/main/js/neo4J%20analysis%20results/ECharts/echarts_vp_folders.png) can be obtained by running analysis on root (i.e step 6), then you have to use neo4j's filter to find **VP_Folder** only and finally by expanding nodes. If you follow the same process you can also obtained the same result but this time you can execute analysis from the src directory with this command: ```PROJECT_PATH=experiments/echarts/src node lib/index.js```
>> 9. Finally, you can find some metrics about the project in your console, and you can go visualize it with Neo4J on http://localhost:7474.

## Concerning Test cases

### To run a test case

- Run the ``` run_test.sh ``` file and specify the name of directory that is placed in the directory **test_project** as a parameter. **Before** running test make sure you have the docker running and that all dependencies are installed.

### To create a test

- In the directory **test_project** create a directory that contains the file architecture you want to test and then create a test file in the directory **app/tests/** that is name like this : ```<previously_created_directory_name>.test.ts```

- To write the test in jest with TypeScript, [here](https://jestjs.io/docs/getting-started#using-typescript)

### Test tool chain

Execute a project and compare the values obtained with those excepted. Its aim is to easily see the changes in the graph after code modifications are made.
The values monitor are:
- The files count
- The variants count
- The nodes count
- The relationships count
- The number of unknown paths during the usage detection
- The number of unknown export objects

This script takes 8 arguments: the github link of the project, the commit, and the 6 excepted values.

#### test_medium_projects script
Test 5 medium projects: Ionic-Framework, Prisma, NativeScript, TypeORM and NestJS. It can be used to check if regressions happened or the code modifications changed the right values and without side effects.


#### test_big_projects script
Test 6 big projects: VSCode, Angular, BabylonJS, n8n, AzureDataStudio and Grafana. It can be used to check the consistency of SymfinderJS and if it scales without problems.
  
## ECharts

- Git repository [here](https://github.com/apache/echarts)
- web site [here](https://echarts.apache.org/en/index.html)
- Neo4j visuals of Echarts, obtained during previous TER, [here](https://github.com/DeathStar3-projects/symfinder-js-ter-m1/tree/main/js/neo4J%20analysis%20results/ECharts)
## Results

- You can always visualize your neo4j results at ```http://localhost:7474/browser/```
