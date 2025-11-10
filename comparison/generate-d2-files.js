const fs = require('fs');
const path = require('path');

// Load examples
const examplesPath = path.join(__dirname, '../grid/examples.json');
const examples = JSON.parse(fs.readFileSync(examplesPath, 'utf8'));

// Create D2 output directory
const d2Dir = path.join(__dirname, 'svgs/d2');
if (!fs.existsSync(d2Dir)) {
    fs.mkdirSync(d2Dir, { recursive: true });
}

// Node type to D2 shape mapping
const typeToShape = {
    'start': 'circle',
    'end': 'circle',
    'process': 'rectangle',
    'decision': 'diamond',
    'data': 'parallelogram',
    'document': 'document',
    'default': 'rectangle'
};

// Node type to D2 style mapping
const typeToStyle = {
    'start': { fill: '#90EE90', stroke: '#228B22', 'stroke-width': 2 },
    'end': { fill: '#FFB6C1', stroke: '#C71585', 'stroke-width': 2 },
    'process': { fill: '#87CEEB', stroke: '#4682B4', 'stroke-width': 1 },
    'decision': { fill: '#FFD700', stroke: '#DAA520', 'stroke-width': 1 },
    'data': { fill: '#DDA0DD', stroke: '#9932CC', 'stroke-width': 1 },
    'document': { fill: '#F0E68C', stroke: '#BDB76B', 'stroke-width': 1 },
    'default': { fill: '#D3D3D3', stroke: '#808080', 'stroke-width': 1 }
};

function getNodeShape(type) {
    return typeToShape[type] || typeToShape['default'];
}

function getNodeStyle(type) {
    return typeToStyle[type] || typeToStyle['default'];
}

function convertToD2(testCaseId, example) {
    const nodes = example.nodes || [];
    const edges = example.edges || [];

    let d2Content = `# ${testCaseId}\n\ndirection: down\n\n`;

    // Define nodes with shapes and styles
    for (const node of nodes) {
        const shape = getNodeShape(node.type);
        const style = getNodeStyle(node.type);

        // Format node with shape and style
        d2Content += `${node.id}: {\n`;
        d2Content += `  label: "${node.label || node.id}"\n`;
        d2Content += `  shape: ${shape}\n`;

        // Add style properties nested under style (D2 format)
        if (style.fill || style.stroke || style['stroke-width']) {
            d2Content += `  style: {\n`;
            if (style.fill) d2Content += `    fill: "${style.fill}"\n`;
            if (style.stroke) d2Content += `    stroke: "${style.stroke}"\n`;
            if (style['stroke-width']) d2Content += `    stroke-width: ${style['stroke-width']}\n`;
            d2Content += `  }\n`;
        }

        d2Content += `}\n\n`;
    }

    // Define edges
    for (const edge of edges) {
        d2Content += `${edge.from} -> ${edge.to}\n`;
    }

    return d2Content;
}

// Generate D2 files for all examples
let successCount = 0;
let failCount = 0;

console.log('Generating D2 files...\n');

for (const [testCaseId, example] of Object.entries(examples)) {
    try {
        const d2Content = convertToD2(testCaseId, example);
        const outputPath = path.join(d2Dir, `${testCaseId}.d2`);
        
        fs.writeFileSync(outputPath, d2Content, 'utf8');
        console.log(`✓ Generated: ${testCaseId}.d2`);
        successCount++;
    } catch (error) {
        console.log(`✗ Failed: ${testCaseId} - ${error.message}`);
        failCount++;
    }
}

console.log(`\n${'='.repeat(50)}`);
console.log(`Summary: ${successCount} generated, ${failCount} failed`);
console.log(`Output: ${d2Dir}`);
console.log(`${'='.repeat(50)}\n`);

// List generated files
const files = fs.readdirSync(d2Dir).sort();
console.log(`Generated ${files.length} D2 files:`);
files.forEach(file => {
    const filePath = path.join(d2Dir, file);
    const stats = fs.statSync(filePath);
    console.log(`  ${file} (${stats.size} bytes)`);
});

