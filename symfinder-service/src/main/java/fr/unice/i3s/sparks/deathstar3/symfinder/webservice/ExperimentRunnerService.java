package fr.unice.i3s.sparks.deathstar3.symfinder.webservice;

import ch.qos.logback.classic.Logger;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.unice.i3s.sparks.deathstar3.engine.configuration.HotspotsParameters;
import fr.unice.i3s.sparks.deathstar3.engine.configuration.Neo4jParameters;
import fr.unice.i3s.sparks.deathstar3.engine.configuration.ParametersObject;
import fr.unice.i3s.sparks.deathstar3.entrypoint.MetricExtensionEntrypoint;
import fr.unice.i3s.sparks.deathstar3.exceptions.InvalidExperimentException;
import fr.unice.i3s.sparks.deathstar3.model.ExperimentConfig;
import fr.unice.i3s.sparks.deathstar3.model.ExperimentResult;
import io.smallrye.mutiny.Uni;
import io.smallrye.mutiny.infrastructure.Infrastructure;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.validation.ConstraintViolation;
import javax.validation.Validator;
import javax.websocket.Session;
import java.util.Optional;
import java.util.Set;

@ApplicationScoped
public class ExperimentRunnerService {

    @Inject
    @RestClient
    VaricityBackendService varicityBackendService;
    MetricExtensionEntrypoint metricExtensionEntrypoint = new MetricExtensionEntrypoint();
    ParametersObject parametersObject;
    @ConfigProperty(name = "symfinder.neo4j.boltAddress", defaultValue = "bolt://localhost:7687")
    String boltAddress;
    String user = "";
    String password = "";
    @ConfigProperty(name = "symfinder.hotspots.nbAggregationsThreshold", defaultValue = "5")
    int nbAggregationsThreshold;
    @ConfigProperty(name = "symfinder.hotspots.nbVariantsThreshold", defaultValue = "20")
    int nbVariantsThreshold;
    @Inject
    Validator validator;
    private final ObjectMapper objectMapper = new ObjectMapper();

    //TODO more checks
    public void validateExperiment(ExperimentConfig experimentConfig) {
        Set<ConstraintViolation<ExperimentConfig>> violations = validator.validate(experimentConfig);

        if (!violations.isEmpty()) {
            throw new InvalidExperimentException(violations.toString());
        }
        if ((experimentConfig.getRepositoryUrl() == null || experimentConfig.getRepositoryUrl().isBlank()) &&
                (experimentConfig.getPath() == null || experimentConfig.getPath().isBlank())) {
            throw new InvalidExperimentException("If the repositoryUrl is not provided then the path must be provided");
        }
        //if sonarqube if needed and compilation is needed then a buildEnv and buildEnvTag must be provided
    }


    public void sendExperimentInvalidToUI(Optional<Session> session, Exception experimentException) {
        if (session.isEmpty()) {
            return;
        }
        try {
            String message = objectMapper.writeValueAsString(
                    new SymfinderServiceResponse(SymfinderServiceResponse.SymfinderServiceResponseType.EXPERIMENT_INVALID, experimentException.getMessage())
            );
            session.get().getAsyncRemote().sendObject(message);
        } catch (JsonProcessingException ex) {
            ex.printStackTrace();

        }
        return;
    }

    public void sendExperimentFailedToUI(Optional<Session> session, Throwable exception) {
        if (session.isEmpty()) {
            return;
        }
        try {
            String message = objectMapper.writeValueAsString(
                    new SymfinderServiceResponse(SymfinderServiceResponse.SymfinderServiceResponseType.EXPERIMENT_FAILED, exception.getMessage())
            );
            session.get().getAsyncRemote().sendObject(message);
        } catch (JsonProcessingException ex) {
            ex.printStackTrace();

        }
        return;
    }

    public void sendExperimentStartedToUI(Optional<Session> session) {
        if (session.isEmpty()) {
            return;
        }
        try {
            String message = objectMapper.writeValueAsString(
                    new SymfinderServiceResponse(SymfinderServiceResponse.SymfinderServiceResponseType.EXPERIMENT_STARTED, "Experiment started.")
            );
            session.get().getAsyncRemote().sendObject(message);
        } catch (JsonProcessingException ex) {
            ex.printStackTrace();

        }
        return;
    }

    public void sendExperimentSucceededToUI(Optional<Session> session, ExperimentResult experimentResult) {
        try {
            String message = objectMapper.writeValueAsString(new SymfinderServiceResponse(SymfinderServiceResponse.SymfinderServiceResponseType.EXPERIMENT_COMPLETED,
                    experimentResult.symfinderResult().statisticJson())
            );
            session.get().getAsyncRemote().sendObject(message);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

    }


    private void sendExperimentResultToVaricityBackend(ExperimentResult experimentResult) {
        try {
            this.varicityBackendService.createNewProject(experimentResult);
        } catch (Exception exception) {
            exception.printStackTrace();
        }
    }

    public void runExperimentInBackground(Optional<Session> session, ExperimentConfig experimentConfig) {
        if (session.isEmpty()) {
            return;
        }

        Uni.createFrom().item(experimentConfig.getProjectName()).emitOn(Infrastructure.getDefaultWorkerPool()).subscribe()
                .with((i) -> {

                            try {

                                Logger root = (Logger) LoggerFactory.getLogger(org.slf4j.Logger.ROOT_LOGGER_NAME);
                                //TO BE CONTINUED

                                root.getAppender("STDOUT").stop();

                                ExperimentResult experimentResult = metricExtensionEntrypoint.runExperiment(experimentConfig, parametersObject);

                                this.sendExperimentSucceededToUI(session, experimentResult);
                                System.out.println("Done with the experiment");
                                this.sendExperimentResultToVaricityBackend(experimentResult);
                            } catch (Exception e) {
                                this.sendExperimentFailedToUI(session, e);
                            }
                        }
                        , exception -> this.sendExperimentFailedToUI(session, exception));
    }


    @PostConstruct
    void postConstruct() {
        this.parametersObject = new ParametersObject(new Neo4jParameters(this.boltAddress, this.user, this.password),
                new HotspotsParameters(this.nbVariantsThreshold, this.nbAggregationsThreshold), "");

        System.out.println(this.parametersObject);
    }

}
