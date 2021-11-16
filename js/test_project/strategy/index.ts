/**
 * A simple strategy implementation inspired by https://refactoring.guru/design-patterns/strategy/typescript/example 
 */
 class Context {
    
    private strategy: Strategy;

    constructor(strategy: Strategy) {
        this.strategy = strategy;
    }
}

interface Strategy {
    action(): number;
}

class OneStrategy implements Strategy {
    public action(): number {
        return 0;
    }
}

class TwoStrategy implements Strategy {
    public action(): number {
        return 1;
    }
}