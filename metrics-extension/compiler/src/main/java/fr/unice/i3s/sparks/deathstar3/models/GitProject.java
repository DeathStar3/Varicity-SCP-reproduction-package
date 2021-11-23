package fr.unice.i3s.sparks.deathstar3.models;

import java.util.List;

public record GitProject(String name, String repositoryUrl, String destination, List<String> tagIds, String commitIds) {
}
