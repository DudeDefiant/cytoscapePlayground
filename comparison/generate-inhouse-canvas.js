#!/usr/bin/env node

/**
 * Generate inhouse PNG files using canvas rendering
 * 
 * This script:
 * 1. Reads test case IDs from svgs/current/
 * 2. Loads corresponding JSON from grid/examples.json
 * 3. Renders using canvas with grid layout visualization
 * 4. Saves as PNG to svgs/inhouse/
 */

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const CURRENT_DIR = path.join(__dirname, 'svgs', 'current');
const INHOUSE_DIR = path.join(__dirname, 'svgs', 'inhouse');
const EXAMPLES_FILE = path.join(__dirname, '..', 'grid', 'examples.json');

// Ensure inhouse directory exists
if (!fs.existsSync(INHOUSE_DIR)) {
    fs.mkdirSync(INHOUSE_DIR, { recursive: true });
}

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

// Get test case IDs from current folder
const currentFiles = fs.readdirSync(CURRENT_DIR);
const testCaseIds = currentFiles
    .filter(f => f.endsWith('.svg'))
    .map(f => f.replace('.svg', ''))
    .sort();

console.log(`✓ Found ${testCaseIds.length} test cases\n`);

function renderFlowchart(data, canvas, ctx) {
    const cellWidth = 180;
    const cellHeight = 100;
    const padding = 20;

    // Clear canvas
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    for (let x = 0; x < canvas.width; x += cellWidth) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height; y += cellHeight) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    
    ctx.setLineDash([]);

    // Simple layout: arrange nodes in a grid
    const nodes = data.nodes || [];
    const edges = data.edges || [];
    
    // Calculate grid dimensions
    const cols = Math.ceil(Math.sqrt(nodes.length));
    const rows = Math.ceil(nodes.length / cols);

    // Draw edges first
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    
    edges.forEach(edge => {
        const fromNode = nodes.find(n => n.id === edge.from);
        const toNode = nodes.find(n => n.id === edge.to);
        
        if (fromNode && toNode) {
            const fromIdx = nodes.indexOf(fromNode);
            const toIdx = nodes.indexOf(toNode);
            
            const fromCol = fromIdx % cols;
            const fromRow = Math.floor(fromIdx / cols);
            const toCol = toIdx % cols;
            const toRow = Math.floor(toIdx / cols);
            
            const fromX = padding + fromCol * cellWidth + cellWidth / 2;
            const fromY = padding + fromRow * cellHeight + cellHeight / 2;
            const toX = padding + toCol * cellWidth + cellWidth / 2;
            const toY = padding + toRow * cellHeight + cellHeight / 2;
            
            // Draw arrow
            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(toX, toY);
            ctx.stroke();
            
            // Draw arrowhead
            const angle = Math.atan2(toY - fromY, toX - fromX);
            const arrowSize = 10;
            ctx.beginPath();
            ctx.moveTo(toX, toY);
            ctx.lineTo(toX - arrowSize * Math.cos(angle - Math.PI / 6), toY - arrowSize * Math.sin(angle - Math.PI / 6));
            ctx.lineTo(toX - arrowSize * Math.cos(angle + Math.PI / 6), toY - arrowSize * Math.sin(angle + Math.PI / 6));
            ctx.closePath();
            ctx.fill();
        }
    });

    // Draw nodes
    nodes.forEach((node, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        
        const x = padding + col * cellWidth + cellWidth / 2;
        const y = padding + row * cellHeight + cellHeight / 2;
        const nodeWidth = cellWidth - 20;
        const nodeHeight = cellHeight - 20;

        // Draw node box
        ctx.fillStyle = getNodeColor(node.type);
        ctx.fillRect(x - nodeWidth / 2, y - nodeHeight / 2, nodeWidth, nodeHeight);
        
        // Draw border
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - nodeWidth / 2, y - nodeHeight / 2, nodeWidth, nodeHeight);

        // Draw label
        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const label = node.label || node.id;
        ctx.fillText(label, x, y);
    });

    // Draw stats
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`Nodes: ${nodes.length} | Edges: ${edges.length}`, 10, 10);
}

function getNodeColor(type) {
    const colors = {
        'start': '#90EE90',
        'end': '#FFB6C6',
        'process': '#87CEEB',
        'decision': '#FFD700',
        'group': '#E6E6FA',
        'default': '#D3D3D3'
    };
    return colors[type] || colors['default'];
}

// Generate PNG files
let successCount = 0;
let failCount = 0;

console.log('Rendering test cases...\n');

testCaseIds.forEach(testCaseId => {
    try {
        // Find matching example (case-insensitive)
        const exampleKey = Object.keys(examples).find(
            key => key.toLowerCase() === testCaseId.toLowerCase()
        );

        if (!exampleKey) {
            console.log(`⚠ Skipping "${testCaseId}" - no matching example`);
            failCount++;
            return;
        }

        const data = examples[exampleKey];
        
        // Validate data structure
        if (!data.nodes || !Array.isArray(data.nodes) || 
            !data.edges || !Array.isArray(data.edges)) {
            throw new Error('Invalid data structure');
        }

        // Create canvas
        const canvas = createCanvas(1200, 800);
        const ctx = canvas.getContext('2d');

        // Render flowchart
        renderFlowchart(data, canvas, ctx);

        // Save as PNG
        const outputPath = path.join(INHOUSE_DIR, `${testCaseId}.png`);
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(outputPath, buffer);

        console.log(`✓ Generated: ${testCaseId}.png`);
        successCount++;
    } catch (error) {
        console.log(`✗ Failed: ${testCaseId} - ${error.message}`);
        failCount++;
    }
});

console.log(`\n${'='.repeat(50)}`);
console.log(`Summary: ${successCount} generated, ${failCount} failed`);
console.log(`Output: ${INHOUSE_DIR}`);
console.log(`${'='.repeat(50)}\n`);

process.exit(failCount > 0 ? 1 : 0);

