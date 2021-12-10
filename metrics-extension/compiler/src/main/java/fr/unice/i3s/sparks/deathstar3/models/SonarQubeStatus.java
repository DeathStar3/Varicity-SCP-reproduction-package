package fr.unice.i3s.sparks.deathstar3.models;

import java.util.Objects;

public final class SonarQubeStatus {
    private final String id;
    private final String version;
    private final String status;

    public SonarQubeStatus(String id, String version, String status) {
        this.id = id;
        this.version = version;
        this.status = status;
    }

    public String id() {
        return id;
    }

    public String version() {
        return version;
    }

    public String status() {
        return status;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == this) return true;
        if (obj == null || obj.getClass() != this.getClass()) return false;
        var that = (SonarQubeStatus) obj;
        return Objects.equals(this.id, that.id) &&
                Objects.equals(this.version, that.version) &&
                Objects.equals(this.status, that.status);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, version, status);
    }

    @Override
    public String toString() {
        return "SonarQubeStatus[" +
                "id=" + id + ", " +
                "version=" + version + ", " +
                "status=" + status + ']';
    }


}
