package org.junit.rules;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.experimental.results.PrintableResult.testResult;
import static org.junit.experimental.results.ResultMatchers.hasSingleFailureContaining;
import static org.junit.experimental.results.ResultMatchers.isSuccessful;

import java.util.LinkedList;
import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.Description;
import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runners.model.FrameworkMethod;
import org.junit.runners.model.Statement;

public class TestRuleTest {
    private static final List<String> orderList = new LinkedList<String>();
    private static final StringBuilder ruleLog = new StringBuilder();
    private static boolean wasRun;
    private static int runCount;
    private static String log;

    @Test
    public void ruleIsIntroducedAndEvaluated() {
        wasRun = false;
        JUnitCore.runClasses(ExampleTest.class);
        assertTrue(wasRun);
    }

    @Test
    public void onlyApplyOnceEvenIfImplementsBothInterfaces() {
        assertTrue(JUnitCore.runClasses(OneFieldTwoKindsOfRule.class).wasSuccessful());
    }

    @Test
    public void ruleIsIntroducedAndEvaluatedOnSubclass() {
        wasRun = false;
        JUnitCore.runClasses(SonOfExampleTest.class);
        assertTrue(wasRun);
    }

    @Test
    public void multipleRulesAreRun() {
        runCount = 0;
        JUnitCore.runClasses(MultipleRuleTest.class);
        assertEquals(2, runCount);
    }

    @Test
    public void ignoreNonRules() {
        Result result = JUnitCore.runClasses(NoRulesTest.class);
        assertEquals(0, result.getFailureCount());
    }

    @Test
    public void beforesAndAfters() {
        BeforesAndAfters.watchedLog = new StringBuilder();
        JUnitCore.runClasses(BeforesAndAfters.class);
        assertThat(BeforesAndAfters.watchedLog.toString(),
                is("starting before test after succeeded finished "));
    }

    @Test
    public void validateWrongTypedField() {
        assertThat(testResult(WrongTypedField.class),
                hasSingleFailureContaining("must implement MethodRule"));
    }

    @Test
    public void validateWrongTypedFieldInSuperclass() {
        assertThat(testResult(SonOfWrongTypedField.class),
                hasSingleFailureContaining("must implement MethodRule"));
    }

    @Test
    public void validatePrivateRule() {
        assertThat(testResult(PrivateRule.class),
                hasSingleFailureContaining("must be public"));
    }

    @Test
    public void useCustomMethodRule() {
        assertThat(testResult(UsesCustomMethodRule.class), isSuccessful());
    }

    @Test
    public void methodRuleIsIntroducedAndEvaluated() {
        wasRun = false;
        JUnitCore.runClasses(MethodExampleTest.class);
        assertTrue(wasRun);
    }

    @Test
    public void methodOnlyApplyOnceEvenIfImplementsBothInterfaces() {
        assertTrue(JUnitCore.runClasses(MethodOneFieldTwoKindsOfRule.class).wasSuccessful());
    }

    @Test
    public void methodRuleIsIntroducedAndEvaluatedOnSubclass() {
        wasRun = false;
        JUnitCore.runClasses(MethodSonOfExampleTest.class);
        assertTrue(wasRun);
    }

    @Test
    public void methodMultipleRulesAreRun() {
        runCount = 0;
        JUnitCore.runClasses(MethodMultipleRuleTest.class);
        assertEquals(2, runCount);
    }

    @Test
    public void methodIgnoreNonRules() {
        Result result = JUnitCore.runClasses(MethodNoRulesTest.class);
        assertEquals(0, result.getFailureCount());
    }

    @Test
    public void beforesAndAftersAreEnclosedByRule() {
        BeforesAndAftersAreEnclosedByRule.log = new StringBuilder();
        JUnitCore.runClasses(BeforesAndAftersAreEnclosedByRule.class);
        assertEquals("starting before test after succeeded finished ",
                BeforesAndAftersAreEnclosedByRule.log.toString());
    }

    @Test
    public void methodValidateWrongTypedField() {
        assertThat(testResult(MethodWrongTypedField.class),
                hasSingleFailureContaining("must return an implementation of MethodRule"));
    }

    @Test
    public void methodValidateWrongTypedFieldInSuperclass() {
        assertThat(testResult(MethodSonOfWrongTypedField.class),
                hasSingleFailureContaining("must return an implementation of MethodRule"));
    }

    @Test
    public void methodValidatePrivateRule() {
        assertThat(testResult(MethodPrivateRule.class),
                hasSingleFailureContaining("must be public"));
    }

    @Test
    public void methodUseCustomMethodRule() {
        assertThat(testResult(MethodUsesCustomMethodRule.class), isSuccessful());
    }

