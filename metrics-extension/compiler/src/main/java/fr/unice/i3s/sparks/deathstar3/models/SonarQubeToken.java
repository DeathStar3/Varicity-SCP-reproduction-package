package fr.unice.i3s.sparks.deathstar3.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Objects;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public final class SonarQubeToken {
    private String login;
    private String name;
    private String token;
    private String createdAt;

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
}
