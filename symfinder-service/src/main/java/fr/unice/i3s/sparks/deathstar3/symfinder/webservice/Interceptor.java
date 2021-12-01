package fr.unice.i3s.sparks.deathstar3.symfinder.webservice;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;

import javax.inject.Inject;

@Aspect
public  class Interceptor {

    @Inject
    SessionStore sessionStore;

    @Around("call (*  fr.unice.i3s.sparks.deathstar3.Symfinder.run(..))")
    public Object interceptSymfinder(ProceedingJoinPoint proceedingJoinPoint) throws  Throwable{

        System.out.println("Intercepting met*********hods");
        sessionStore.sessions.forEach((s, session) -> {
            session.getAsyncRemote().sendObject(new SymfinderServiceResponse(
                    SymfinderServiceResponse.SymfinderServiceResponseType.EXPERIMENT_PROGRESS , "> "+ proceedingJoinPoint.getClass()
            ));

        });

        return proceedingJoinPoint.proceed();
    }



}
