package fr.unice.i3s.sparks.deathstar3;

import lombok.extern.slf4j.Slf4j;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.function.Consumer;

@Slf4j
public class CommandRunner {

    private final String workingDirectory;
    private final String shellLocation;
    private final List<String> commands;

    public CommandRunner(String workingDirectory, String shellLocation, List<String> commands) {

        if (shellLocation == null || shellLocation.equals("")) { //If no shell specified : powershell or sh
            if (System.getProperty("os.name").toLowerCase().startsWith("windows")) {
                this.shellLocation = "powershell.exe";
            } else {
                this.shellLocation = "sh";
            }
        } else {
            this.shellLocation = shellLocation;
        }

        this.workingDirectory = workingDirectory;
        this.commands = commands;
    }

    public void execute() {
        ProcessBuilder builder = new ProcessBuilder();

        for (String cmd : commands) { //Execute each command line, one after the other

            builder.command(shellLocation, cmd).directory(new File(workingDirectory));

            try {
                Process process = builder.start();
                log.info("Execute : " + shellLocation + " " + cmd);

                StreamGobbler streamGobbler = new StreamGobbler(process.getInputStream(), log::debug);
                Executors.newSingleThreadExecutor().submit(streamGobbler);

                int exitCode = process.waitFor();
                assert exitCode == 0;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }


    private static class StreamGobbler implements Runnable {
        private final InputStream inputStream;
        private final Consumer<String> consumer;

        public StreamGobbler(InputStream inputStream, Consumer<String> consumer) {
            this.inputStream = inputStream;
            this.consumer = consumer;
        }

        @Override
        public void run() {
            new BufferedReader(new InputStreamReader(inputStream)).lines().forEach(consumer);
        }
    }
}
