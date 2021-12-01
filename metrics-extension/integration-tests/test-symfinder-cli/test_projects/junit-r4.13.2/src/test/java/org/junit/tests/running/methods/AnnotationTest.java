package org.junit.tests.running.methods;

import static org.hamcrest.CoreMatchers.allOf;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.experimental.results.PrintableResult.testResult;
import static org.junit.experimental.results.ResultMatchers.isSuccessful;

import java.util.Collection;
import java.util.HashSet;

import junit.framework.TestCase;
import junit.framework.TestSuite;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExternalResource;
import org.junit.rules.TestRule;
import org.junit.runner.Description;
import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

public class AnnotationTest extends TestCase {
    static boolean run;
    static int count;
    static Collection<Object> tests;
    static String log;

    @Override
    public void setUp() {
        run = false;
    }

    public void testAnnotatedMethod() throws Exception {
        JUnitCore runner = new JUnitCore();
        runner.run(SimpleTest.class);
        assertTrue(run);
    }

    public void testAnnotatedMethodWithFutureProofExplicitRunner() throws Exception {
        JUnitCore runner = new JUnitCore();
        runner.run(SimpleTestWithFutureProofExplicitRunner.class);
        assertTrue(run);
    }

    public void testSetup() throws Exception {
        JUnitCore runner = new JUnitCore();
        runner.run(SetupTest.class);
        assertTrue(run);
    }

    public void testTeardown() throws Exception {
        JUnitCore runner = new JUnitCore();
        runner.run(TeardownTest.class);
        assertTrue(run);
    }

    public void testRunFailure() throws Exception {
        JUnitCore runner = new JUnitCore();
        Result result = runner.run(FailureTest.class);
        assertEquals(1, result.getRunCount());
        assertEquals(1, result.getFailureCount());
        assertEquals(AssertionError.class, result.getFailures().get(0).getException().getClass());
    }

    public void testSetupFailure() throws Exception {
        JUnitCore core = new JUnitCore();
        Result runner = core.run(SetupFailureTest.class);
        assertEquals(1, runner.getRunCount());
        assertEquals(1, runner.getFailureCount());
        assertEquals(Error.class, runner.getFailures().get(0).getException().getClass());
        assertFalse(run);
    }

    public void testTeardownFailure() throws Exception {
        JUnitCore core = new JUnitCore();
        Result runner = core.run(TeardownFailureTest.class);
        assertEquals(1, runner.getRunCount());
        assertEquals(1, runner.getFailureCount());
        assertEquals(Error.class, runner.getFailures().get(0).getException().getClass());
    }

    public void testTestAndTeardownFailure() throws Exception {
        JUnitCore core = new JUnitCore();
        Result runner = core.run(TestAndTeardownFailureTest.class);
        assertEquals(1, runner.getRunCount());
        assertEquals(2, runner.getFailureCount());
        assertThat(runner.getFailures().toString(), allOf(containsString("hereAfter"), containsString("inTest")));
    }

    public void testTeardownAfterFailure() throws Exception {
        JUnitCore runner = new JUnitCore();
        runner.run(TeardownAfterFailureTest.class);
        assertTrue(run);
    }

    public void testTwoTests() throws Exception {
        count = 0;
        tests = new HashSet<Object>();
        JUnitCore runner = new JUnitCore();
        runner.run(TwoTests.class);
        assertEquals(2, count);
        assertEquals(2, tests.size());
    }

    public void testOldTest() throws Exception {
        JUnitCore runner = new JUnitCore();
        runner.run(OldTest.class);
        assertTrue(run);
    }

    public void testOldSuiteTest() throws Exception {
        TestSuite suite = new TestSuite(OldSuiteTest.class);
        JUnitCore runner = new JUnitCore();
        runner.run(suite);
        assertTrue(run);
    }

    public void testException() throws Exception {
        JUnitCore core = new JUnitCore();
        Result result = core.run(ExceptionTest.class);
        assertEquals(0, result.getFailureCount());
    }

    public void testExceptionNotThrown() throws Exception {
        JUnitCore core = new JUnitCore();
        Result result = core.run(NoExceptionTest.class);
        assertEquals(1, result.getFailureCount());
        assertEquals("Expected exception: java.lang.Error", result.getFailures().get(0).getMessage());
    }

