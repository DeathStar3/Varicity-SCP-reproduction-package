import { ClassOne as ClassOneOne } from './moduleA';
import ClassOne from './moduleAbis';

class ClassTwo{

    one: ClassOne;
    oneBis: ClassOneOne;

    constructor(){

    }

    init(){
        return 0;
    }
}