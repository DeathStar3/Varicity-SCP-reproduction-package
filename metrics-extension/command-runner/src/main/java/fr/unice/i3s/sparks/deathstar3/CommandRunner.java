package fr.unice.i3s.sparks.deathstar3;

import lombok.SneakyThrows;

import java.io.*;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.function.Consumer;

public class CommandRunner implements Runnable {

    private final String workingDirectory;
    private final String shellLocation;
    private final List<String> commands;

    public CommandRunner(String workingDirectory, String shellLocation, List<String> commands) {

        if (shellLocation == null || shellLocation.equals("")){ //If no shell specified : cmd or sh
            if(System.getProperty("os.name").toLowerCase().startsWith("windows")){
                this.shellLocation = "cmd.exe";
            } else {
                this.shellLocation = "sh";
            }
        }else {
            this.shellLocation = shellLocation;
        }

        this.workingDirectory = workingDirectory;
        this.commands = commands;
    }

    @SneakyThrows
    @Override
    public void run() {
        ProcessBuilder builder = new ProcessBuilder();

        commands.add(0, shellLocation);
        builder.command(commands);

        builder.directory(new File(workingDirectory));
        Process process = builder.start();

        StreamGobbler streamGobbler = new StreamGobbler(process.getInputStream(), System.out::println);
        Executors.newSingleThreadExecutor().submit(streamGobbler);

        int exitCode = process.waitFor();
        assert exitCode == 0;
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