    public void testOneTimeSetup() throws Exception {
        count = 0;
        JUnitCore core = new JUnitCore();
        core.run(OneTimeSetup.class);
        assertEquals(1, count);
    }

    public void testOneTimeTeardown() throws Exception {
        count = 0;
        JUnitCore core = new JUnitCore();
        core.run(OneTimeTeardown.class);
        assertEquals(1, count);
    }

    public void testOrder() throws Exception {
        log = "";
        JUnitCore core = new JUnitCore();
        core.run(OrderTest.class);
        assertEquals("beforeClass before test after afterClass ", log);
    }

    public void testNonStaticOneTimeSetup() throws Exception {
        JUnitCore core = new JUnitCore();
        Result result = core.run(NonStaticOneTimeSetup.class);
        assertEquals(1, result.getFailureCount());
    }

    public void testErrorInBeforeClass() throws Exception {
        run = false;
        JUnitCore core = new JUnitCore();
        Result result = core.run(ErrorInBeforeClass.class);
        assertFalse(run);
        assertEquals(1, result.getFailureCount());
        Description description = result.getFailures().get(0).getDescription();
        assertEquals(ErrorInBeforeClass.class.getName(), description.getDisplayName());
    }

    public void testErrorInAfterClass() throws Exception {
        run = false;
        JUnitCore core = new JUnitCore();
        Result result = core.run(ErrorInAfterClass.class);
        assertTrue(run);
        assertEquals(1, result.getFailureCount());
    }

    public void testOrderingOfInheritance() throws Exception {
        log = "";
        JUnitCore core = new JUnitCore();
        core.run(SubInheritance.class);
        assertEquals("Before class super Before class sub Before super Before sub Test After sub After super After class sub After class super ", log);
    }

    public void testShadowing() throws Exception {
        log = "";
        assertThat(testResult(SubShadowing.class), isSuccessful());
        assertEquals(
                "sub.rule().before() sub.anotherBefore() super.before() sub.before() "
                        + "Test "
                        + "sub.anotherAfter() sub.after() super.after() sub.rule().after() ",
                log);
    }

    public void testStaticMethodsCanBeTreatedAsShadowed() throws Exception {
        log = "";
        assertThat(testResult(SubStaticMethodShadowing.class), isSuccessful());
        assertEquals(
                "sub.rule().before() "
                        + "Test "
                        + "sub.rule().after() ",
                log);
    }

    public void testFieldsShadowFieldsFromParent() throws Exception {
        log = "";
        assertThat(testResult(SubFieldShadowing.class), isSuccessful());
        assertEquals(
                "sub.rule.before() "
                        + "Test "
                        + "sub.rule.after() ",
                log);
    }

    public void testStaticFieldsCanBeTreatedAsShadowed() throws Exception {
        log = "";
        assertThat(testResult(SubStaticFieldShadowing.class), isSuccessful());
        assertEquals(
                "sub.rule.before() "
                        + "Test "
                        + "sub.rule.after() ",
                log);
    }

    public void testTestInheritance() throws Exception {
        log = "";
        JUnitCore core = new JUnitCore();
        core.run(SubTest.class);
        // The order in which the test methods are called is unspecified
        assertTrue(log.contains("Sub"));
        assertTrue(log.contains("Two"));
        assertFalse(log.contains("Super"));
    }

    public void testRunAllAfters() {
        log = "";
        JUnitCore core = new JUnitCore();
        core.run(RunAllAfters.class);
        assertTrue(log.contains("one"));
        assertTrue(log.contains("two"));
    }

    public void testRunAllAftersRegardless() {
        log = "";
        JUnitCore core = new JUnitCore();
        Result result = core.run(RunAllAftersRegardless.class);
        assertTrue(log.contains("one"));
        assertTrue(log.contains("two"));
        assertEquals(2, result.getFailureCount());
    }

    public void testRunAllAfterClasses() {
        log = "";
        JUnitCore core = new JUnitCore();
        core.run(RunAllAfterClasses.class);
        assertTrue(log.contains("one"));
        assertTrue(log.contains("two"));
    }

    public void testRunAllAfterClassesRegardless() {
        log = "";
        JUnitCore core = new JUnitCore();
        Result result = core.run(RunAllAfterClassesRegardless.class);
        assertTrue(log.contains("one"));
        assertTrue(log.contains("two"));
        assertEquals(2, result.getFailureCount());
    }

