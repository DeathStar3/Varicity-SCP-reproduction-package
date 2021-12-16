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

import fr.unice.i3s.sparks.deathstar3.model.ExperimentResult;
import org.apache.commons.text.StringSubstitutor;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.apache.commons.io.FileUtils;
import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

public class ExperimentResultWriterHtml implements ExperimentResultWriter{

    private String destinationPath;

    public ExperimentResultWriterHtml(String destinationPath){

        this.destinationPath = destinationPath;

        Path.of(destinationPath).toFile().mkdirs();
    }

    @Override
    public void writeResult(ExperimentResult experimentResult) throws Exception {
        //use stringsubstitutor here
    }


    private void insertInIndex() throws IOException {
        File indexFile = Path.of(this.destinationPath, "index.html").toFile();
        Document doc = Jsoup.parse(indexFile,"UTF-8","");

        Element projects = doc.select("#list-tab").first();

        projects.append(" <a href=\"${path}\" class=\"list-group-item list-group-item-action\">${name}</a>");

        FileUtils.writeStringToFile(indexFile, doc.outerHtml(), "UTF-8");
    }
}
