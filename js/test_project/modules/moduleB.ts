import { ClassOne } from './moduleA';
import { ClassOne as ClassOneBis } from './moduleAbis';

class ClassTwo{

    one: ClassOne;
    oneBis: ClassOneBis;

    constructor(){

    }

    init(){
        return 0;
    }
}