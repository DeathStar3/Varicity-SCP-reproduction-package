package org.junit.tests.running.methods;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;
import org.junit.internal.AssumptionViolatedException;
import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runner.notification.Failure;

public class ExpectedTest {

    @Test
    public void expected() {
        JUnitCore core = new JUnitCore();
        Result result = core.run(Expected.class);
        assertTrue(result.wasSuccessful());
    }

    @Test
    public void unexpected() {
        Result result = JUnitCore.runClasses(Unexpected.class);
        Failure failure = result.getFailures().get(0);
        String message = failure.getMessage();
        assertTrue(message.contains("expected<java.lang.Exception> but was<java.lang.Error>"));
        assertEquals(Error.class, failure.getException().getCause().getClass());
    }

    @Test
    public void noneThrown() {
        JUnitCore core = new JUnitCore();
        Result result = core.run(NoneThrown.class);
        assertFalse(result.wasSuccessful());
        String message = result.getFailures().get(0).getMessage();
        assertTrue(message.contains("Expected exception: java.lang.Exception"));
    }

    @Test
    public void expectsSuperclass() {
        assertTrue(new JUnitCore().run(ExpectSuperclass.class).wasSuccessful());
    }

    @Test
    public void expectsAssumptionViolatedException() {
        assertTrue(new JUnitCore().run(ExpectAssumptionViolatedException.class).wasSuccessful());
    }

    public static class Expected {
        @Test(expected = Exception.class)
        public void expected() throws Exception {
            throw new Exception();
        }
    }

    public static class Unexpected {
        @Test(expected = Exception.class)
        public void expected() throws Exception {
            throw new Error();
        }
    }

    public static class NoneThrown {
        @Test(expected = Exception.class)
        public void nothing() {
        }
    }

    public static class ExpectSuperclass {
        @Test(expected = RuntimeException.class)
        public void throwsSubclass() {
            throw new ClassCastException();
        }
    }

    public static class ExpectAssumptionViolatedException {
        @Test(expected = AssumptionViolatedException.class)
        public void throwsAssumptionViolatedException() {
            throw new AssumptionViolatedException("expected");
        }
    }
}
