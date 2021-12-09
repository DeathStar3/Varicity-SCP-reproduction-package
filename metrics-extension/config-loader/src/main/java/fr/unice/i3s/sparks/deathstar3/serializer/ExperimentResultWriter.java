package fr.unice.i3s.sparks.deathstar3.serializer;

import fr.unice.i3s.sparks.deathstar3.model.ExperimentResult;

public interface ExperimentResultWriter {


    void writeResult(ExperimentResult experimentResult) throws Exception;
}