    public static class SimpleTest {
        @Test
        public void success() {
            run = true;
        }
    }

    @RunWith(JUnit4.class)
    public static class SimpleTestWithFutureProofExplicitRunner {
        @Test
        public void success() {
            run = true;
        }
    }

    public static class SetupTest {
        @Before
        public void before() {
            run = true;
        }

        @Test
        public void success() {
        }
    }

    public static class TeardownTest {
        @After
        public void after() {
            run = true;
        }

        @Test
        public void success() {
        }
    }

    public static class FailureTest {
        @Test
        public void error() throws Exception {
            org.junit.Assert.fail();
        }
    }

    public static class SetupFailureTest {
        @Before
        public void before() {
            throw new Error();
        }

        @Test
        public void test() {
            run = true;
        }
    }

    public static class TeardownFailureTest {
        @After
        public void after() {
            throw new Error();
        }

        @Test
        public void test() {
        }
    }

    public static class TestAndTeardownFailureTest {
        @After
        public void after() {
            throw new Error("hereAfter");
        }

        @Test
        public void test() throws Exception {
            throw new Exception("inTest");
        }
    }

    public static class TeardownAfterFailureTest {
        @After
        public void after() {
            run = true;
        }

        @Test
        public void test() throws Exception {
            throw new Exception();
        }
    }

    public static class TwoTests {
        @Test
        public void one() {
            count++;
            tests.add(this);
        }

        @Test
        public void two() {
            count++;
            tests.add(this);
        }
    }

    public static class OldTest extends TestCase {
        public void test() {
            run = true;
        }
    }

    public static class OldSuiteTest extends TestCase {
        public void testOne() {
            run = true;
        }
    }

    public static class ExceptionTest {
        @Test(expected = Error.class)
        public void expectedException() {
            throw new Error();
        }
    }

    public static class NoExceptionTest {
        @Test(expected = Error.class)
        public void expectedException() {
        }
    }

    public static class OneTimeSetup {
        @BeforeClass
        public static void once() {
            count++;
        }

        @Test
        public void one() {
        }

        @Test
        public void two() {
        }
    }

    public static class OneTimeTeardown {
        @AfterClass
        public static void once() {
            count++;
        }

        @Test
        public void one() {
        }

        @Test
        public void two() {
        }
    }

    public static class OrderTest {
        @BeforeClass
        public static void onceBefore() {
            log += "beforeClass ";
        }

        @AfterClass
        public static void onceAfter() {
            log += "afterClass ";
        }

        @Before
        public void before() {
            log += "before ";
        }

        @Test
        public void test() {
            log += "test ";
        }

        @After
        public void after() {
            log += "after ";
        }
    }

    public static class NonStaticOneTimeSetup {
        @BeforeClass
        public void once() {
        }

        @Test
        public void aTest() {
        }
    }

    public static class ErrorInBeforeClass {
        @BeforeClass
        public static void before() throws Exception {
            throw new Exception();
        }

        @Test
        public void test() {
            run = true;
        }
    }

    public static class ErrorInAfterClass {
        @AfterClass
        public static void after() throws Exception {
            throw new Exception();
        }

        @Test
        public void test() {
            run = true;
        }
    }

    static class SuperInheritance {
        @BeforeClass
        public static void beforeClassSuper() {
            log += "Before class super ";
        }

        @AfterClass
        public static void afterClassSuper() {
            log += "After class super ";
        }

        @Before
        public void beforeSuper() {
            log += "Before super ";
        }

        @After
        public void afterSuper() {
            log += "After super ";
        }
    }

    public static class SubInheritance extends SuperInheritance {
        @BeforeClass
        public static void beforeClassSub() {
            log += "Before class sub ";
        }

        @AfterClass
        public static void afterClassSub() {
            log += "After class sub ";
        }

        @Before
        public void beforeSub() {
            log += "Before sub ";
        }

        @After
        public void afterSub() {
            log += "After sub ";
        }

        @Test
        public void test() {
            log += "Test ";
        }
    }

    public abstract static class SuperShadowing {

        @Rule
        public TestRule rule() {
            return new ExternalResource() {
                @Override
                protected void before() throws Throwable {
                    log += "super.rule().before() ";
                }

                @Override
                protected void after() {
                    log += "super.rule().after() ";
                }
            };
        }

        @Before
        public void before() {
            log += "super.before() ";
        }

