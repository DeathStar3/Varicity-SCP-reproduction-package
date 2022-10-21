# SimfinderJS

## Dependencies

This project is in TypeScript.
I also used a test framework, [Jest](https://jestjs.io/fr/) and the framework used to detect code duplication is Jscpd, repo [here](https://github.com/kucherenko/jscpd) and the npm doc [here](https://www.npmjs.com/package/jscpd).

All dependencies are specified in the **package.json** file and can be installed with the ```npm install```command

## Run SymfinderJS

> ### Via the Run.sh file:

>>```./run.sh <githuburl>```

>>For example:

>>```./run.sh https://github.com/grafana/grafana```

> ### Via the manual procedure:

>> There are several steps to follow in order to run the app correctly
>> Here they are:

>> **Prerequisites** : Install Docker, NodeJS, NPM (should be included in NodeJS) and then the TypeScript compiler TSC. You can install it with the following command ``` npm install -g typescript```

>> 1. Run the Neo4J container in Docker ``` docker run -d -p7474:7474 -p7687:7687 -e NEO4J_AUTH=neo4j/root neo4j ``` 
>> 2. Install NPM dependencies in js/app ``` npm install ```
>> 3. Build the app still in js/app ``` npm run build ``` 
>> 4. Download into the experiments folder the Github project you want to analyze. You should consider not including the .git folder to ensure a reasonable processing time.
>> 5. Run the analysis from js/app with the following cmd ``` PROJECT_PATH=experiments/xxxxx node lib/index.js```
>> 6. Finally, you can find some metrics about the project in your console, and you can go visualize it with Neo4J on http://localhost:7474.



## Results

http://localhost:7474/browser/
