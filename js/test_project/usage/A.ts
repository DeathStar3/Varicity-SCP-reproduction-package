import B from "./B";
import C from "./C";
import { C as Cbis } from './Cbis';
import D from "./D";
import H from "./H";
import I from "./I";

export default class A {

    b: B;
    cbis: Cbis;

    constructor(d: D) {
    }

    test(c: C) {
        const e = c.e; //sans default
        const f = c.f; //default
        const g = c.g();
        const h: H = c.h;
        const i = new I();
    }

}
