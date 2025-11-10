const fs = require('fs');
const path = require('path');

const CURRENT_DIR = path.join(__dirname, 'svgs', 'current');
const CONFIG_FILE = path.join(__dirname, 'config.json');

// Get test case IDs from current folder
const currentFiles = fs.readdirSync(CURRENT_DIR);
const testCaseIds = currentFiles
    .filter(f => f.endsWith('.svg'))
    .map(f => f.replace('.svg', ''))
    .sort();

// Load current config
const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));

// Update test cases
config.testCases = testCaseIds.map(id => ({
    id: id,
    name: id.replace(/-/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2')
}));

// Write updated config
fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));

console.log(`✓ Updated config.json with ${testCaseIds.length} test cases`);
