
/*
 * This file is part of symfinder.
 *
 *  symfinder is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  symfinder is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with symfinder. If not, see <http://www.gnu.org/licenses/>.
 *
 *  Copyright 2018-2021 Johann Mortara <johann.mortara@univ-cotedazur.fr>
 *  Copyright 2018-2021 Xhevahire Tërnava <t.xheva@gmail.com>
 *  Copyright 2018-2021 Philippe Collet <philippe.collet@univ-cotedazur.fr>
 */

package fr.unice.i3s.sparks.deathstar3.utils;

import fr.unice.i3s.sparks.deathstar3.exception.HttpResponseException;
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

    /**
     * HTTP GET Method, throw HttpResponseException if the return code is not a 2XX
     */
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
