# Procedures

This module contains Neo4J user defined procedures that are placed into with the `deathstar3/symfinder-neo4j` image.
The `Dockerfile` allows you to build that image.

```shell
docker build -t deathstar3/symfinder-neo4j:local .
```

__Notes__
- Template of a procedure: https://github.com/neo4j-examples/neo4j-procedure-template
- Documentation on user-defined procedures: https://neo4j.com/developer/cypher/procedures-functions/