export enum EntityAttribut {
    ABSTRACT
}

export enum EntityType {
    CLASS,
    METHOD,
    CONSTRUCTOR,
    INTERFACE
}

export enum EntityVisibility {
    PUBLIC,
    PRIVATE
}

export type NodeType = EntityAttribut | EntityType | EntityVisibility;