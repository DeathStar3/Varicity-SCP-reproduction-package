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
