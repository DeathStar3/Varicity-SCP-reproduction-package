package fr.unice.i3s.sparks.deathstar3.symfinder.webservice;

import javax.enterprise.context.ApplicationScoped;
import javax.websocket.Session;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@ApplicationScoped
public class SessionStore {

    Map<String, Session> sessions = new ConcurrentHashMap<>();

    public Optional<Session> get(String name){
        return Optional.ofNullable ( sessions.get(name));
    }

    public void put(String name, Session session){
        this.sessions.put(name,session);
    }

    public void remove(String name){
        this.sessions.remove(name);
    }
}
