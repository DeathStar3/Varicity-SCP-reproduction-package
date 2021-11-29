package fr.unice.i3s.sparks.deathstar3.utils;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.core.DockerClientBuilder;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.Arrays;

@Slf4j
public class Utils {

    private final DockerClient dockerClient= DockerClientBuilder.getInstance().build();
    public boolean checkIfImageExists(String image, String tag) {
        return dockerClient.listImagesCmd().exec().stream()
                .anyMatch(img -> Arrays.stream(img.getRepoTags()).anyMatch(name -> name.equals(image + ":" + tag)));
    }

    public String getUserIdentity(){
        String user="1000";
        String group="1000";
        if(OSUtils.isUnix()){
            Runtime rt = Runtime.getRuntime();
            try {
              Process process=  rt.exec("id -u");
              Process getGroup= rt.exec("id -g");
              int exitCode= process.waitFor();
              int exitCodeGroup=getGroup.waitFor();
              if(exitCode==0){
                  user= new String(process.getInputStream().readAllBytes()).strip();
              }
              if(exitCodeGroup==0){
                  group=    new String(getGroup.getInputStream().readAllBytes()).strip();
              }
            } catch (IOException | InterruptedException e) {
                e.printStackTrace();
            }
        }

        return user+":"+group;
    }



}
