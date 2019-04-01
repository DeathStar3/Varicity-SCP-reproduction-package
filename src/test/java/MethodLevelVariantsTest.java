import neo4j_types.EntityType;
import neo4j_types.RelationType;
import org.junit.Test;
import org.neo4j.driver.v1.types.Node;

import static org.junit.Assert.assertEquals;

public class MethodLevelVariantsTest extends Neo4JTest {

    @Test
    public void OneClassNoConstructorVariantNoMethodVariant() {
        runTest(graph -> {
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS);
            Node rectangleConstructor = graph.createNode("Rectangle", EntityType.CONSTRUCTOR);
            Node drawMethod = graph.createNode("draw", EntityType.METHOD);
            graph.linkTwoNodes(rectangleClass, rectangleConstructor, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, drawMethod, RelationType.METHOD);
            assertEquals(0, graph.getNbMethodVariants());
            assertEquals(0, graph.getNbConstructorVariants());
            assertEquals(0, graph.getNbMethodLevelVariants());
        });
    }

    @Test
    public void OneClassNoConstructorVariantTwoMethodVariants() {
        runTest(graph -> {
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS);
            Node rectangleConstructor = graph.createNode("Rectangle", EntityType.CONSTRUCTOR);
            Node drawMethod1 = graph.createNode("draw", EntityType.METHOD);
            Node drawMethod2 = graph.createNode("draw", EntityType.METHOD);
            graph.linkTwoNodes(rectangleClass, rectangleConstructor, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, drawMethod1, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, drawMethod2, RelationType.METHOD);
            assertEquals(2, graph.getNbMethodVariants());
            assertEquals(0, graph.getNbConstructorVariants());
            assertEquals(2, graph.getNbMethodLevelVariants());
        });
    }

    @Test
    public void OneClassTwoConstructorVariantsNoMethodVariant() {
        runTest(graph -> {
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS);
            Node rectangleConstructor1 = graph.createNode("Rectangle", EntityType.CONSTRUCTOR);
            Node rectangleConstructor2 = graph.createNode("Rectangle", EntityType.CONSTRUCTOR);
            Node drawMethod = graph.createNode("draw", EntityType.METHOD);
            graph.linkTwoNodes(rectangleClass, rectangleConstructor1, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, rectangleConstructor2, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, drawMethod, RelationType.METHOD);
            assertEquals(0, graph.getNbMethodVariants());
            assertEquals(2, graph.getNbConstructorVariants());
            assertEquals(2, graph.getNbMethodLevelVariants());
        });
    }

    @Test
    public void OneClassTwoConstructorVariantsTwoMethodVariants() {
        runTest(graph -> {
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS);
            Node rectangleConstructor1 = graph.createNode("Rectangle", EntityType.CONSTRUCTOR);
            Node rectangleConstructor2 = graph.createNode("Rectangle", EntityType.CONSTRUCTOR);
            Node drawMethod1 = graph.createNode("draw", EntityType.METHOD);
            Node drawMethod2 = graph.createNode("draw", EntityType.METHOD);
            graph.linkTwoNodes(rectangleClass, rectangleConstructor1, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, rectangleConstructor2, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, drawMethod1, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, drawMethod2, RelationType.METHOD);
            assertEquals(2, graph.getNbMethodVariants());
            assertEquals(2, graph.getNbConstructorVariants());
            assertEquals(4, graph.getNbMethodLevelVariants());
        });
    }


    @Test
    public void TwoClasses() {
        runTest(graph -> {
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS);
            Node rectangleConstructor1 = graph.createNode("Rectangle", EntityType.CONSTRUCTOR);
            Node rectangleConstructor2 = graph.createNode("Rectangle", EntityType.CONSTRUCTOR);
            Node circleClass = graph.createNode("Circle", EntityType.CLASS);
            Node drawMethod1 = graph.createNode("draw", EntityType.METHOD);
            Node drawMethod2 = graph.createNode("draw", EntityType.METHOD);
            Node drawMethod3 = graph.createNode("draw", EntityType.METHOD);
            graph.linkTwoNodes(rectangleClass, rectangleConstructor1, RelationType.METHOD);
            graph.linkTwoNodes(rectangleClass, rectangleConstructor2, RelationType.METHOD);
            graph.linkTwoNodes(circleClass, drawMethod1, RelationType.METHOD);
            graph.linkTwoNodes(circleClass, drawMethod2, RelationType.METHOD);
            graph.linkTwoNodes(circleClass, drawMethod3, RelationType.METHOD);
            assertEquals(3, graph.getNbMethodVariants());
            assertEquals(2, graph.getNbConstructorVariants());
            assertEquals(5, graph.getNbMethodLevelVariants());
        });
    }

}