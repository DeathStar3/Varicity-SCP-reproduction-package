/*
 * This file is part of symfinder.
 *
 *  symfinder is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  symfinder is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with symfinder. If not, see <http://www.gnu.org/licenses/>.
 *
 *  Copyright 2018-2021 Johann Mortara <johann.mortara@univ-cotedazur.fr>
 *  Copyright 2018-2021 Xhevahire Tërnava <t.xheva@gmail.com>
 *  Copyright 2018-2021 Philippe Collet <philippe.collet@univ-cotedazur.fr>
 */

package fr.unice.i3s.sparks.deathstar3;

import fr.unice.i3s.sparks.deathstar3.model.MetricSource;
import fr.unice.i3s.sparks.deathstar3.serializer.model.Node;
import fr.unice.i3s.sparks.deathstar3.strategy.MetricGathering;
import fr.unice.i3s.sparks.deathstar3.strategy.sonar.sonarcloud.SonarCloudStrategy;
import fr.unice.i3s.sparks.deathstar3.strategy.sonar.sonarqube.SonarQubeStrategy;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
@NoArgsConstructor
public class MetricGatherer {

    /**
     * Gather for each source in Config the associate metrics
     */
    public List<Node> gatherMetrics(String projectName, MetricSource source) {

        MetricGathering strategy = strategySelection(source.getName());

        if (strategy != null) {

            List<Node> nodes = strategy.gatherAndSaveMetrics(source.getRootUrl(), source.getComponentName(), source.getMetrics());
            log.info("The metrics from " + projectName + ":" + source.getName() + " were collected and saved (json)");
            return nodes;
        } else {
            log.warn("Returning empty list");
            return List.of();
        }


    }

    /**
     * Select the Strategy to run using the sourceName
     */
    public MetricGathering strategySelection(String sourceName) {
        switch (sourceName.toLowerCase()) {
            case "sonar-qube":
            case "sonarqube":
                return new MetricGathering(new SonarQubeStrategy());
            case "sonar-cloud":
            case "sonarcloud":
                return new MetricGathering(new SonarCloudStrategy());
            default:
                return null;
        }
    }
}
