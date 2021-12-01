package fr.unice.i3s.sparks.deathstar3.visitors;


import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class SymfinderVisitorTest {

    @Test
    public void noPackageClass() {
        String className = "MyClass";
        Assertions.assertEquals(className, SymfinderVisitor.getClassBaseName(className));
    }

    @Test
    public void packageClass() {
        String className = "org.MyClass";
        assertEquals(className, SymfinderVisitor.getClassBaseName(className));
    }

    @Test
    public void noPackageGenericClass() {
        String className = "MyPair<Integer,String>";
        assertEquals("MyPair", SymfinderVisitor.getClassBaseName(className));
    }

    @Test
    public void packageGenericClass() {
        String className = "org.MyPair<Integer,String>";
        assertEquals("org.MyPair", SymfinderVisitor.getClassBaseName(className));
    }
}