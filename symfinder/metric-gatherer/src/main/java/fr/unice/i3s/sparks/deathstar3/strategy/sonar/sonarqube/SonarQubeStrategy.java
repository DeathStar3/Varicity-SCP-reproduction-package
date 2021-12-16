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

package fr.unice.i3s.sparks.deathstar3.strategy.sonar.sonarqube;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import fr.unice.i3s.sparks.deathstar3.strategy.sonar.model.SonarMetricAvailable;
import fr.unice.i3s.sparks.deathstar3.strategy.sonar.sonarcloud.SonarCloudStrategy;
import fr.unice.i3s.sparks.deathstar3.utils.HttpRequest;

public class SonarQubeStrategy extends SonarCloudStrategy {

    private final ObjectMapper objectMapper = new ObjectMapper(new YAMLFactory());
    private final HttpRequest httpRequest = new HttpRequest();

    /**
     * In case of error we will display the available metrics
     */
    @Override
    public void displayAvailableMetrics(String rootUrl, String projectName) {

        String url = rootUrl + "/api/metrics/search?&component=" + projectName;

        try {
            String json = httpRequest.get(url);
            SonarMetricAvailable sonarMetricAvailable = objectMapper.readValue(json, SonarMetricAvailable.class);

            System.err.println("\n >>> Project Name: " + projectName + " (source = SonarQube)");
            sonarMetricAvailable.formatPrint();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
