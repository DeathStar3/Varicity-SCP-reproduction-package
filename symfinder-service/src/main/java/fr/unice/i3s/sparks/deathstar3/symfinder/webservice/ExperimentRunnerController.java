package fr.unice.i3s.sparks.deathstar3.symfinder.webservice;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.unice.i3s.sparks.deathstar3.deserializer.ConfigLoader;
import fr.unice.i3s.sparks.deathstar3.model.ExperimentConfig;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint("/start-websocket/{name}")
@ApplicationScoped
public class ExperimentRunnerController {

    @Inject
    ExperimentRunnerService experimentRunnerService;

    @Inject
    SessionStore sessionStore;

    ConfigLoader configLoader = new ConfigLoader();


    private final ObjectMapper objectMapper = new ObjectMapper();

    @OnOpen
    public void onOpen(Session session, @PathParam("name") String name) {
        sessionStore.put(name, session);
    }

    @OnClose
    public void onClose(Session session, @PathParam("name") String name) {
        sessionStore.remove(name);
    }

    @OnError
    public void onError(Session session, @PathParam("name") String name, Throwable throwable) {
        sessionStore.remove(name);
    }

    @OnMessage
    public void onMessage(String experimentConfigString, @PathParam("name") String name) {

        ExperimentConfig experimentConfig = null;

        try {
            experimentConfig = configLoader.deserializeConfigFile(experimentConfigString).get(0);
            experimentRunnerService.validateExperiment(experimentConfig);
        } catch (Exception e) {
            experimentRunnerService.sendExperimentInvalidToUI(sessionStore.get(name), e);
        }
        if (experimentConfig != null) {
            this.experimentRunnerService.sendExperimentStartedToUI(sessionStore.get(name));
            this.experimentRunnerService.runExperimentInBackground(sessionStore.get(name), experimentConfig);

        }

    }
}
