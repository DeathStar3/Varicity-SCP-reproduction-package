package org.junit.tests.manipulation;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.assertEquals;

import java.util.Arrays;
import java.util.List;

import junit.framework.JUnit4TestAdapter;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.Description;
import org.junit.runner.JUnitCore;
import org.junit.runner.Request;
import org.junit.runner.Result;
import org.junit.runner.RunWith;
import org.junit.runner.Runner;
import org.junit.runner.manipulation.Filter;
import org.junit.runner.manipulation.Filterable;
import org.junit.runner.manipulation.NoTestsRemainException;
import org.junit.runners.Parameterized;
import org.junit.runners.Parameterized.Parameters;
import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;

public class SingleMethodTest {
    public static int count;

    @Test
    public void oneTimeSetup() throws Exception {
        count = 0;
        Runner runner = Request.method(OneTimeSetup.class, "one").getRunner();
        Result result = new JUnitCore().run(runner);

        assertEquals(1, count);
        assertEquals(1, result.getRunCount());
    }

    @Test
    public void parameterizedFilterToSingleMethod() throws Exception {
        count = 0;
        Runner runner = Request.method(ParameterizedOneTimeSetup.class,
                "one[0]").getRunner();
        Result result = new JUnitCore().run(runner);

        assertEquals(1, result.getRunCount());
    }

    @Test
    public void parameterizedBeforeClass() throws Exception {
        count = 0;
        JUnitCore.runClasses(ParameterizedOneTimeBeforeClass.class);
        assertEquals(1, count);
    }

    @Test
    public void filteringAffectsPlan() throws Exception {
        Runner runner = Request.method(OneTimeSetup.class, "one").getRunner();
        assertEquals(1, runner.testCount());
    }

    @Test
    public void nonexistentMethodCreatesFailure() throws Exception {
        assertEquals(1, new JUnitCore().run(
                        Request.method(OneTimeSetup.class, "thisMethodDontExist"))
                .getFailureCount());
    }

    @Test(expected = NoTestsRemainException.class)
    public void filteringAwayEverythingThrowsException() throws NoTestsRemainException {
        Filterable runner = (Filterable) Request.aClass(OneTimeSetup.class).getRunner();
        runner.filter(new Filter() {
            @Override
            public boolean shouldRun(Description description) {
                return false;
            }

            @Override
            public String describe() {
                return null;
            }
        });
    }

    @Test
    public void eliminateUnnecessaryTreeBranches() throws Exception {
        Runner runner = Request.aClass(OneTwoSuite.class).filterWith(
                        Description.createTestDescription(TestOne.class, "a"))
                .getRunner();
        Description description = runner.getDescription();
        assertEquals(1, description.getChildren().size());
    }

    @Test
    public void classesWithSuiteMethodsAreFiltered() {
        int testCount = Request.method(HasSuiteMethod.class, "a").getRunner().getDescription().testCount();
        assertThat(testCount, is(1));
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

    @RunWith(Parameterized.class)
    public static class ParameterizedOneTimeSetup {
        public ParameterizedOneTimeSetup(int x) {
        }

        @Parameters
        public static List<Object[]> params() {
            return Arrays.asList(new Object[]{1}, new Object[]{2});
        }

        @Test
        public void one() {
        }
    }

    @RunWith(Parameterized.class)
    public static class ParameterizedOneTimeBeforeClass {
        public ParameterizedOneTimeBeforeClass(int x) {
        }

        @Parameters
        public static List<Object[]> params() {
            return Arrays.asList(new Object[]{1}, new Object[]{2});
        }

        @BeforeClass
        public static void once() {
            count++;
        }

        @Test
        public void one() {
        }
    }

    public static class TestOne {
        @Test
        public void a() {
        }

        @Test
        public void b() {
        }
    }

    public static class TestTwo {
        @Test
        public void a() {
        }

        @Test
        public void b() {
        }
    }

    @RunWith(Suite.class)
    @SuiteClasses({TestOne.class, TestTwo.class})
    public static class OneTwoSuite {
    }

    public static class HasSuiteMethod {
        public static junit.framework.Test suite() {
            return new JUnit4TestAdapter(HasSuiteMethod.class);
        }

        @Test
        public void a() {
        }

        @Test
        public void b() {
        }
    }
}