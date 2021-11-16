package fr.unice.i3s.sparks.deathstar3.utils;

import lombok.NoArgsConstructor;
import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.HttpEntity;
import org.apache.hc.core5.http.ParseException;
import org.apache.hc.core5.http.io.entity.EntityUtils;

import java.io.IOException;

@NoArgsConstructor
public class HttpRequest {

    public String get(final String url) throws IOException {
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

                return result.toString();

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
