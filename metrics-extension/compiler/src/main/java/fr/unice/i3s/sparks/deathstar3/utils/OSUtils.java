package fr.unice.i3s.sparks.deathstar3.utils;

/**
 * @author  Varicity IDE Plugin Team
 */
public class OSUtils {
    /**
     * The operating system of the computer.
     */
    private static final String OS = System.getProperty("os.name").toLowerCase();

    /**
     * Indicates whether the computer is running Windows.
     * @return <code>true</code> if the computer is running Windows; <code>false</code> otherwise.
     */
    public static boolean isWindows() {
        return OS.contains("win");
    }

    /**
     * Indicates whether the computer is running macOS.
     * @return <code>true</code> if the computer is running macOS; <code>false</code> otherwise.
     */
    public static boolean isMac() {
        return OS.contains("mac");
    }

    /**
     * Indicates whether the computer is running a Unix-like operating system.
     * @return <code>true</code> if the computer is running a Unix-like operating system; <code>false</code> otherwise.
     */
    public static boolean isUnix() {
        return (
                OS.contains("nix") ||
                        OS.contains("nux") ||
                        OS.contains("aix")
        );
    }
}