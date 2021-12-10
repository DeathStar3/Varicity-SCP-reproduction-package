/*
 * This file is part of symfinder.
 *
 * symfinder is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * symfinder is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with symfinder. If not, see <http://www.gnu.org/licenses/>.
 *
 * Copyright 2018-2021 Johann Mortara <johann.mortara@univ-cotedazur.fr>
 * Copyright 2018-2021 Xhevahire Tërnava <t.xheva@gmail.com>
 * Copyright 2018-2021 Philippe Collet <philippe.collet@univ-cotedazur.fr>
 */

package fr.unice.i3s.sparks.deathstar3.symfinder.engine.configuration;

import java.util.Objects;

public final class ParametersObject {
    private final Neo4jParameters neo4j;
    private final HotspotsParameters hotspots;
    private final String experimentsFile;

    public ParametersObject(Neo4jParameters neo4j,
                            HotspotsParameters hotspots,
                            String experimentsFile) {
        this.neo4j = neo4j;
        this.hotspots = hotspots;
        this.experimentsFile = experimentsFile;
    }

    public Neo4jParameters neo4j() {
        return neo4j;
    }

    public HotspotsParameters hotspots() {
        return hotspots;
    }

    public String experimentsFile() {
        return experimentsFile;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == this) return true;
        if (obj == null || obj.getClass() != this.getClass()) return false;
        var that = (ParametersObject) obj;
        return Objects.equals(this.neo4j, that.neo4j) &&
                Objects.equals(this.hotspots, that.hotspots) &&
                Objects.equals(this.experimentsFile, that.experimentsFile);
    }

    @Override
    public int hashCode() {
        return Objects.hash(neo4j, hotspots, experimentsFile);
    }

    @Override
    public String toString() {
        return "ParametersObject[" +
                "neo4j=" + neo4j + ", " +
                "hotspots=" + hotspots + ", " +
                "experimentsFile=" + experimentsFile + ']';
    }


}
