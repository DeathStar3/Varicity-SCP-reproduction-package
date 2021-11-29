package fr.unice.i3s.sparks.deathstar3.projectbuilder;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.model.AccessMode;
import com.github.dockerjava.api.model.Bind;
import com.github.dockerjava.api.model.HostConfig;
import com.github.dockerjava.core.DockerClientBuilder;
import fr.unice.i3s.sparks.deathstar3.models.GitProject;
import fr.unice.i3s.sparks.deathstar3.utils.Utils;

import java.util.List;

public class SourcesFetcherDocker extends SourcesFetcher{

    private final Utils utils;
    private String symfinderFetcherTag;
    public static  final  String SOURCE_FETCHER_IMAGE_NAME="deathstar3/symfinder-fetcher";
    public static final String SOURCE_FETCHER_DEFAULT_TAG="vissoft2021";
    private final DockerClient dockerClient= DockerClientBuilder.getInstance().build();
    private static final String SOURCE_FETCHER_CONTAINER="varicity-symfinder-fetcher-container";
    public SourcesFetcherDocker(){
        this.utils=new Utils();
        this.symfinderFetcherTag= System.getenv("SYMFINDER_FETCHER_TAG");
    }



    private String imageToUse(){
        if(this.symfinderFetcherTag!=null && !this.symfinderFetcherTag.isBlank()){
            return SOURCE_FETCHER_IMAGE_NAME+":"+this.symfinderFetcherTag;
        }
        if(this.utils.checkIfImageExists(SOURCE_FETCHER_IMAGE_NAME, "local")){
            return SOURCE_FETCHER_IMAGE_NAME+":"+this.symfinderFetcherTag;
        }
        return SOURCE_FETCHER_IMAGE_NAME+":"+"";
        
    }

    @Override
    public List<GitProject> fetchSources(List<GitProject> projects) {
/*
        -v $(pwd)/experiments:/experiments -v $(pwd)/symfinder.yaml:/symfinder.yaml -v $(pwd)/resources:/resources
                -v $(pwd)/d3:/d3 -v $(pwd)/generated_visualizations:/generated_visualizations --user $(id -u):$(id -g)






        dockerClient.createContainerCmd(this.imageToUse()).withName(SOURCE_FETCHER_CONTAINER).withUser(this.utils.getUserIdentity())
                .withEnv(List.of("SYMFINDER_VERSION=symfinder-varicity"))
                .withHostConfig(HostConfig.newHostConfig().withBinds(new Bind("", volume, AccessMode.rw)))


*/
        return List.of();
    }
}
