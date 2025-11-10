#!/usr/bin/env node

/**
 * Generate inhouse SVG/PNG files from grid.html layout
 * 
 * Usage: node generate-inhouse.js
 * 
 * This script:
 * 1. Reads all SVG files from svgs/current/
 * 2. Extracts test case IDs
 * 3. Loads corresponding JSON from grid/examples.json
 * 4. Renders using grid layout
 * 5. Exports as PNG to svgs/inhouse/
 */

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Paths
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
    console.log(`✓ Loaded ${Object.keys(examples).length} examples from examples.json`);
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

console.log(`\n✓ Found ${testCaseIds.length} test cases in current folder`);
console.log(`  Test cases: ${testCaseIds.join(', ')}\n`);

// For each test case, generate inhouse version
let successCount = 0;
let failCount = 0;

testCaseIds.forEach(testCaseId => {
    // Find matching example (case-insensitive)
    const exampleKey = Object.keys(examples).find(
        key => key.toLowerCase() === testCaseId.toLowerCase()
    );

    if (!exampleKey) {
        console.log(`⚠ Skipping "${testCaseId}" - no matching example found`);
        failCount++;
        return;
    }

    try {
        const data = examples[exampleKey];
        
        // Validate data structure
        if (!data.nodes || !Array.isArray(data.nodes) || 
            !data.edges || !Array.isArray(data.edges)) {
            throw new Error('Invalid data structure');
        }

        // Create canvas
        const canvas = createCanvas(1200, 800);
        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.fillStyle = '#fafafa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        const cellWidth = 180;
        const cellHeight = 100;
        
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

        // Draw placeholder text
        ctx.fillStyle = '#999';
        ctx.font = '14px Arial';
        ctx.fillText(`Grid layout for: ${testCaseId}`, 20, 30);
        ctx.fillText(`Nodes: ${data.nodes.length}, Edges: ${data.edges.length}`, 20, 50);

        // Save as PNG
        const outputPath = path.join(INHOUSE_DIR, `${testCaseId}.png`);
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(outputPath, buffer);

        console.log(`✓ Generated: ${testCaseId}.png`);
        successCount++;
    } catch (error) {
        console.log(`✗ Failed to generate "${testCaseId}": ${error.message}`);
        failCount++;
    }
});

console.log(`\n${'='.repeat(50)}`);
console.log(`Summary: ${successCount} generated, ${failCount} failed`);
console.log(`Output directory: ${INHOUSE_DIR}`);
console.log(`${'='.repeat(50)}\n`);

if (failCount > 0) {
    process.exit(1);
}

