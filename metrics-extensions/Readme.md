# Metrics Extensions

1. Download docker images

```
docker pull sonarqube:9.1.0-community
docker pull sonarsource/sonar-scanner-cli
```

2. Create and run custom sonarqube image

```sh
bash build.sh

docker run --name sonarqubehost -p 9000:9000 --network varicity-config --expose=9000 varicity-sonarqube 

```
3. 