    @Test
    public void usesFieldAndMethodRule() {
        orderList.clear();
        assertThat(testResult(UsesFieldAndMethodRule.class), isSuccessful());
    }

    @Test
    public void testCallMethodOnlyOnceRule() {
        assertTrue(JUnitCore.runClasses(CallMethodOnlyOnceRule.class).wasSuccessful());
    }

    @Test
    public void testRuleIsAroundMethodRule() {
        ruleLog.setLength(0);
        Result result = JUnitCore.runClasses(TestRuleIsAroundMethodRule.class);
        assertTrue(result.wasSuccessful());
        assertEquals(" testRule.begin methodRule.begin foo methodRule.end testRule.end",
                ruleLog.toString());
    }

    @Test
    public void testRuleOrdering() {
        ruleLog.setLength(0);
        Result result = JUnitCore.runClasses(TestRuleOrdering.class);
        assertTrue(result.wasSuccessful());
        assertEquals(" outer.begin inner.begin foo inner.end outer.end", ruleLog.toString());
    }

    @Test
    public void testRuleOrderingWithMethodRule() {
        ruleLog.setLength(0);
        Result result = JUnitCore.runClasses(TestRuleOrderingWithMethodRule.class);
        assertTrue(result.wasSuccessful());
        assertEquals(" methodRule.begin testRule.begin foo testRule.end methodRule.end",
                ruleLog.toString());
    }

    public static class ExampleTest {
        @Rule
        public TestRule example = new TestRule() {
            public Statement apply(final Statement base, Description description) {
                return new Statement() {
                    @Override
                    public void evaluate() throws Throwable {
                        wasRun = true;
                        base.evaluate();
                    }
                };
            }
        };

        @Test
        public void nothing() {

        }
    }

    public static class BothKindsOfRule implements TestRule, org.junit.rules.MethodRule {
        public int applications = 0;

        public Statement apply(Statement base, FrameworkMethod method,
                               Object target) {
            applications++;
            return base;
        }

        public Statement apply(Statement base, Description description) {
            applications++;
            return base;
        }
    }

    public static class OneFieldTwoKindsOfRule {
        @Rule
        public BothKindsOfRule both = new BothKindsOfRule();

        @Test
        public void onlyOnce() {
            assertEquals(1, both.applications);
        }
    }

    public static class SonOfExampleTest extends ExampleTest {

    }

    public static class MultipleRuleTest {
        @Rule
        public TestRule incrementor1 = new Increment();
        @Rule
        public TestRule incrementor2 = new Increment();

        @Test
        public void nothing() {

        }

        private static class Increment implements TestRule {
            public Statement apply(final Statement base, Description description) {
                return new Statement() {
                    @Override
                    public void evaluate() throws Throwable {
                        runCount++;
                        base.evaluate();
                    }
                };
            }
        }
    }

    public static class NoRulesTest {
        public int x;

        @Test
        public void nothing() {

        }
    }

    public static class BeforesAndAfters {
        private static StringBuilder watchedLog = new StringBuilder();
        @Rule
        public TestRule watcher = new LoggingTestWatcher(watchedLog);

        @Before
        public void before() {
            watchedLog.append("before ");
        }

        @After
        public void after() {
            watchedLog.append("after ");
        }

        @Test
        public void succeeds() {
            watchedLog.append("test ");
        }
    }

    public static class WrongTypedField {
        @Rule
        public int x = 5;

        @Test
        public void foo() {
        }
    }

    public static class SonOfWrongTypedField extends WrongTypedField {

    }

    public static class PrivateRule {
        @Rule
        private TestRule rule = new TestName();

        @Test
        public void foo() {
        }
    }

    public static class CustomTestName implements TestRule {
        public String name = null;

        public Statement apply(final Statement base, final Description description) {
            return new Statement() {
                @Override
                public void evaluate() throws Throwable {
                    name = description.getMethodName();
                    base.evaluate();
                }
            };
        }
    }

    public static class UsesCustomMethodRule {
        @Rule
        public CustomTestName counter = new CustomTestName();

        @Test
        public void foo() {
            assertEquals("foo", counter.name);
        }
    }

    public static class MethodExampleTest {
        private TestRule example = new TestRule() {
            public Statement apply(final Statement base, Description description) {
                return new Statement() {
                    @Override
                    public void evaluate() throws Throwable {
                        wasRun = true;
                        base.evaluate();
                    }
                };
            }
        };

        @Rule
        public TestRule getExample() {
            return example;
        }

        @Test
        public void nothing() {

        }
    }

    public static class MethodBothKindsOfRule implements TestRule, org.junit.rules.MethodRule {
        public int applications = 0;

