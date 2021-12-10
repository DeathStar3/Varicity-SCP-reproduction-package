package fr.unice.i3s.sparks.deathstar3.serializer.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Node {
    private String name; // Class name
    private List<Metric> metrics; // Class metrics
}