        @After
        public void after() {
            log += "super.after() ";
        }
    }

    public static class SubShadowing extends SuperShadowing {

        @Override
        @Rule
        public TestRule rule() {
            return new ExternalResource() {
                @Override
                protected void before() throws Throwable {
                    log += "sub.rule().before() ";
                }

                @Override
                protected void after() {
                    log += "sub.rule().after() ";
                }
            };
        }

        @Override
        @Before
        public void before() {
            super.before();
            log += "sub.before() ";
        }

        @Before
        public void anotherBefore() {
            log += "sub.anotherBefore() ";
        }

        @Override
        @After
        public void after() {
            log += "sub.after() ";
            super.after();
        }

        @After
        public void anotherAfter() {
            log += "sub.anotherAfter() ";
        }

        @Test
        public void test() {
            log += "Test ";
        }
    }

    public abstract static class SuperStaticMethodShadowing {

        @ClassRule
        public static TestRule rule() {
            return new ExternalResource() {
                @Override
                protected void before() throws Throwable {
                    log += "super.rule().before() ";
                }

                @Override
                protected void after() {
                    log += "super.rule().after() ";
                }
            };
        }
    }

    public static class SubStaticMethodShadowing extends SuperStaticMethodShadowing {

        @ClassRule
        public static TestRule rule() {
            return new ExternalResource() {
                @Override
                protected void before() throws Throwable {
                    log += "sub.rule().before() ";
                }

                @Override
                protected void after() {
                    log += "sub.rule().after() ";
                }
            };
        }

        @Test
        public void test() {
            log += "Test ";
        }
    }

    public abstract static class SuperFieldShadowing {

        @Rule
        public final TestRule rule = new ExternalResource() {
            @Override
            protected void before() throws Throwable {
                log += "super.rule.before() ";
            }

            @Override
            protected void after() {
                log += "super.rule.after() ";
            }
        };
    }

    public static class SubFieldShadowing extends SuperFieldShadowing {

        @Rule
        public final TestRule rule = new ExternalResource() {
            @Override
            protected void before() throws Throwable {
                log += "sub.rule.before() ";
            }

            @Override
            protected void after() {
                log += "sub.rule.after() ";
            }
        };

        @Test
        public void test() {
            log += "Test ";
        }
    }

    public abstract static class SuperStaticFieldShadowing {

        @ClassRule
        public static TestRule rule = new ExternalResource() {
            @Override
            protected void before() throws Throwable {
                log += "super.rule.before() ";
            }

            @Override
            protected void after() {
                log += "super.rule.after() ";
            }
        };
    }

    public static class SubStaticFieldShadowing extends SuperStaticFieldShadowing {

        @ClassRule
        public static TestRule rule = new ExternalResource() {
            @Override
            protected void before() throws Throwable {
                log += "sub.rule.before() ";
            }

            @Override
            protected void after() {
                log += "sub.rule.after() ";
            }
        };

        @Test
        public void test() {
            log += "Test ";
        }
    }

    public static class SuperTest {
        @Test
        public void one() {
            log += "Super";
        }

        @Test
        public void two() {
            log += "Two";
        }
    }

    public static class SubTest extends SuperTest {
        @Override
        @Test
        public void one() {
            log += "Sub";
        }
    }

    public static class RunAllAfters {
        @Before
        public void good() {
        }

        @Before
        public void bad() {
            throw new Error();
        }

        @Test
        public void empty() {
        }

        @After
        public void one() {
            log += "one";
        }

        @After
        public void two() {
            log += "two";
        }
    }

    public static class RunAllAftersRegardless {
        @Test
        public void empty() {
        }

        @After
        public void one() {
            log += "one";
            throw new Error();
        }

        @After
        public void two() {
            log += "two";
            throw new Error();
        }
    }

    public static class RunAllAfterClasses {
        @BeforeClass
        public static void bad() {
            throw new Error();
        }

        @AfterClass
        public static void one() {
            log += "one";
        }

        @AfterClass
        public static void two() {
            log += "two";
        }

        @Before
        public void good() {
        }

        @Test
        public void empty() {
        }
    }

    public static class RunAllAfterClassesRegardless {
        @AfterClass
        public static void one() {
            log += "one";
            throw new Error();
        }

        @AfterClass
        public static void two() {
            log += "two";
            throw new Error();
        }

        @Test
        public void empty() {
        }
    }
}
