/*
 *
 *  This file is part of symfinder.
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
 *
 */

package fr.unice.i3s.sparks.deathstar3.sourcesfetcher;


import fr.unice.i3s.sparks.deathstar3.model.ExperimentConfig;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
public class SourceFetcher {

    public String normalizeRepositoryUrl(String repositoryUrl) {
        repositoryUrl = repositoryUrl.strip();
        if (repositoryUrl.endsWith(".git")) {
            return repositoryUrl;
        } else {
            return repositoryUrl + ".git";
        }
    }

    public List<String> cloneRepository(ExperimentConfig config) throws GitAPIException, IOException {
        List<String> destinations = new ArrayList<>();
        if (config.getPath() != null && !config.getPath().isBlank()) {
            Path originalDestinationPath = Path.of(config.getPath(),
                    getRepositoryNameFromUrl(config.getRepositoryUrl()));
            Git gitRepo;
            if (Files.notExists(originalDestinationPath)) {
                gitRepo = Git.cloneRepository().setURI(config.getRepositoryUrl()).setCloneAllBranches(true)
                        .setDirectory(originalDestinationPath.toFile()).call();
            } else {
                gitRepo = Git.open(originalDestinationPath.toFile());
            }

            Set<String> allVersions = new HashSet<>();

            if (config.getTagIds() != null && !config.getTagIds().isEmpty()) {
                allVersions.addAll(config.getTagIds());
            }

            if (config.getCommitIds() != null && !config.getCommitIds().isEmpty()) {
                allVersions.addAll(config.getCommitIds());
            }

            for (String version : allVersions) {
                gitRepo.checkout().setName(version).call();
                Path specificTagPath = Path.of(originalDestinationPath.getParent().toString(),
                        getRepositoryNameFromUrl(config.getRepositoryUrl()) + "-" + version);
                FileUtils.copyDirectory(originalDestinationPath.toFile(), specificTagPath.toFile());
                destinations.add(specificTagPath.toString());
                log.info(destinations.toString());
            }
            FileUtils.deleteDirectory(originalDestinationPath.toFile());
        }
        return destinations;
    }

    public String getRepositoryNameFromUrl(String repositoryUrl) {
        if (repositoryUrl.endsWith(".git")) {
            repositoryUrl = repositoryUrl.substring(0, repositoryUrl.length() - 4);
        }
        String[] parts = repositoryUrl.split("/");
        return parts[parts.length - 1];
    }
}
