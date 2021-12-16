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

import fr.unice.i3s.sparks.deathstar3.model.ExperimentConfig;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

@Slf4j
public class CommandScheduler {

    public void schedule(List<ExperimentConfig> configs) {

        MetricGatherer metricGatherer = new MetricGatherer();

        List<Thread> threads = new ArrayList<>();
/*
        for (ExperimentConfig config : configs) {
            for (MetricSource source : config.getSources()) {
                if (source.isEnabled()) {

                    Thread t = new Thread(() -> {

                        new CommandRunner(source.getWorkingDirectory(), source.getShellLocation(), source.getCommands()).execute();
                        log.info("All commands from " + config.getProjectName() + ":" + source.getName() + " were executed");

                        metricGatherer.gatherMetrics(config.getProjectName(), source);
                    });
                    threads.add(t);
                }
            }
        }
*/
        // Start all the threads
        for (Thread t : threads) {
            t.start();
        }
        // Join all the threads
        for (Thread t : threads) {
            try {
                t.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        log.info("Metrics-extension process completed for all projects!");
        System.exit(0); //End of program
    }
}
