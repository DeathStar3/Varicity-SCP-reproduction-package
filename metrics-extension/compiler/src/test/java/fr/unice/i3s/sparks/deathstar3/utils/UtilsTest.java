package fr.unice.i3s.sparks.deathstar3.utils;

import org.junit.jupiter.api.Test;

public class UtilsTest {

    private Utils utils = new Utils();

    @Test
    public void getUserIdentityTest() {
        System.out.println(this.utils.getUserIdentity());
    }
}
