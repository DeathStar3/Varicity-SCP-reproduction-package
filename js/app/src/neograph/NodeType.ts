export enum EntityAttribut {
    ABSTRACT = "ABSTRACT",
    OUT_OF_SCOPE = "OUT_OF_SCOPE"
}

export enum EntityType {
    CLASS = "CLASS",
    METHOD = "METHOD",
    CONSTRUCTOR = "CONSTRUCTOR",
    INTERFACE = "INTERFACE"
}

export enum EntityVisibility {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE"
}

export enum UnknownEntity {
    UNKONWN = "UNKONWN"
}

export enum RelationType {
    METHOD = "METHOD",
    INNER = "INNER",
    IMPLEMENTS = "IMPLEMENTS",
    EXTENDS = "EXTENDS",
    INSTANTIATE = "INSTANTIATE"
}

export enum DesignPatternType {
    STRATEGY = "STRATEGY",
    FACTORY = "FACTORY",
    TEMPLATE = "TEMPLATE",
    DECORATOR = "DECORATOR",
    COMPOSITION_STRATEGY = "COMPOSITION_STRATEGY"
}

export type NodeType = EntityAttribut | EntityType | EntityVisibility | UnknownEntity | RelationType | DesignPatternType;