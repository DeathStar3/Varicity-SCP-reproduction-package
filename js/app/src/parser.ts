const ts = require('typescript');
const fs = require('fs');

const node = ts.createSourceFile(
  'x.ts',   // fileName
  fs.readFileSync('./experiments/satellizer/src/oauth.ts', 'utf8'), // sourceText
  ts.ScriptTarget.Latest // langugeVersion
);
console.log(node)