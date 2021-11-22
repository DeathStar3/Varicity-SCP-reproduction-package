package fr.unice.i3s.sparks.deathstar3.exception;

import lombok.Getter;
import org.apache.hc.core5.http.HttpException;

@Getter
public class HttpResponseException extends HttpException {

    private int code;
    private String url;
    private String msg;

    public HttpResponseException(int code, String url, String msg) {
        super("Error " + code + " for " + url + " request result: " + msg);
        this.code = code;
        this.url = url;
        this.msg = msg;
    }
}
