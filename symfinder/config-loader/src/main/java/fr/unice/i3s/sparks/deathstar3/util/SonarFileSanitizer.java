package fr.unice.i3s.sparks.deathstar3.util;

import fr.unice.i3s.sparks.deathstar3.serializer.model.Node;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
public class SonarFileSanitizer {

    private List <Node> nodes;
    private String projectSourcesRoot;
    private Optional <String> sonarDirectory;

    public SonarFileSanitizer(List <Node> nodes, String projectSourcesRoot, String sonarDirectory) {
        this.nodes = nodes;
        this.projectSourcesRoot = projectSourcesRoot;
        this.sonarDirectory = getSonarDirectory(sonarDirectory);
    }

    private Optional <String> getSonarDirectory(String sonarDirectory) {
        if (sonarDirectory.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(sonarDirectory.endsWith("/") ? sonarDirectory : sonarDirectory + "/");
    }

    public List <Node> getSanitizedOutput() {
        return nodes.stream().map(this::sanitizeNode).collect(Collectors.toList());
    }

    public Node sanitizeNode(Node node) {
        String nodeName = sonarDirectory.map(dir -> node.getName().replaceAll(String.format("^%s", dir), "")).orElseGet(node::getName);
        Path filePath = Paths.get(projectSourcesRoot, nodeName);
        if (filePath.getFileName().toString().endsWith(".java")) {  // we do not care about files that are not Java classes
            String className = filePath.getFileName().toString().replaceAll(".java", "");
            String packageName = getPackageName(filePath);
            if (! packageName.isEmpty()) {
                String qualifiedName = String.join(".", packageName, className);
                node.setName(qualifiedName);
            }
        }
        return node;
    }

    private static String getPackageName(final Path path) {
        Pattern packagePattern = Pattern.compile("^package (.*);$");
        final Predicate <String> predicate = packagePattern.asPredicate();
        try (final Stream <String> stream = Files.lines(path, StandardCharsets.UTF_8)) {
            System.out.println(path);
            Optional <String> packageLine = Optional.empty();
            try {
                packageLine = stream.filter(predicate).findFirst();
            } catch (UncheckedIOException e) { // sometimes files can have unexpected characters inside
                log.error(String.format("Characters problems in %s%n", path));
            }
            if (packageLine.isPresent()) {
                Matcher matcher = packagePattern.matcher(packageLine.get());
                matcher.matches();
                return matcher.group(1);
            } else {
                log.info(String.format("File %s does not have a package declaration.%n", path));
            }
        } catch (NoSuchFileException e) {
            log.error(String.format("File %s does not exist%n", path));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "";
    }

    private static List <String> findLines(final Path path, final String pattern) throws IOException {
        final Predicate <String> predicate = Pattern.compile(pattern).asPredicate();
        try (final Stream <String> stream = Files.lines(path)) {
            return stream.filter(predicate).collect(Collectors.toList());
        }
    }
}
