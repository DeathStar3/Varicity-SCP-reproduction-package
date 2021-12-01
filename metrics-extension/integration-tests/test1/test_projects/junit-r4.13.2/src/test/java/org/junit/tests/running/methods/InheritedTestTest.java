package org.junit.tests.running.methods;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.JUnitCore;
import org.junit.runner.Result;

public class InheritedTestTest {
    @Test
    public void subclassWithOnlyInheritedTestsRuns() {
        Result result = JUnitCore.runClasses(Sub.class);
        assertTrue(result.wasSuccessful());
    }

    @Test
    public void subclassWithInheritedTestAndOwnBeforeRunsBefore() {
        assertFalse(JUnitCore.runClasses(SubWithBefore.class).wasSuccessful());
    }

    public abstract static class Super {
        @Test
        public void nothing() {
        }
    }

    public static class Sub extends Super {
    }

    public static class SubWithBefore extends Super {
        @Before
        public void gack() {
            fail();
        }
    }
} 
