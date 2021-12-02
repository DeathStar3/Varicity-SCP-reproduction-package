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
public class SonarResults {

    private Paging paging;
    private List<Component> components;

    @Override
    public String toString() {
        return "SonarResults{" + "paging=" + paging + ", components=" + components + '}';
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Paging {

        private int pageIndex;
        private int pageSize;
        private int total;

        @Override
        public String toString() {
            return "Paging{" + "pageIndex=" + pageIndex + ", pageSize=" + pageSize + ", total=" + total + '}';
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Component {

        private String path;
        private List<Metric> measures;

        @Override
        public String toString() {
            return "Component{" + "path='" + path + '\'' + ", measures=" + measures + '}';
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Metric {

        private String metric;
        private double value;

        @Override
        public String toString() {
            return "Metric{" + "metric='" + metric + '\'' + ", value=" + value + '}';
        }
    }
}
