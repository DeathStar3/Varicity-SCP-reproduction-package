package fr.unice.i3s.sparks.deathstar3;

import fr.unice.i3s.sparks.deathstar3.model.Config;
import fr.unice.i3s.sparks.deathstar3.parser.ConfigLoader;

import java.io.IOException;

public class Main {

    public static void main(String[] args) throws IOException {

        ConfigLoader configLoader = new ConfigLoader();
        Config config = configLoader.loadConfigFile("./example-config.yaml"); //TODO need to be given as argument

    }
}
