const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directories
const d2Dir = path.join(__dirname, 'svgs/d2');
const elkDir = path.join(__dirname, 'svgs/elk');
const talaDir = path.join(__dirname, 'svgs/tala');

// Create output directories
[elkDir, talaDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Get all D2 files
const d2Files = fs.readdirSync(d2Dir)
    .filter(f => f.endsWith('.d2'))
    .sort();

console.log(`Found ${d2Files.length} D2 files\n`);

// Render with ELK layout
console.log('Rendering with ELK layout...\n');
let elkSuccess = 0;
let elkFail = 0;

for (let i = 0; i < d2Files.length; i++) {
    const file = d2Files[i];
    const testCaseId = path.basename(file, '.d2');
    const d2Path = path.join(d2Dir, file);
    const svgPath = path.join(elkDir, `${testCaseId}.svg`);

    try {
        execSync(`d2 --layout elk "${d2Path}" "${svgPath}"`, { stdio: 'pipe' });
        console.log(`✓ [${i+1}/${d2Files.length}] ELK: ${testCaseId}.svg`);
        elkSuccess++;
    } catch (error) {
        console.log(`✗ [${i+1}/${d2Files.length}] ELK: ${testCaseId} - ${error.message.split('\n')[0]}`);
        elkFail++;
    }
}

console.log(`\nELK Summary: ${elkSuccess} generated, ${elkFail} failed\n`);

// Render with Tala layout
console.log('Rendering with Tala layout...\n');
let talaSuccess = 0;
let talaFail = 0;

for (let i = 0; i < d2Files.length; i++) {
    const file = d2Files[i];
    const testCaseId = path.basename(file, '.d2');
    const d2Path = path.join(d2Dir, file);
    const svgPath = path.join(talaDir, `${testCaseId}.svg`);

    try {
        execSync(`d2 --layout tala "${d2Path}" "${svgPath}"`, { stdio: 'pipe' });
        console.log(`✓ [${i+1}/${d2Files.length}] Tala: ${testCaseId}.svg`);
        talaSuccess++;
    } catch (error) {
        console.log(`✗ [${i+1}/${d2Files.length}] Tala: ${testCaseId} - ${error.message.split('\n')[0]}`);
        talaFail++;
    }
}

console.log(`\nTala Summary: ${talaSuccess} generated, ${talaFail} failed\n`);

// Summary
console.log(`${'='.repeat(50)}`);
console.log(`Total Summary:`);
console.log(`  ELK:  ${elkSuccess} generated, ${elkFail} failed`);
console.log(`  Tala: ${talaSuccess} generated, ${talaFail} failed`);
console.log(`${'='.repeat(50)}\n`);

// Verify files
const elkFiles = fs.readdirSync(elkDir).filter(f => f.endsWith('.svg')).length;
const talaFiles = fs.readdirSync(talaDir).filter(f => f.endsWith('.svg')).length;

console.log(`Files created:`);
console.log(`  ${elkDir}: ${elkFiles} SVG files`);
console.log(`  ${talaDir}: ${talaFiles} SVG files`);

