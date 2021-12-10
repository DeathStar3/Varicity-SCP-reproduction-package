package fr.unice.i3s.sparks.deathstar3.strategy.sonar.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class SonarMetricAvailable {

    private List<Metric> metrics;

    @Override
    public String toString() {
        return "SonarMetricAvailable{" +
                "metrics=" + metrics +
                '}';
    }

    public void formatPrint() {
        System.err.printf(" %45s | %80s | %20s | %6s \n", "name", "description", "type", "hidden");
        System.err.print(" --------------------------------------------- | -------------------------------------------------------------------------------- | -------------------- | ------ \n");
        for (Metric metric : metrics) {
            metric.formatPrint();
        }
        System.err.println("");
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Metric {

        private String key;
        private String description;
        private String type;
        private boolean hidden;

        @Override
        public String toString() {
            return "Metric{" +
                    "key='" + key + '\'' +
                    ", description='" + description + '\'' +
                    ", type='" + type + '\'' +
                    ", hidden=" + hidden +
                    '}';
        }

        public void formatPrint() {
            String desc = description;
            if (desc == null) {
                desc = "";
            }
            if (desc.length() > 80) {
                desc = description.substring(0, 77) + "...";
            }
            System.err.printf(" %45s | %80s | %20s | %6s \n", key, desc, type, hidden);
        }
    }
}
