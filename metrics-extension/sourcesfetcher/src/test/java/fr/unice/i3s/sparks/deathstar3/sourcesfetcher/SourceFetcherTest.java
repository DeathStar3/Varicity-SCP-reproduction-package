package fr.unice.i3s.sparks.deathstar3.sourcesfetcher;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Set;

import org.eclipse.jgit.api.errors.GitAPIException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import fr.unice.i3s.sparks.deathstar3.model.ExperimentConfig;

public class SourceFetcherTest {

    private SourceFetcher sourceFetcher = new SourceFetcher();

    @Test
    public void cloneRepositoryTest() throws GitAPIException, IOException {

        Path path = Files.createTempDirectory("varicity-test-dir");
        ExperimentConfig config = new ExperimentConfig();
        config.setRepositoryUrl("https://github.com/DeathStar3-projects/4A_ISA_TheCookieFactory.git");
        config.setTagIds(Set.of("v2.2", "persistent"));
        config.setCommitIds(Set.of("fbe48191a64051ea0d3463c9175084c45a4bfe1b"));

        config.setPath(path.toString());

        this.sourceFetcher.cloneRepository(config);

        // 1 clone original + 2 tagIds + 1 commitIds

        Assertions.assertEquals(4, path.toFile().list().length);
    }
}
