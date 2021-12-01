export enum EntityAttribut {
    ABSTRACT = "ABSTRACT",
    OUT_OF_SCOPE = "OUT_OF_SCOPE",
    VP = "VP",
    METHOD_LEVEL_VP = "METHOD_LEVEL_VP",
    VARIANT = "VARIANT",
    MODULE_VP = "MODULE_VP",
    MODULE_VARIANT = "MODULE_VARIANT"
}

export enum EntityType {
    CLASS = "CLASS",
    METHOD = "METHOD",
    CONSTRUCTOR = "CONSTRUCTOR",
    INTERFACE = "INTERFACE",
    MODULE = "MODULE",
    FUNCTION = "FUNCTION",
    VARIABLE = "VARIABLE"
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
    INSTANTIATE = "INSTANTIATE",
    EXPORT = "EXPORT",
    INTERNAL = "INTERNAL",
    IMPORT = "IMPORT",
    LOAD = "LOAD"
}

export enum DesignPatternType {
    STRATEGY = "STRATEGY",
    FACTORY = "FACTORY",
    TEMPLATE = "TEMPLATE",
    DECORATOR = "DECORATOR",
    COMPOSITION_STRATEGY = "COMPOSITION_STRATEGY"
}

export type NodeType = EntityAttribut | EntityType | EntityVisibility | UnknownEntity | RelationType | DesignPatternType;