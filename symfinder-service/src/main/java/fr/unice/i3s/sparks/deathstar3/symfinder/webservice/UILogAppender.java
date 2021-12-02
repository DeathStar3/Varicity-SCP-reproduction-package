package fr.unice.i3s.sparks.deathstar3.symfinder.webservice;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.AppenderBase;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.websocket.Session;

public class UILogAppender extends AppenderBase<ILoggingEvent> {
    private final ObjectMapper objectMapper = new ObjectMapper();
    private Session session;
    public UILogAppender(Session session){
        this.session=session;
    }

    @Override
    protected void append(ILoggingEvent eventObject) {
        try {
            this.session.getAsyncRemote().sendText( objectMapper.writeValueAsString( new SymfinderServiceResponse(SymfinderServiceResponse.SymfinderServiceResponseType.EXPERIMENT_PROGRESS, eventObject.getFormattedMessage()) ));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }
}
