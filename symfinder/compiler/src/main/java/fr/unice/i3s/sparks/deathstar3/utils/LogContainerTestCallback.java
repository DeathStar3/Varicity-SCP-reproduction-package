package fr.unice.i3s.sparks.deathstar3.utils;

import com.github.dockerjava.api.async.ResultCallback;
import com.github.dockerjava.api.model.Frame;

public class LogContainerTestCallback extends ResultCallback.Adapter<Frame> {
    protected final StringBuffer log = new StringBuffer();

    public LogContainerTestCallback() {}

    @Override
    public void onNext(Frame frame) {
        String str = new String(frame.getPayload());
        System.out.println(str);
        log.append(str);
    }

    @Override
    public String toString() {
        return log.toString();
    }
}