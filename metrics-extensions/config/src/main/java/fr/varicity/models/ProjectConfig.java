package fr.varicity.models;

import java.util.List;



public record ProjectConfig(String name,  String path, String sourceRoot,SonarCloud sonarcloud,
                            String buildEnv,String tag, List<String> buildCmds, String sonarqubeUrl, boolean buildCmdIncludeSonar) {
   
    public static final record SonarCloud(boolean use, String url){

    }
}


