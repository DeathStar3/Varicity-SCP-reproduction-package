package fr.unice.i3s.sparks.deathstar3.projectbuilder;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.core.DockerClientBuilder;
import fr.unice.i3s.sparks.deathstar3.models.GitProject;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
public abstract class SourcesFetcher {

    //



    public  abstract  List<GitProject> fetchSources( List<GitProject> projects);



}
