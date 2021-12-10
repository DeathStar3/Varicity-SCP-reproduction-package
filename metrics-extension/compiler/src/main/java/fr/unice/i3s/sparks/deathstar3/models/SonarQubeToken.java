package fr.unice.i3s.sparks.deathstar3.models;

import java.util.Objects;

public final class SonarQubeToken {
    private final String login;
    private final String name;
    private final String token;
    private final String createdAt;

    public SonarQubeToken(String login, String name, String token, String createdAt) {
        this.login = login;
        this.name = name;
        this.token = token;
        this.createdAt = createdAt;
    }

    public String login() {
        return login;
    }

    public String name() {
        return name;
    }

    public String token() {
        return token;
    }

    public String createdAt() {
        return createdAt;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == this) return true;
        if (obj == null || obj.getClass() != this.getClass()) return false;
        var that = (SonarQubeToken) obj;
        return Objects.equals(this.login, that.login) &&
                Objects.equals(this.name, that.name) &&
                Objects.equals(this.token, that.token) &&
                Objects.equals(this.createdAt, that.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(login, name, token, createdAt);
    }

    @Override
    public String toString() {
        return "SonarQubeToken[" +
                "login=" + login + ", " +
                "name=" + name + ", " +
                "token=" + token + ", " +
                "createdAt=" + createdAt + ']';
    }

}
