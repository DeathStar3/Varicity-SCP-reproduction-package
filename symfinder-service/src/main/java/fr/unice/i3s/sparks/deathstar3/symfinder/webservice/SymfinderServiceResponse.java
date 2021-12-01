package fr.unice.i3s.sparks.deathstar3.symfinder.webservice;

public class SymfinderServiceResponse {
    private SymfinderServiceResponseType type;
    private String content;

    public SymfinderServiceResponse(SymfinderServiceResponseType type, String content) {
        this.type = type;
        this.content = content;
    }

    public SymfinderServiceResponseType getType() {
        return type;
    }

    public void setType(SymfinderServiceResponseType type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public enum SymfinderServiceResponseType{
        EXPERIMENT_STARTED,
        EXPERIMENT_INVALID,
        EXPERIMENT_FAILED,
        EXPERIMENT_COMPLETED,
        EXPERIMENT_PROGRESS
        //...
    }
}


