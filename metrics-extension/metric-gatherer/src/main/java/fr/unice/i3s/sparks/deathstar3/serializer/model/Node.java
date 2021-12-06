package fr.unice.i3s.sparks.deathstar3.serializer.model;

import lombok.*;

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
