## Sonarcloud
- https://sonarcloud.io/web_api/api/measures
Pour trouver des projets : 
https://sonarcloud.io/explore/projects?sort=-analysis_date
Pour faire des requêtes sur un projet existant:
- https://sonarcloud.io/api/measures/component_tree?metricKeys=ncloc,complexity&component=SilvanoGil_junit5-maven

## Sonarqube
http://localhost:9000/api/measures/component_tree?metricKeys=ncloc,complexity,coverage&component=cookiefactory-teamo&qualifiers=FIL
Pour filtrer  uniquement les fichiers sources (non-test) on peut utiliser le qualifier **FIL**

Information sur le monitoring d'une instance de Sonarqube 
- https://docs.sonarqube.org/latest/instance-administration/monitoring/
- https://github.com/SonarSource/docker-sonarqube/issues/242

Générer un token à utiliser pour analyser les projets
Exemple de requête
```sh
curl -u admin:3ezPgRfYx5yWud7 -X POST http://localhost:9000/api/user_tokens/generate?name=mytoken
```
Réponse:
```json
{
    "login":"admin",
    "name":"mytoken",
    "token":"54e8e25beff11eeaf30ab82af31be3b678676397",
    "createdAt":"2021-10-24T07:39:19+0000"
}
```

### Ce qu'il reste à trouver:
- SonarQube semble fournir les informations au niveau fichier, il faut chercher si l'API peut lister les inner classes et les nested classes
- Comment récupérer la liste des classes
Trouver les limites de requêtes sur l'API en ligne

How does Sonarqube handle nested class  or how to map class from symfinder to output of sonarqube ?
Analysis with Sonarqube 9+ is only done with java-11
https://docs.sonarqube.org/latest/analysis/analysis-with-java-11/

## SonarScanner

https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/

Pour pouvoir faire les analyses de nos projets avec un minimum d'interaction (de dépendance) avec  l'outil spécifique de build utilisé par le projet qu'on veut analyser (mvn, gradle ...)

SonarScanner (pour Java) semble avoir besoin des fichiers .class de toutes les sources pour fonctionner. 
- [Référence 1](https://sonarqube.inria.fr/sonarqube/documentation/analysis/languages/java/)
- [Réference 2](https://medium.com/@kirandachiraju/3-steps-to-analyze-source-code-with-sonarqube-by-using-docker-5e6cc5dad3c5)
- [Référence 3](https://stackoverflow.com/questions/38989414/why-sonar-requires-binary-files-sonar-binaries)

Est-ce que symfinder est capable d'identifier l'outil de build utilisé dans un projet ou est-ce qu'il fonctionne sans ?
Est-ce que symfinder compile les projets qu'il analyse ?

## Ebauche de fonctionnement



```sh
#L'utilisateur doit fournir 3 paramètres
# url du projet à analyser (optionnel commit id et tag) : réutiliser symfinder-sources-fetcher
# le chemin d'un fichier .properties suivant le format d'un sonar-project.properties
# le chemin d'un fichier exécutable (script) permettant de compiler le projet à analyser (et qui télécharge les dépendances si nécessaire)

# lancer sonarqube sur localhost:9000
docker run --rm -d --name sonarqube -p 9000:9000 sonarqube:9.1.0-community

# attendre que le port soit ouvert

wait-for-it -t 0 localhost:9000

# attendre que sonarqube soit prêt

until [ $(curl --silent localhost:9000/api/system/status | grep UP -c ) == 1 ]
do
  echo "Sonarqube is not ready"
  sleep 2
done

```



## Exemple de sonar-project.properties

```properties

# must be unique in a given SonarQube instance
sonar.projectKey=tcf-cookie-factory

# this is the name and version displayed in the SonarQube UI. Mandatory prior to SonarQube 6.1.
sonar.projectName=JavaStudy

# path to source directories (required)
sonar.projectVersion=1.0

# path to project binaries (optional), for example directory of Java bytecode
#binaries=binDir

# Path is relative to the sonar-project.properties file. Replace "\" by "/" on Windows.
# Since SonarQube 4.2, this property is optional if sonar.modules is set. 
# If not set, SonarQube starts looking for source code from the directory containing 
# the sonar-project.properties file.
#sonar.sources=src
#sonar.binaries=target
sonar.java.binaries=target
#sonar.exclusions=target
# Encoding of the source code. Default is default system encoding
sonar.sourceEncoding=UTF-8

# List of the module identifiers
#sonar.modules=.

# Language
sonar.language=java

# Uncomment those lines if some features of java 5 or java 6 like annotations, enum, ...
 # are used in the source code to be analysed
sonar.java.source=1.8
sonar.java.target=1.8

```
mvn package assembly:single -DskipTests=true