export enum EntityAttribut {
    ABSTRACT = "ABSTRACT",
    OUT_OF_SCOPE = "OUT_OF_SCOPE",
    VP = "VP",
    METHOD_LEVEL_VP = "METHOD_LEVEL_VP",
    VARIANT = "VARIANT",
    FOLDER_VP = "FOLDER_VP",
    FOLDER_VARIANT = "FOLDER_VARIANT",
    FILE_VARIANT = "FILE_VARIANT"
}

export enum EntityType {
    CLASS = "CLASS",
    METHOD = "METHOD",
    CONSTRUCTOR = "CONSTRUCTOR",
    INTERFACE = "INTERFACE",
    FUNCTION = "FUNCTION",
    VARIABLE = "VARIABLE",
    FILE = "FILE",
    DIRECTORY = "DIRECTORY"
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
    LOAD = "LOAD",
    CHILD = "CHILD",
    CODE_DUPLICATED = "CODE_DUPLICATED"
}

export enum DesignPatternType {
    STRATEGY = "STRATEGY",
    FACTORY = "FACTORY",
    TEMPLATE = "TEMPLATE",
    DECORATOR = "DECORATOR",
    COMPOSITION_STRATEGY = "COMPOSITION_STRATEGY"
}

export type NodeType = EntityAttribut | EntityType | EntityVisibility | UnknownEntity | RelationType | DesignPatternType;