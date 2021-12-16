package fr.unice.i3s.sparks.deathstar3.symfinder.engine.entrypoint;/*
 * This file is part of symfinder.
 *
 * symfinder is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * symfinder is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with symfinder. If not, see <http://www.gnu.org/licenses/>.
 *
 * Copyright 2018-2021 Johann Mortara <johann.mortara@univ-cotedazur.fr>
 * Copyright 2018-2021 Xhevahire Tërnava <t.xheva@gmail.com>
 * Copyright 2018-2021 Philippe Collet <philippe.collet@univ-cotedazur.fr>
 */

import fr.unice.i3s.sparks.deathstar3.projectbuilder.Constants;
import fr.unice.i3s.sparks.deathstar3.symfinder.engine.configuration.Configuration;
import fr.unice.i3s.sparks.deathstar3.symfinder.engine.neograph.NeoGraph;
import fr.unice.i3s.sparks.deathstar3.symfinder.engine.result.SymfinderResult;
import fr.unice.i3s.sparks.deathstar3.symfinder.engine.visitors.ClassesVisitor;
import fr.unice.i3s.sparks.deathstar3.symfinder.engine.visitors.ComposeTypeVisitor;
import fr.unice.i3s.sparks.deathstar3.symfinder.engine.visitors.FactoryVisitor;
import fr.unice.i3s.sparks.deathstar3.symfinder.engine.visitors.GraphBuilderVisitor;
import fr.unice.i3s.sparks.deathstar3.symfinder.engine.visitors.StrategyTemplateDecoratorVisitor;
import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.jdt.core.JavaCore;
import org.eclipse.jdt.core.dom.AST;
import org.eclipse.jdt.core.dom.ASTParser;
import org.eclipse.jdt.core.dom.ASTVisitor;
import org.eclipse.jdt.core.dom.CompilationUnit;
import org.neo4j.driver.exceptions.ClientException;

import java.io.File;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Inspired by https://www.programcreek.com/2014/01/how-to-resolve-bindings-when-using-eclipse-jdt-astparser/
 */
public class Symfinder {

    private static final Logger logger = LogManager.getLogger(Symfinder.class);
    private final String sourcePackage;
    private final NeoGraph neoGraph;
    private final Configuration configuration;

    public Symfinder(String sourcePackage) {
        this.configuration = new Configuration();
        this.sourcePackage = sourcePackage;
        this.neoGraph = new NeoGraph(this.configuration);

    }

    public Symfinder(String sourcePackage, Configuration configuration) {
        this.sourcePackage = sourcePackage;
        this.configuration = configuration;
        this.neoGraph = new NeoGraph(this.configuration);
    }

    static String formatExecutionTime(long execTime) {
        long ms = execTime % 1000;
        long seconds = (execTime - ms) / 1000;
        long s = seconds % 60;
        long minutes = (seconds - s) / 60;
        long m = minutes % 60;
        long hours = (minutes - m) / 60;
        return String.format("%02d:%02d:%02d.%03d", hours, m, s, ms);
    }

