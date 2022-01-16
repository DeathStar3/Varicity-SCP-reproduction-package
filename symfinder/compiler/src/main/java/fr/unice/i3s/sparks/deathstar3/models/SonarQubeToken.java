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

package fr.unice.i3s.sparks.deathstar3.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public final class SonarQubeToken {
    private String login;
    private String name;
    private String token;
    private String createdAt;

    public String login() {
        return login;
    }

    public String name() {
        return name;
    }

    public String token() {
        return token;
    }

    public String createdAt() {
        return createdAt;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == this) return true;
        if (obj == null || obj.getClass() != this.getClass()) return false;
        var that = (SonarQubeToken) obj;
        return Objects.equals(this.login, that.login) &&
                Objects.equals(this.name, that.name) &&
                Objects.equals(this.token, that.token) &&
                Objects.equals(this.createdAt, that.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(login, name, token, createdAt);
    }
}
