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

package fr.unice.i3s.sparks.deathstar3.strategy;

import fr.unice.i3s.sparks.deathstar3.serializer.model.Node;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
public class MetricGathering {

    private MetricGatheringStrategy strategy;

    public MetricGathering(MetricGatheringStrategy strategy) {
        this.strategy = strategy;
    }

    /**
     * Gather the metrics for a given source and save them in a Json file
     */
    public List<Node> gatherAndSaveMetrics(String sourceUrl, String componentName, List<String> metrics) {

        try {
            List<Node> nodes = strategy.getMetrics(sourceUrl, componentName, metrics);
            log.debug("Metrics gathered: " + nodes.stream().limit(500).collect(Collectors.toList()));
            return nodes;
        } catch (Exception e) {
            e.printStackTrace();
        }
        log.warn("Returning an empty list");
        return List.of();
    }
}
