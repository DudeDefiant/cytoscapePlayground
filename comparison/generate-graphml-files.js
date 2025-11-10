#!/usr/bin/env node

/**
 * Generate GraphML files from D2 files
 * 
 * This script:
 * 1. Reads all D2 files from svgs/d2/
 * 2. Parses the D2 format to extract nodes and edges
 * 3. Converts to GraphML format
 * 4. Saves to svgs/graphml/
 */

const fs = require('fs');
const path = require('path');

const D2_DIR = path.join(__dirname, 'svgs', 'd2');
const GRAPHML_DIR = path.join(__dirname, 'svgs', 'graphml');
const EXAMPLES_FILE = path.join(__dirname, '..', 'grid', 'examples.json');

// Ensure graphml directory exists
if (!fs.existsSync(GRAPHML_DIR)) {
    fs.mkdirSync(GRAPHML_DIR, { recursive: true });
}

// Load examples to get node and edge data
let examples = {};
try {
    const examplesData = fs.readFileSync(EXAMPLES_FILE, 'utf8');
    examples = JSON.parse(examplesData);
    console.log(`✓ Loaded ${Object.keys(examples).length} examples from examples.json\n`);
} catch (error) {
    console.error('✗ Failed to load examples.json:', error.message);
    process.exit(1);
}

// Get all D2 files
const d2Files = fs.readdirSync(D2_DIR)
    .filter(f => f.endsWith('.d2'))
    .sort();

console.log(`Found ${d2Files.length} D2 files\n`);

function getNodeStyle(nodeType) {
    const styles = {
        'start': { fill: '#90EE90', stroke: '#228B22', label: 'Start' },
        'end': { fill: '#FFB6C6', stroke: '#DC143C', label: 'End' },
        'process': { fill: '#87CEEB', stroke: '#4682B4', label: 'Process' },
        'decision': { fill: '#FFD700', stroke: '#DAA520', label: 'Decision' },
        'data': { fill: '#DDA0DD', stroke: '#9932CC', label: 'Data' },
        'document': { fill: '#F0E68C', stroke: '#BDB76B', label: 'Document' }
    };
    return styles[nodeType] || styles['process'];
}

function convertToGraphML(testCaseId, example) {
    const nodes = example.nodes || [];
    const edges = example.edges || [];

    // Start GraphML document
    let graphml = `<?xml version="1.0" encoding="UTF-8"?>
<graphml xmlns="http://graphml.graphdrawing.org/xmlns"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns
         http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd">
  <key id="d0" for="node" attr.name="label" attr.type="string"/>
  <key id="d1" for="node" attr.name="type" attr.type="string"/>
  <key id="d2" for="node" attr.name="fill" attr.type="string"/>
  <key id="d3" for="node" attr.name="stroke" attr.type="string"/>
  <key id="d4" for="edge" attr.name="label" attr.type="string"/>
  <graph id="G" edgedefault="directed">
`;

    // Add nodes
    for (const node of nodes) {
        const style = getNodeStyle(node.type);
        graphml += `    <node id="${node.id}">
      <data key="d0">${escapeXml(node.label || node.id)}</data>
      <data key="d1">${node.type}</data>
      <data key="d2">${style.fill}</data>
      <data key="d3">${style.stroke}</data>
    </node>
`;
    }

    // Add edges
    for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        graphml += `    <edge id="e${i}" source="${edge.from}" target="${edge.to}"/>
`;
    }

    graphml += `  </graph>
</graphml>`;

    return graphml;
}

function escapeXml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

let successCount = 0;
let failCount = 0;

console.log('Converting D2 files to GraphML...\n');

for (let i = 0; i < d2Files.length; i++) {
    const file = d2Files[i];
    const testCaseId = path.basename(file, '.d2');

    try {
        // Find matching example (case-insensitive)
        const exampleKey = Object.keys(examples).find(
            key => key.toLowerCase() === testCaseId.toLowerCase()
        );

        if (!exampleKey) {
            console.log(`⚠ [${i+1}/${d2Files.length}] Skipping "${testCaseId}" - no matching example`);
            failCount++;
            continue;
        }

        const exampleData = examples[exampleKey];
        const graphml = convertToGraphML(testCaseId, exampleData);

        const outputPath = path.join(GRAPHML_DIR, `${testCaseId}.graphml`);
        fs.writeFileSync(outputPath, graphml, 'utf8');

        console.log(`✓ [${i+1}/${d2Files.length}] Generated: ${testCaseId}.graphml`);
        successCount++;
    } catch (error) {
        console.log(`✗ [${i+1}/${d2Files.length}] Failed: ${testCaseId} - ${error.message}`);
        failCount++;
    }
}

console.log(`\n${'='.repeat(50)}`);
console.log(`Summary: ${successCount} generated, ${failCount} failed`);
console.log(`Output: ${GRAPHML_DIR}`);
console.log(`${'='.repeat(50)}\n`);

// List generated files
const generatedFiles = fs.readdirSync(GRAPHML_DIR)
    .filter(f => f.endsWith('.graphml'))
    .sort();

console.log(`Generated ${generatedFiles.length} GraphML files:`);
generatedFiles.forEach(file => {
    const filePath = path.join(GRAPHML_DIR, file);
    const stats = fs.statSync(filePath);
    console.log(`  ${file} (${stats.size} bytes)`);
});

process.exit(failCount === 0 ? 0 : 1);

