package fr.unice.i3s.sparks.deathstar3.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Node {

    private String name; //Class name
    private List<Metric> metrics; //Class metrics

    @Override
    public String toString() {
        return "Node{" +
                "name='" + name + '\'' +
                ", metrics=" + metrics +
                '}';
    }
}
