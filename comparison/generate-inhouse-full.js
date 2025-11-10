#!/usr/bin/env node

/**
 * Generate inhouse PNG files using actual grid layout rendering
 * 
 * This script uses Puppeteer to:
 * 1. Load grid.html in a headless browser
 * 2. Render each test case using the grid layout
 * 3. Screenshot and save as PNG to svgs/inhouse/
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const CURRENT_DIR = path.join(__dirname, 'svgs', 'current');
const INHOUSE_DIR = path.join(__dirname, 'svgs', 'inhouse');
const GRID_HTML = path.join(__dirname, '..', 'grid', 'grid.html');
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

async function generateScreenshots() {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
        ]
    });

    let successCount = 0;
    let failCount = 0;

    try {
        console.log('Rendering test cases...\n');

        for (let i = 0; i < testCaseIds.length; i++) {
            const testCaseId = testCaseIds[i];

            try {
                // Find matching example (case-insensitive)
                const exampleKey = Object.keys(examples).find(
                    key => key.toLowerCase() === testCaseId.toLowerCase()
                );

                if (!exampleKey) {
                    console.log(`⚠ [${i+1}/${testCaseIds.length}] Skipping "${testCaseId}" - no matching example`);
                    failCount++;
                    continue;
                }

                // Create a fresh page for each test case to avoid state issues
                const page = await browser.newPage();
                // Start with a large viewport
                await page.setViewport({ width: 3000, height: 2000 });

                // Navigate to grid.html via HTTP server
                const serverUrl = 'http://localhost:8000/grid/grid.html';

                let pageLoaded = false;
                for (let attempt = 1; attempt <= 3; attempt++) {
                    try {
                        await page.goto(serverUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
                        pageLoaded = true;
                        break;
                    } catch (error) {
                        if (attempt < 3) {
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }
                }

                if (!pageLoaded) {
                    throw new Error('Could not load grid.html');
                }

                // Wait for canvas to be ready
                try {
                    await page.waitForSelector('#flowchartCanvas', { timeout: 20000 });
                } catch (error) {
                    throw new Error('Canvas not found');
                }

                // Wait for scripts to initialize and examples to load
                await new Promise(resolve => setTimeout(resolve, 3000));

                // Call the page's loadExample function with the test case name
                await page.evaluate((name) => {
                    if (typeof window.loadExample === 'function') {
                        window.loadExample(name);
                    } else {
                        console.error('loadExample function not found');
                    }
                }, exampleKey);

                // Wait for rendering to complete
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Get canvas as data URL and save directly
                const canvasDataUrl = await page.evaluate(() => {
                    const canvas = document.getElementById('flowchartCanvas');
                    if (!canvas) return null;
                    return canvas.toDataURL('image/png');
                });

                if (!canvasDataUrl) {
                    throw new Error('Canvas not found or could not convert to image');
                }

                // Convert data URL to buffer and save
                const base64Data = canvasDataUrl.replace(/^data:image\/png;base64,/, '');
                const outputPath = path.join(INHOUSE_DIR, `${testCaseId}.png`);
                fs.writeFileSync(outputPath, Buffer.from(base64Data, 'base64'));

                console.log(`✓ [${i+1}/${testCaseIds.length}] Generated: ${testCaseId}.png`);
                successCount++;

                // Close page after screenshot
                await page.close();
            } catch (error) {
                console.log(`✗ [${i+1}/${testCaseIds.length}] Failed: ${testCaseId} - ${error.message}`);
                failCount++;
            }
        }
    } finally {
        await browser.close();
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`Summary: ${successCount} generated, ${failCount} failed`);
    console.log(`Output: ${INHOUSE_DIR}`);
    console.log(`${'='.repeat(50)}\n`);

    return failCount === 0;
}

generateScreenshots()
    .then(success => process.exit(success ? 0 : 1))
    .catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });

