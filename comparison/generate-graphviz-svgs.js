#!/usr/bin/env node

/**
 * Generate Graphviz SVG files from examples.json
 * 
 * This script:
 * 1. Reads examples from grid/examples.json
 * 2. Converts to Graphviz DOT format
 * 3. Renders using @hpcc-js/wasm (Graphviz WASM)
 * 4. Saves as SVG to svgs/graphviz/
 */

const fs = require('fs');
const path = require('path');
const { Graphviz } = require('@hpcc-js/wasm');

const EXAMPLES_FILE = path.join(__dirname, '../grid/examples.json');
const GRAPHVIZ_DIR = path.join(__dirname, 'svgs/graphviz');

// Ensure graphviz directory exists
if (!fs.existsSync(GRAPHVIZ_DIR)) {
    fs.mkdirSync(GRAPHVIZ_DIR, { recursive: true });
}

// Node type to Graphviz shape mapping
const typeToShape = {
    'start': 'ellipse',
    'end': 'ellipse',
    'process': 'box',
    'decision': 'diamond',
    'data': 'parallelogram',
    'document': 'note',
    'default': 'box'
};

// Node type to color mapping
const typeToColor = {
    'start': '#90EE90',      // Light green
    'end': '#FFB6C1',        // Light pink
    'process': '#87CEEB',    // Sky blue
    'decision': '#FFD700',   // Gold
    'data': '#DDA0DD',       // Plum
    'document': '#F0E68C',   // Khaki
    'default': '#D3D3D3'     // Light gray
};

const typeToFontColor = {
    'start': '#228B22',      // Forest green
    'end': '#C71585',        // Medium violet red
    'process': '#4682B4',    // Steel blue
    'decision': '#DAA520',   // Goldenrod
    'data': '#9932CC',       // Dark orchid
    'document': '#BDB76B',   // Dark khaki
    'default': '#808080'     // Gray
};

function getNodeShape(type) {
    return typeToShape[type] || typeToShape['default'];
}

function getNodeColor(type) {
    return typeToColor[type] || typeToColor['default'];
}

function getNodeFontColor(type) {
    return typeToFontColor[type] || typeToFontColor['default'];
}

function convertToDOT(testCaseId, example) {
    const nodes = example.nodes || [];
    const edges = example.edges || [];

    let dot = `digraph "${testCaseId}" {\n`;
    dot += `  rankdir=TB;\n`;
    dot += `  splines=ortho;\n`;
    dot += `  node [shape=box, style=filled, fontname="Arial"];\n`;
    dot += `  edge [fontname="Arial"];\n\n`;

    // Define nodes with shapes and colors
    for (const node of nodes) {
        const shape = getNodeShape(node.type);
        const fillColor = getNodeColor(node.type);
        const fontColor = getNodeFontColor(node.type);
        const label = (node.label || node.id).replace(/"/g, '\\"');

        dot += `  "${node.id}" [shape=${shape}, label="${label}", fillcolor="${fillColor}", fontcolor="${fontColor}"];\n`;
    }

    dot += '\n';

    // Define edges
    for (const edge of edges) {
        dot += `  "${edge.from}" -> "${edge.to}";\n`;
    }

    dot += '}\n';

    return dot;
}

async function generateGraphvizSVG(dotContent) {
    try {
        const graphviz = await Graphviz.load();
        const svg = graphviz.dot(dotContent);
        return svg;
    } catch (error) {
        throw new Error(`Graphviz rendering failed: ${error.message}`);
    }
}

async function main() {
    // Load examples
    let examples = {};
    try {
        const examplesData = fs.readFileSync(EXAMPLES_FILE, 'utf8');
        examples = JSON.parse(examplesData);
        console.log(`✓ Loaded ${Object.keys(examples).length} examples from examples.json\n`);
    } catch (error) {
        console.error('✗ Failed to load examples.json:', error.message);
        process.exit(1);
    }

    let successCount = 0;
    let failCount = 0;

    console.log('Generating Graphviz SVG files...\n');

    const testCaseIds = Object.keys(examples).sort();

    for (let i = 0; i < testCaseIds.length; i++) {
        const testCaseId = testCaseIds[i];
        const example = examples[testCaseId];

        try {
            // Validate data structure
            if (!example.nodes || !Array.isArray(example.nodes) ||
                !example.edges || !Array.isArray(example.edges)) {
                throw new Error('Invalid data structure');
            }

            // Convert to DOT format
            const dotContent = convertToDOT(testCaseId, example);

            console.log(dotContent);

            // Render with Graphviz
            const svg = await generateGraphvizSVG(dotContent);

            // Save SVG
            const outputPath = path.join(GRAPHVIZ_DIR, `${testCaseId}.svg`);
            fs.writeFileSync(outputPath, svg, 'utf8');

            console.log(`✓ [${i + 1}/${testCaseIds.length}] Generated: ${testCaseId}.svg`);
            successCount++;
        } catch (error) {
            console.log(`✗ [${i + 1}/${testCaseIds.length}] Failed: ${testCaseId} - ${error.message}`);
            failCount++;
        }
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`Summary: ${successCount} generated, ${failCount} failed`);
    console.log(`Output: ${GRAPHVIZ_DIR}`);
    console.log(`${'='.repeat(50)}\n`);

    // List generated files
    const generatedFiles = fs.readdirSync(GRAPHVIZ_DIR)
        .filter(f => f.endsWith('.svg'))
        .sort();

    console.log(`Generated ${generatedFiles.length} SVG files:`);
    generatedFiles.slice(0, 5).forEach(file => {
        console.log(`  ${file}`);
    });
    if (generatedFiles.length > 5) {
        console.log(`  ... and ${generatedFiles.length - 5} more`);
    }

    return failCount === 0;
}

main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});

