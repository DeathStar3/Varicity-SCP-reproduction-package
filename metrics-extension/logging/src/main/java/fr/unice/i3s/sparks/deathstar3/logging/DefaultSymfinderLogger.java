package fr.unice.i3s.sparks.deathstar3.logging;

import lombok.extern.slf4j.Slf4j;


import java.time.LocalDateTime;
public class DefaultSymfinderLogger implements ISymfinderLogger {


    private String formatting(StackTraceElement caller){
        return String.format("%s %s %s", LocalDateTime.now(), caller.getClassName(),caller.getMethodName() );
    }

    @Override
    public void info(String info) {
        StackTraceElement[] stElements = Thread.currentThread().getStackTrace();
        StackTraceElement callerElement = stElements[2];
        System.out.println(formatting(callerElement) + "\n" +info);
    }


    @Override
    public void error(String err) {
        StackTraceElement[] stElements = Thread.currentThread().getStackTrace();
        StackTraceElement callerElement = stElements[2];
        System.err.println(formatting(callerElement) + "\n" +err);
    }

    @Override
    public void log(String log) {
        StackTraceElement[] stElements = Thread.currentThread().getStackTrace();
        StackTraceElement callerElement = stElements[2];
        System.out.println(formatting(callerElement) + "\n" +log);
    }

    @Override
    public void warn(String warn) {
        StackTraceElement[] stElements = Thread.currentThread().getStackTrace();
        StackTraceElement callerElement = stElements[2];
        System.out.println(formatting(callerElement) + "\n" +warn);
    }


}
