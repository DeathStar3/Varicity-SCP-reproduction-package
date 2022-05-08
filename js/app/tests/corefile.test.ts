let json = require('../db.json');
let count = Object.keys(json[0]).length;

describe('in core_file test project', () => {
    describe('concerning vp_folder', () => {
        it('parentFolder is', () => { 
            let types;
            for (let step = 0; step < count; step++) {
                if (json[0][step].name === 'parentFolder') {
                    types = json[0][step].types;
                    break;
                }
            }
            let result = types.includes('VP_FOLDER');
            console.log('expected true, result: ' + result);
            expect(result).toBe(true);
        });
        it('folder 2 is not', () => { 
            let types;
            for (let step = 0; step < count; step++) {
                if (json[0][step].name === 'folder2') {
                    types = json[0][step].types;
                    break;
                }
            }
            let result = types.includes('VP_FOLDER');
            console.log('expected false, result: ' + result);
            expect(result).toBe(false);
        });
    });
    describe('concernign variant_folder', () => {
        it('folder 1 is', () => { 
            let types;
            for (let step = 0; step < count; step++) {
                if (json[0][step].name === 'folder1') {
                    types = json[0][step].types;
                    break;
                }
            }
            let result = types.includes('VARIANT_FOLDER');
            console.log('expected true, result: ' + result);
            expect(result).toBe(true);
        });
        it('folder 2 is', () => { 
            let types;
            for (let step = 0; step < count; step++) {
                if (json[0][step].name === 'folder2') {
                    types = json[0][step].types;
                    break;
                }
            }
            let result = types.includes('VARIANT_FOLDER');
            console.log('expected true, result: ' + result);
            expect(result).toBe(true);
        });
        it('folder 3 is', () => { 
            let types;
            for (let step = 0; step < count; step++) {
                if (json[0][step].name === 'folder3') {
                    types = json[0][step].types;
                    break;
                }
            }
            let result = types.includes('VARIANT_FOLDER');
            console.log('expected true, result: ' + result);
            expect(result).toBe(true);
        });
    });
    describe('concerning variant_file', () => {
        it('fileA is', () => { 
            let types;
            for (let step = 0; step < count; step++) {
                if (json[0][step].name === 'fileA.ts') {
                    types = json[0][step].types;
                    break;
                }
            }
            let result = types.includes('VARIANT_FILE');
            console.log('expected true, result: ' + result);
            expect(result).toBe(true);
        });
        it('fileB is', () => { 
            let types;
            for (let step = 0; step < count; step++) {
                if (json[0][step].name === 'fileB.ts') {
                    types = json[0][step].types;
                    break;
                }
            }
            let result = types.includes('VARIANT_FILE');
            console.log('expected true, result: ' + result);
            expect(result).toBe(true);
        });
    });
    describe('concerning super_variant_file', () => {
        it('fileA is not', () => { 
            let types;
            for (let step = 0; step < count; step++) {
                if (json[0][step].name === 'fileA.ts') {
                    types = json[0][step].types;
                    break;
                }
            }
            let result = types.includes('SUPER_VARIANT_FILE');
            console.log('expected false, result: ' + result);
            expect(result).toBe(false);
        });
        it('fileB is not', () => { 
            let types;
            for (let step = 0; step < count; step++) {
                if (json[0][step].name === 'fileB.ts') {
                    types = json[0][step].types;
                    break;
                }
            }
            let result = types.includes('SUPER_VARIANT_FILE');
            console.log('expected false, result: ' + result);
            expect(result).toBe(false);
        });
    });
});