        public Statement apply(Statement base, FrameworkMethod method,
                               Object target) {
            applications++;
            return base;
        }

        public Statement apply(Statement base, Description description) {
            applications++;
            return base;
        }
    }

    public static class MethodOneFieldTwoKindsOfRule {
        private MethodBothKindsOfRule both = new MethodBothKindsOfRule();

        @Rule
        public MethodBothKindsOfRule getBoth() {
            return both;
        }

        @Test
        public void onlyOnce() {
            assertEquals(1, both.applications);
        }
    }

    public static class MethodSonOfExampleTest extends MethodExampleTest {

    }

    public static class MethodMultipleRuleTest {
        private TestRule incrementor1 = new Increment();
        private TestRule incrementor2 = new Increment();

        @Rule
        public TestRule getIncrementor1() {
            return incrementor1;
        }

        @Rule
        public TestRule getIncrementor2() {
            return incrementor2;
        }

        @Test
        public void nothing() {

        }

        private static class Increment implements TestRule {
            public Statement apply(final Statement base, Description description) {
                return new Statement() {
                    @Override
                    public void evaluate() throws Throwable {
                        runCount++;
                        base.evaluate();
                    }
                };
            }
        }
    }

    public static class MethodNoRulesTest {
        public int x;

        @Test
        public void nothing() {

        }
    }

    public static class BeforesAndAftersAreEnclosedByRule {
        private static StringBuilder log;

        @Rule
        public TestRule watcher = new LoggingTestWatcher(log);

        @Before
        public void before() {
            log.append("before ");
        }

        @After
        public void after() {
            log.append("after ");
        }

        @Test
        public void succeeds() {
            log.append("test ");
        }
    }

    public static class MethodWrongTypedField {
        @Rule
        public int getX() {
            return 5;
        }

        @Test
        public void foo() {
        }
    }

    public static class MethodSonOfWrongTypedField extends MethodWrongTypedField {

    }

    public static class MethodPrivateRule {
        @Rule
        private TestRule getRule() {
            return new TestName();
        }

        @Test
        public void foo() {
        }
    }

    public static class MethodUsesCustomMethodRule {
        private CustomTestName counter = new CustomTestName();

        @Rule
        public CustomTestName getCounter() {
            return counter;
        }

        @Test
        public void foo() {
            assertEquals("foo", counter.name);
        }
    }

    private static class OrderTestRule implements TestRule {
        private String name;

        public OrderTestRule(String name) {
            this.name = name;
        }

        public Statement apply(final Statement base, final Description description) {
            return new Statement() {
                @Override
                public void evaluate() throws Throwable {
                    orderList.add(name);
                    base.evaluate();
                }
            };
        }
    }

    public static class UsesFieldAndMethodRule {
        @Rule
        public OrderTestRule orderField = new OrderTestRule("orderField");

        @Rule
        public OrderTestRule orderMethod() {
            return new OrderTestRule("orderMethod");
        }

        @Test
        public void foo() {
            assertEquals("orderField", orderList.get(0));
            assertEquals("orderMethod", orderList.get(1));
        }
    }

    public static class CallMethodOnlyOnceRule {
        int countOfMethodCalls = 0;

        @Rule
        public Dummy both() {
            countOfMethodCalls++;
            return new Dummy();
        }

        @Test
        public void onlyOnce() {
            assertEquals(1, countOfMethodCalls);
        }

        private static class Dummy implements TestRule {
            public Statement apply(final Statement base, Description description) {
                return new Statement() {
                    @Override
                    public void evaluate() throws Throwable {
                        base.evaluate();
                    }
                };
            }
        }
    }

    public static class TestRuleIsAroundMethodRule {
        @Rule
        public final MethodRule z = new LoggingMethodRule(ruleLog, "methodRule");

        @Rule
        public final TestRule a = new LoggingTestRule(ruleLog, "testRule");

        @Test
        public void foo() {
            ruleLog.append(" foo");
        }
    }

    public static class TestRuleOrdering {
        @Rule(order = 1)
        public final TestRule a = new LoggingTestRule(ruleLog, "outer");

        @Rule(order = 2)
        public final TestRule z = new LoggingTestRule(ruleLog, "inner");

        @Test
        public void foo() {
            ruleLog.append(" foo");
        }
    }

    public static class TestRuleOrderingWithMethodRule {
        @Rule(order = 1)
        public final MethodRule z = new LoggingMethodRule(ruleLog, "methodRule");

        @Rule(order = 2)
        public final TestRule a = new LoggingTestRule(ruleLog, "testRule");

        @Test
        public void foo() {
            ruleLog.append(" foo");
        }
    }
}
