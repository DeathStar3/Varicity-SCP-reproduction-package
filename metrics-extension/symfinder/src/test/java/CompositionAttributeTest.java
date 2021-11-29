import fr.unice.i3s.sparks.deathstar3.engine.neo4j_types.EntityType;
import fr.unice.i3s.sparks.deathstar3.engine.neo4j_types.EntityVisibility;
import fr.unice.i3s.sparks.deathstar3.engine.neo4j_types.RelationType;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.neo4j.driver.types.Node;


public class CompositionAttributeTest extends Neo4jTest {

    @Test
    public void OneAttribute() {
        runTest(graph -> {
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS, EntityVisibility.PUBLIC);
            Node drawClass = graph.createNode("draw", EntityType.CLASS, EntityVisibility.PUBLIC);
            graph.linkTwoNodes(rectangleClass, drawClass, RelationType.INSTANTIATE);
            graph.setNbCompositions();

            Assertions.assertEquals(1, graph.getNbAttributeComposeClass());
        });
    }

    @Test
    public void TwoAttributesPerClass() {
        runTest(graph -> {
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS, EntityVisibility.PUBLIC);
            Node drawClass = graph.createNode("draw", EntityType.CLASS, EntityVisibility.PUBLIC);
            graph.linkTwoNodes(rectangleClass, drawClass, RelationType.INSTANTIATE);

            Node shapeClass = graph.createNode("Shape", EntityType.CLASS, EntityVisibility.PUBLIC);
            graph.linkTwoNodes(rectangleClass, shapeClass, RelationType.INSTANTIATE);
            graph.setNbCompositions();

            Assertions.assertEquals(2, graph.getNbAttributeComposeClass());
        });
    }

    @Test
    public void MultipleRelations() {
        runTest(graph -> {
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS, EntityVisibility.PUBLIC);
            Node drawClass = graph.createNode("draw", EntityType.CLASS, EntityVisibility.PUBLIC);
            Node fillClass = graph.createNode("draw", EntityType.CLASS, EntityVisibility.PUBLIC);
            graph.linkTwoNodes(rectangleClass, drawClass, RelationType.INSTANTIATE);
            graph.linkTwoNodes(rectangleClass, fillClass, RelationType.INSTANTIATE);

            Node shapeClass = graph.createNode("Shape", EntityType.CLASS, EntityVisibility.PUBLIC);
            graph.linkTwoNodes(rectangleClass, shapeClass, RelationType.EXTENDS);
            graph.setNbCompositions();

            Assertions.assertEquals(2, graph.getNbAttributeComposeClass());
        });
    }

    @Test
    public void InterfaceAttributeTest() {
        runTest(graph -> {
            Node rectangleClass = graph.createNode("Rectangle", EntityType.CLASS, EntityVisibility.PUBLIC);
            Node drawClass = graph.createNode("draw", EntityType.CLASS, EntityVisibility.PUBLIC);
            graph.linkTwoNodes(rectangleClass, drawClass, RelationType.INSTANTIATE);

            Node shapeClass = graph.createNode("Shape", EntityType.INTERFACE, EntityVisibility.PUBLIC);
            graph.linkTwoNodes(rectangleClass, shapeClass, RelationType.INSTANTIATE);
            graph.setNbCompositions();

            Assertions.assertEquals(2, graph.getNbAttributeComposeClass());
        });
    }
}
