package fr.unice.i3s.sparks.deathstar3.utils;

import java.io.IOException;

import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.HttpEntity;
import org.apache.hc.core5.http.ParseException;
import org.apache.hc.core5.http.io.entity.EntityUtils;

import fr.unice.i3s.sparks.deathstar3.exception.HttpResponseException;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class HttpRequest {

    public String get(final String url) throws IOException, HttpResponseException {
        CloseableHttpClient httpClient = HttpClients.createDefault();

        try {

            HttpGet request = new HttpGet(url);
            CloseableHttpResponse response = httpClient.execute(request);

            try {

                StringBuilder result = new StringBuilder();
                HttpEntity entity = response.getEntity();
                if (entity != null) {
                    result.append(EntityUtils.toString(entity));
                }

                int responseCode = response.getCode();

                if (responseCode >= 200 && responseCode <= 299) { // No error (2XX) return request result
                    return result.toString();
                } else {
                    throw new HttpResponseException(responseCode, url, result.toString());
                }

            } catch (ParseException e) {
                e.printStackTrace();
            } finally {
                response.close();
            }
        } finally {
            httpClient.close();
        }
        throw new RuntimeException("Could not fetch the resource wanted");
    }
}
