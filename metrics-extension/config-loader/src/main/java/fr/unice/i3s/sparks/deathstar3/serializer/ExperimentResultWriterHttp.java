package fr.unice.i3s.sparks.deathstar3.serializer;

import fr.unice.i3s.sparks.deathstar3.model.ExperimentResult;
import org.hibernate.validator.constraints.URL;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

public class ExperimentResultWriterHttp implements ExperimentResultWriter {
    private String serverUrl;
    private RestTemplate restTemplate = new RestTemplate();

    public ExperimentResultWriterHttp(@Valid @URL @NotNull String url) {
        this.serverUrl = url;
        List<HttpMessageConverter<?>> converters = new ArrayList<>();
        converters.add(new MappingJackson2HttpMessageConverter());
        restTemplate.setMessageConverters(converters);
    }

    @Override
    public void writeResult(ExperimentResult experimentResult) throws Exception {
        this.restTemplate.postForEntity(this.serverUrl, experimentResult, String.class);

    }
}
