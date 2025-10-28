/**
 * Core Cytoscape initialization and configuration
 */

// Global cytoscape instance
let cy = null;

/**
 * Initialize Cytoscape with default configuration
 */
function initCytoscape() {
    cy = cytoscape({
        container: document.getElementById('cy'),
        
        style: [
            // Core node styling with native labels
            {
                selector: 'node',
                style: {
                    'background-color': '#fff',
                    'border-width': 2,
                    'border-color': '#667eea',
                    'width': 220,
                    'height': 120,
                    'shape': 'round-rectangle',
                    'overlay-padding': 8,
                    'z-index': 10,

                    // Native label styling
                    'label': function(ele) { return createNodeLabel(ele.data()); },
                    'text-wrap': 'wrap',
                    'text-max-width': '200px',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'font-size': '10px',
                    'font-family': 'Arial, sans-serif',
                    'color': '#333',
                    'text-background-color': '#ffffff',
                    'text-background-opacity': 0.95,
                    'text-background-padding': '6px',
                    'text-background-shape': 'roundrectangle',
                    'text-border-width': 1,
                    'text-border-color': '#ddd',
                    'text-border-opacity': 0.8,
                    'line-height': 1.4
                }
            },
            
            // Process nodes
            {
                selector: '.process',
                style: {
                    'border-color': '#4CAF50',
                    'background-color': '#E8F5E9'
                }
            },
            
            // Decision nodes
            {
                selector: '.decision',
                style: {
                    'shape': 'diamond',
                    'border-color': '#FF9800',
                    'background-color': '#FFF3E0',
                    'width': 180,
                    'height': 180,
                    'text-max-width': '160px'
                }
            },
            
            // Data nodes
            {
                selector: '.data',
                style: {
                    'shape': 'barrel',
                    'border-color': '#2196F3',
                    'background-color': '#E3F2FD'
                }
            },
            
            // Terminal nodes
            {
                selector: '.terminal',
                style: {
                    'shape': 'round-rectangle',
                    'border-color': '#9C27B0',
                    'background-color': '#F3E5F5'
                }
            },
            
            // Group/Compound nodes - background container with label
            {
                selector: ':parent',
                style: {
                    'background-color': '#f0f0f0',
                    'background-opacity': 0.3,
                    'border-width': 2,
                    'border-color': '#999',
                    'border-style': 'dashed',
                    'label': 'data(label)',
                    'text-valign': 'top',
                    'text-halign': 'center',
                    'font-size': '14px',
                    'font-weight': 'bold',
                    'color': '#666',
                    'padding': 30,
                    'z-index': 1
                }
            },
            
            // Edges
            {
                selector: 'edge',
                style: {
                    'width': 2,
                    'line-color': '#999',
                    'target-arrow-color': '#999',
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier',
                    'label': 'data(label)',
                    'font-size': '12px',
                    'text-background-color': '#fff',
                    'text-background-opacity': 1,
                    'text-background-padding': '3px',
                    'text-rotation': 'autorotate',
                    'z-index': 5
                }
            },
            
            // Highlighted elements
            {
                selector: '.highlighted',
                style: {
                    'background-color': '#FFE082',
                    'border-color': '#F57C00',
                    'border-width': 3,
                    'transition-property': 'background-color, border-color',
                    'transition-duration': '0.3s'
                }
            },
            
            // Selected elements
            {
                selector: ':selected',
                style: {
                    'border-width': 3,
                    'border-color': '#764ba2'
                }
            }
        ],
        
        layout: {
            name: 'dagre',
            rankDir: 'TB',
            animate: true,
            animationDuration: 500,
            nodeDimensionsIncludeLabels: true,
            padding: 50
        },
        
        // Interaction options
        wheelSensitivity: 0.2,
        minZoom: 0.2,
        maxZoom: 3
    });

    // Event handlers
    setupEventHandlers();
}

/**
 * Setup event handlers for cytoscape interactions
 */
function setupEventHandlers() {
    cy.on('tap', 'node', function(evt) {
        const node = evt.target;
        showNodeInfo(node);
    });
    
    cy.on('tap', function(evt) {
        if (evt.target === cy) {
            closeInfoPanel();
        }
    });
    
    cy.on('mouseover', 'node', function(evt) {
        evt.target.addClass('highlighted');
    });
    
    cy.on('mouseout', 'node', function(evt) {
        evt.target.removeClass('highlighted');
    });
}

/**
 * Get Unicode icon for node type
 */
function getNodeIcon(nodeType) {
    const iconMap = {
        process: '⚙️',
        decision: '◆',
        data: '🗄️',
        terminal: '⏹',
        user: '👤',
        system: '💻',
        api: '🔌',
        document: '📄'
    };
    return iconMap[nodeType] || '●';
}

/**
 * Create native Cytoscape label for nodes
 * Formats: Icon + Title + Description + Metrics
 */
function createNodeLabel(data) {
    if (!data.nodeType) {
        // Group/parent nodes - use their label property
        return data.label || data.id;
    }

    const icon = getNodeIcon(data.nodeType);
    const title = data.title || data.id;

    let label = `${icon}\n${title}`;

    // Add description if present (truncate if too long)
    if (data.description) {
        const maxDescLength = 80;
        let desc = data.description;
        if (desc.length > maxDescLength) {
            desc = desc.substring(0, maxDescLength) + '...';
        }
        label += `\n${desc}`;
    }

    // Add metrics if present
    if (data.metrics) {
        const metricsText = Object.entries(data.metrics)
            .map(([key, value]) => `${key}: ${value}`)
            .join(' | ');
        label += `\n${metricsText}`;
    }

    return label;
}

/**
 * Get the cytoscape instance
 */
function getCyInstance() {
    return cy;
}

/**
 * Register Cytoscape extensions
 */
function registerExtensions() {
    cytoscape.use(cytoscapeDagre);
    cytoscape.use(cytoscapeCola);

    // Register SVG export extension
    if (typeof cytoscapeSvg !== 'undefined') {
        cytoscape.use(cytoscapeSvg);
        console.log('SVG export extension registered');
    } else {
        console.warn('cytoscape-svg extension not loaded');
    }
}

