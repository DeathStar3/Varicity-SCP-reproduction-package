package fr.unice.i3s.sparks.deathstar3.symfinder.webservice;

import fr.unice.i3s.sparks.deathstar3.model.ExperimentResult;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

@RegisterRestClient(baseUri = "http://localhost:3000")
public interface VaricityBackendService {
    @POST
    @Path("/projects")
    Response createNewProject(ExperimentResult experimentResult);

}
