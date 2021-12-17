import { Symfinder } from "./symfinder";

let symfinder = new Symfinder();
//symfinder.run('../test_project/strategy');
//symfinder.run('../experiments/n8n/packages');
//symfinder.run('../experiments/grafana');
//symfinder.run('../test_project/modules');
//symfinder.run('../test_project/proximity');
//symfinder.run('../experiments/satellizer');
//symfinder.run('../experiments/Babylon.js');
symfinder.run('../experiments/vscode')

// MATCH (n:VP_FOLDER)-[:CHILD]->(d:VARIANT_FOLDER)-[:CHILD]->(f:SUPER_VARIANT_FILE) RETURN n, d, f
// MATCH (n1:FILE_VARIANT)-[r:CODE_DUPLICATED]->(n2:FILE_VARIANT) RETURN n1, n2