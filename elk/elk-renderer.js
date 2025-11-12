// ELK Flowchart Renderer
// Uses ELKJS for hierarchical graph layout

let examplesData = {};
let currentExample = null;
let elk = null;
let debugMode = false;
let currentDirection = 'DOWN';
let mergeEdges = false;

// Initialize ELK
async function initELK() {
    try {
        elk = new ELK();
        console.log('✅ ELK initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize ELK:', error);
    }
}

// Load examples from JSON
async function loadExamples() {
    try {
        const response = await fetch('../grid/examples.json');
        examplesData = await response.json();
        console.log('✅ Loaded', Object.keys(examplesData).length, 'examples');
        
        // Load first example
        loadSelectedExample();
    } catch (error) {
        console.error('❌ Failed to load examples:', error);
    }
}

// Load selected example
async function loadSelectedExample() {
    const select = document.getElementById('exampleSelect');
    const exampleName = select.value;
    
    if (examplesData[exampleName]) {
        currentExample = examplesData[exampleName];
        await renderFlowchart(currentExample);
    }
}

// Helper function to add wrapped text to SVG
function addWrappedText(svg, x, y, text, color, fontSize) {
    const maxCharsPerLine = 20;
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
        if ((currentLine + word).length > maxCharsPerLine) {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = currentLine ? currentLine + ' ' + word : word;
        }
    });
    if (currentLine) lines.push(currentLine);

    const lineHeight = fontSize * 1.3;
    const startY = y - (lines.length - 1) * lineHeight / 2;

    lines.forEach((line, index) => {
        const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textEl.setAttribute('x', x);
        textEl.setAttribute('y', startY + index * lineHeight);
        textEl.setAttribute('text-anchor', 'middle');
        textEl.setAttribute('dominant-baseline', 'middle');
        textEl.setAttribute('font-size', fontSize);
        textEl.setAttribute('fill', color);
        textEl.setAttribute('font-weight', 'bold');
        textEl.setAttribute('font-family', 'Arial, sans-serif');
        textEl.textContent = line;
        svg.appendChild(textEl);
    });
}

// Convert flowchart data to ELK graph format
function convertToELKGraph(data) {
    const graph = {
        id: 'root',
        // layoutOptions: {
        //     // Use the layered layout algorithm (tree-like)
        //     'elk.algorithm': 'layered',
        //     'elk.direction': currentDirection,
        //
        //     // Layering strategy - NETWORK_SIMPLEX balances layer widths better
        //     'elk.layered.layering.strategy': 'NETWORK_SIMPLEX',
        //
        //     // Force symmetric node placement
        //     'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
        //     'elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
        //
        //     // Make layout deterministic & stable
        //     'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES',
        //     'elk.layered.crossingMinimization.strategy': 'INTERACTIVE',
        //     'elk.crossingMinimization.semiInteractive': 'true',
        //
        //     // Orthogonal edges for clean connectors
        //     'elk.edgeRouting': 'ORTHOGONAL',
        //
        //     // Cycle-breaking that preserves hierarchy
        //     'elk.layered.cycleBreaking.strategy': 'DEPTH_FIRST',
        //
        //     // General spacing controls - reduced for more compact layout
        //     'elk.spacing.nodeNode': '60',
        //     'elk.layered.spacing.nodeNodeBetweenLayers': '80',
        //     'elk.spacing.edgeNode': '30',
        //     'elk.spacing.edgeEdge': '30',
        //
        //     // Better center alignment across layers
        //     'elk.layered.nodePlacement.bk.edgeStraightening': 'true',
        //     'elk.layered.mergeEdges': 'false',
        //
        //     // Optional visual polish
        //     'elk.layered.wrapping.strategy': 'SINGLE_EDGE',
        //     'elk.layered.spacing.baseValue': '40'
        // },
        layoutOptions: {
            // Core algorithm settings (D2 defaults)
            'elk.algorithm': 'layered',
            'elk.direction': currentDirection,
            // Note: NOT specifying layering strategy - use ELK's default which matches D2

            // Quality and thoroughness (D2 uses 8)
            'elk.layered.thoroughness': '8',

            'org.eclipse.elk.layered.feedbackEdges': 'true',

            // Spacing between layers and edges (D2 defaults)
            'elk.layered.spacing.edgeEdgeBetweenLayers': '50',
            'elk.layered.spacing.nodeNodeBetweenLayers': '70',
            'elk.spacing.edgeNode': '40',
            'elk.spacing.edgeNodeBetweenLayers': '40',
            'elk.spacing.nodeSelfLoop': '50',

            // Node placement strategy
            'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
            'elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',

            // Hierarchy and model order (D2 settings)
            'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
            'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES',

            // Cycle breaking strategy (D2 uses GREEDY_MODEL_ORDER)
            'elk.layered.cycleBreaking.strategy': 'GREEDY_MODEL_ORDER',

            // Node sizing and alignment (D2 settings)
            'elk.nodeSize.constraints': 'MINIMUM_SIZE',
            'elk.contentAlignment': 'H_CENTER V_CENTER',

            // Edge routing and merging
            'elk.edgeRouting': 'ORTHOGONAL',
            'elk.layered.mergeEdges': mergeEdges ? 'true' : 'false'
        },
        children: [],
        edges: []
    };

    // Add nodes - ELK will compute positions
    if (data.nodes) {
        data.nodes.forEach(node => {
            let width = 150;
            let height = 50;

            // Adjust size for decision nodes (diamond shape)
            if (node.type === 'decision') {
                width = 140;
                height = 80;
            } else if (node.type === 'start' || node.type === 'end') {
                width = 140;
                height = 50;
            }

            const elkNode = {
                id: node.id,
                label: node.label || node.id,
                width: width,
                height: height,
                layoutOptions: {
                    'elk.nodeLabels.placement': 'CENTER'
                },
                properties: {
                    type: node.type || 'process'
                }
            };

            graph.children.push(elkNode);
        });
    }

    // Add edges
    if (data.edges) {
        data.edges.forEach((edge, index) => {
            const elkEdge = {
                id: `edge-${index}`,
                sources: [edge.from],
                targets: [edge.to],
                label: edge.label || ''
            };
            graph.edges.push(elkEdge);
        });


    }

    return graph;
}

