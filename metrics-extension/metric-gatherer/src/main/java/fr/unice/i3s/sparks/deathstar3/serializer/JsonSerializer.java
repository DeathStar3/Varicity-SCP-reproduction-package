package fr.unice.i3s.sparks.deathstar3.serializer;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.unice.i3s.sparks.deathstar3.serializer.model.Node;
import lombok.NoArgsConstructor;

import java.io.File;
import java.io.IOException;
import java.util.List;

@NoArgsConstructor
public class JsonSerializer {

    private ObjectMapper objectMapper = new ObjectMapper();

    public void generateAndSaveJson(List<Node> nodes, String fileName) {
        try {
            File file = new File(fileName);
            file.getParentFile().mkdirs();
            objectMapper.writeValue(file, nodes);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
