package fr.unice.i3s.sparks.deathstar3.models;

import java.util.List;

public class MetricsSonarqube {

    private List<Component> components;

    public static final record Measure(String metric, String value) {

    }

    public static final record Component(String key, String name, String qualifier, String path, String language,
            List<Measure> measures) {

    }

}