// Render flowchart using ELK
async function renderFlowchart(data) {
    if (!elk) {
        await initELK();
    }

    try {
        const elkGraph = convertToELKGraph(data);

        // Run ELK layout
        const layoutedGraph = await elk.layout(elkGraph);

        // Render to SVG
        renderToSVG(layoutedGraph, data);
        
        // Update stats
        document.getElementById('nodeCount').textContent = data.nodes?.length || 0;
        document.getElementById('edgeCount').textContent = data.edges?.length || 0;
        
        if (debugMode) {
            console.log('Layouted graph:', layoutedGraph);
        }
    } catch (error) {
        console.error('❌ Layout error:', error);
        document.getElementById('info').textContent = 'Layout error: ' + error.message;
    }
}

// Render layouted graph to SVG
function renderToSVG(layoutedGraph, originalData) {
    const svg = document.getElementById('flowchartSvg');
    svg.innerHTML = '';

    // Calculate bounds
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    layoutedGraph.children?.forEach(node => {
        minX = Math.min(minX, node.x || 0);
        minY = Math.min(minY, node.y || 0);
        maxX = Math.max(maxX, (node.x || 0) + (node.width || 0));
        maxY = Math.max(maxY, (node.y || 0) + (node.height || 0));
    });

    const padding = 40;
    const width = Math.max(800, maxX - minX + padding * 2);
    const height = Math.max(600, maxY - minY + padding * 2);

    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `${minX - padding} ${minY - padding} ${width} ${height}`);

    // Add arrow marker with better styling
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

    // Define filter for drop shadow
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'shadow');
    filter.setAttribute('x', '-50%');
    filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%');
    filter.setAttribute('height', '200%');
    const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    feGaussianBlur.setAttribute('in', 'SourceGraphic');
    feGaussianBlur.setAttribute('stdDeviation', '2');
    filter.appendChild(feGaussianBlur);
    defs.appendChild(filter);

    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '4');
    marker.setAttribute('markerHeight', '6');
    marker.setAttribute('refX', '4');
    marker.setAttribute('refY', '2');
    marker.setAttribute('orient', 'auto');
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', '0 0, 4 2, 0 4');
    polygon.setAttribute('fill', '#2d3748');
    marker.appendChild(polygon);
    defs.appendChild(marker);
    svg.appendChild(defs);

    // Draw edges first (so they appear behind nodes)
    layoutedGraph.edges?.forEach(edge => {
        if (edge.sections && edge.sections.length > 0) {
            const section = edge.sections[0];
            const points = section.bendPoints || [];

            let pathData = `M ${section.startPoint.x} ${section.startPoint.y}`;
            points.forEach(point => {
                pathData += ` L ${point.x} ${point.y}`;
            });
            pathData += ` L ${section.endPoint.x} ${section.endPoint.y}`;

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', pathData);
            path.setAttribute('stroke', '#2d3748');
            path.setAttribute('stroke-width', '2.5');
            path.setAttribute('fill', 'none');
            path.setAttribute('marker-end', 'url(#arrowhead)');
            path.setAttribute('stroke-linecap', 'round');
            path.setAttribute('stroke-linejoin', 'round');
            svg.appendChild(path);

            // Add edge label if present
            if (edge.label) {
                // Calculate label position along the path
                let labelX = section.startPoint.x;
                let labelY = section.startPoint.y;

                if (points.length > 0) {
                    labelX = points[Math.floor(points.length / 2)].x;
                    labelY = points[Math.floor(points.length / 2)].y;
                } else {
                    labelX = (section.startPoint.x + section.endPoint.x) / 2;
                    labelY = (section.startPoint.y + section.endPoint.y) / 2;
                }

                // Add background rectangle for label
                const labelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                labelBg.setAttribute('x', labelX - 25);
                labelBg.setAttribute('y', labelY - 12);
                labelBg.setAttribute('width', '50');
                labelBg.setAttribute('height', '20');
                labelBg.setAttribute('fill', 'white');
                labelBg.setAttribute('stroke', '#e2e8f0');
                labelBg.setAttribute('stroke-width', '1');
                labelBg.setAttribute('rx', '3');
                svg.appendChild(labelBg);

                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', labelX);
                text.setAttribute('y', labelY);
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('dominant-baseline', 'middle');
                text.setAttribute('font-size', '11');
                text.setAttribute('font-weight', '600');
                text.setAttribute('fill', '#2d3748');
                text.setAttribute('font-family', 'Arial, sans-serif');
                text.textContent = edge.label;
                svg.appendChild(text);
            }
        }
    });

    // Draw nodes
    layoutedGraph.children?.forEach(node => {
        const nodeData = originalData.nodes?.find(n => n.id === node.id);
        const nodeType = nodeData?.type || 'process';

        if (nodeType === 'decision') {
            // Draw diamond for decision nodes
            const x = node.x + node.width / 2;
            const y = node.y + node.height / 2;
            const w = node.width / 2;
            const h = node.height / 2;

            const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            polygon.setAttribute('points', `${x},${y - h} ${x + w},${y} ${x},${y + h} ${x - w},${y}`);
            polygon.setAttribute('fill', '#ed8936');
            polygon.setAttribute('stroke', '#2d3748');
            polygon.setAttribute('stroke-width', '2.5');
            polygon.setAttribute('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))');
            svg.appendChild(polygon);

            // Add text with wrapping
            addWrappedText(svg, x, y, node.label, 'white', 12);
        } else {
            // Draw rectangle for other nodes
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', node.x);
            rect.setAttribute('y', node.y);
            rect.setAttribute('width', node.width);
            rect.setAttribute('height', node.height);
            rect.setAttribute('fill', nodeType === 'start' || nodeType === 'end' ? '#48bb78' : '#4299e1');
            rect.setAttribute('stroke', '#2d3748');
            rect.setAttribute('stroke-width', '2.5');
            rect.setAttribute('rx', nodeType === 'start' || nodeType === 'end' ? '12' : '6');
            rect.setAttribute('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))');
            svg.appendChild(rect);

            // Add text with wrapping
            addWrappedText(svg, node.x + node.width / 2, node.y + node.height / 2, node.label, 'white', 12);
        }
    });
}

// Change layout direction
async function changeDirection() {
    const select = document.getElementById('layoutDirection');
    currentDirection = select.value;
    if (currentExample) {
        await renderFlowchart(currentExample);
    }
}

// Fit to view
function fitToView() {
    const svg = document.getElementById('flowchartSvg');
    const container = document.querySelector('.canvas-container');
    
    if (svg.children.length > 0) {
        const bbox = svg.getBBox();
        const padding = 20;
        svg.setAttribute('viewBox', `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`);
    }
}

// Toggle debug mode
function toggleDebug() {
    debugMode = !debugMode;
    console.log('Debug mode:', debugMode);
}

// Toggle merge edges
async function toggleMergeEdges() {
    const checkbox = document.getElementById('mergeEdgesCheckbox');
    mergeEdges = checkbox.checked;
    console.log('Merge edges:', mergeEdges);
    if (currentExample) {
        await renderFlowchart(currentExample);
    }
}

// Render custom JSON
async function renderCustomJSON() {
    const jsonInput = document.getElementById('jsonInput').value;
    try {
        const data = JSON.parse(jsonInput);
        await renderFlowchart(data);
    } catch (error) {
        alert('Invalid JSON: ' + error.message);
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', async () => {
    await initELK();
    await loadExamples();
});