    public SymfinderResult run() throws IOException {
        long symfinderStartTime = System.currentTimeMillis();
        String classpathPath = Constants.getJavaPath();
        List<File> files = Files.walk(Paths.get(sourcePackage))
                .filter(Files::isRegularFile)
                .filter(path -> !isTestPath(path))
                .map(Path::toFile)
                .filter(file -> file.getName().endsWith(".java"))
                .collect(Collectors.toList());

        neoGraph.deleteAll();
        System.out.println("Hello after delete");
        try {
            neoGraph.createClassesIndex();
            neoGraph.createInterfacesIndex();
        }catch (ClientException exception){
            //ignorer
        }


        logger.log(Level.getLevel("MY_LEVEL"), "ClassesVisitor");
        visitPackage(classpathPath, files, new ClassesVisitor(neoGraph));
        logger.log(Level.getLevel("MY_LEVEL"), "GraphBuilderVisitor");
        visitPackage(classpathPath, files, new GraphBuilderVisitor(neoGraph));
        logger.log(Level.getLevel("MY_LEVEL"), "StrategyTemplateVisitor");
        visitPackage(classpathPath, files, new StrategyTemplateDecoratorVisitor(neoGraph));
        logger.log(Level.getLevel("MY_LEVEL"), "FactoryVisitor");
        visitPackage(classpathPath, files, new FactoryVisitor(neoGraph));
        logger.log(Level.getLevel("MY_LEVEL"), "ComposeTypeVisitor");
        visitPackage(classpathPath, files, new ComposeTypeVisitor(neoGraph));
        /*logger.log(Level.getLevel("MY_LEVEL"), "LocalVariablesVisitor");
        visitPackage(classpathPath, files, new LocalVariablesVisitor(neoGraph));*/

        neoGraph.detectVPsAndVariants();
        neoGraph.detectHotspots();
        logger.log(Level.getLevel("MY_LEVEL"), "Number of VPs: " + neoGraph.getTotalNbVPs());
        logger.log(Level.getLevel("MY_LEVEL"), "Number of methods VPs: " + neoGraph.getNbMethodVPs());
        logger.log(Level.getLevel("MY_LEVEL"), "Number of constructors VPs: " + neoGraph.getNbConstructorVPs());
        logger.log(Level.getLevel("MY_LEVEL"), "Number of method level VPs: " + neoGraph.getNbMethodLevelVPs());
        logger.log(Level.getLevel("MY_LEVEL"), "Number of class level VPs: " + neoGraph.getNbClassLevelVPs());
        logger.log(Level.getLevel("MY_LEVEL"), "Number of variants: " + neoGraph.getTotalNbVariants());
        logger.log(Level.getLevel("MY_LEVEL"), "Number of methods variants: " + neoGraph.getNbMethodVariants());
        logger.log(Level.getLevel("MY_LEVEL"), "Number of constructors variants: " + neoGraph.getNbConstructorVariants());
        logger.log(Level.getLevel("MY_LEVEL"), "Number of method level variants: " + neoGraph.getNbMethodLevelVariants());
        logger.log(Level.getLevel("MY_LEVEL"), "Number of class level variants: " + neoGraph.getNbClassLevelVariants());
        logger.log(Level.getLevel("MY_LEVEL"), "Number of nodes: " + neoGraph.getNbNodes());
        logger.log(Level.getLevel("MY_LEVEL"), "Number of relationships: " + neoGraph.getNbRelationships());
        logger.log(Level.getLevel("MY_LEVEL"), "Number of corrected inheritance relationships: " + GraphBuilderVisitor.getNbCorrectedInheritanceLinks() + "/" + neoGraph.getNbInheritanceRelationships());

        SymfinderResult result = new SymfinderResult(neoGraph.generateVPJsonGraph(), neoGraph.generateStatisticsJson());
        neoGraph.deleteAll();
        neoGraph.closeDriver();
        long symfinderExecutionTime = System.currentTimeMillis() - symfinderStartTime;
        logger.printf(Level.getLevel("MY_LEVEL"), "Total execution time: %s", formatExecutionTime(symfinderExecutionTime));

        return result;
    }

    private void visitPackage(String classpathPath, List<File> files, ASTVisitor visitor) throws IOException {
        long startTime = System.currentTimeMillis();
        for (File file : files) {
            String fileContent = getFileLines(file);

            ASTParser parser = ASTParser.newParser(AST.getJLSLatest());
            parser.setResolveBindings(true);
            parser.setKind(ASTParser.K_COMPILATION_UNIT);

            parser.setBindingsRecovery(true);

            parser.setCompilerOptions(JavaCore.getOptions());

            parser.setUnitName(file.getCanonicalPath());

            parser.setEnvironment(new String[]{classpathPath}, new String[]{""}, new String[]{"UTF-8"}, true);
            parser.setSource(fileContent.toCharArray());

            Map<String, String> options = JavaCore.getOptions();
            options.put(JavaCore.COMPILER_SOURCE, JavaCore.VERSION_16);
            parser.setCompilerOptions(options);

            System.out.println(file.toPath());

            CompilationUnit cu = (CompilationUnit) parser.createAST(null);
            cu.accept(visitor);
        }
        long elapsedTime = System.currentTimeMillis() - startTime;
        logger.printf(Level.getLevel("MY_LEVEL"), "%s execution time: %s", visitor.getClass().getTypeName(), formatExecutionTime(elapsedTime));
    }

    private boolean isTestPath(Path path) {
        for (int i = 0; i < path.getNameCount(); i++) {
            int finalI = i;
            if (Stream.of("test", "tests").anyMatch(s -> path.getName(finalI).toString().equals(s))) {
                return true;
            }
        }
        return false;
    }

    private String getFileLines(File file) {
        for (Charset charset : Charset.availableCharsets().values()) {
            String lines = getFileLinesWithEncoding(file, charset);
            if (lines != null) {
                return lines;
            }
        }
        return null;
    }

    private String getFileLinesWithEncoding(File file, Charset charset) {
        try (Stream<String> lines = Files.lines(file.toPath(), charset)) {
            return lines.collect(Collectors.joining("\n"));
        } catch (UncheckedIOException e) {
            logger.debug(charset.displayName() + ": wrong encoding");
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }


}

