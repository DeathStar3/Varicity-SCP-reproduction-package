package fr.unice.i3s.sparks.deathstar3.models;

import java.util.List;



public record Variability(List<Node> nodes, List<Link> links, List<Allnode> allnodes, List<Linkscompose> linkscompose,
        List<Alllink> alllinks) {

    // import com.fasterxml.jackson.databind.ObjectMapper; // version 2.11.1
    // import com.fasterxml.jackson.annotation.JsonProperty; // version 2.11.1
    /*
     * ObjectMapper om = new ObjectMapper(); Root root = om.readValue(myJsonString),
     * Root.class);
     */
    public record Method(String name, int number) {

    }

    public record Constructor(String name, int number) {

    }

    public record Attribute(String name, int number) {

    }

    public record Node(List<String> types, int constructorVPs, List<Method> methods, int allMethods,
            List<Constructor> constructors, int publicConstructors, int methodVariants, int methodVPs,
            int publicMethods, int constructorVariants, String name, List<Attribute> attributes, int nbCompositions) {

    }

    public record Link(String type, String source, String target) {

    }

    public record Allnode(List<String> types, int constructorVPs, List<Method> methods,
            List<Object> interfaceAttributes, int allMethods, List<Constructor> constructors, int publicConstructors,
            int methodVariants, int methodVPs, int publicMethods, int constructorVariants, String name,
            List<Attribute> attributes, int nbCompositions) {

    }

    public record Linkscompose(String type, String source, String target) {

    }

    public record Alllink(String type, String source, String target) {

    }

}
