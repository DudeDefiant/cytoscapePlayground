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
            // Core node styling
            {
                selector: 'node',
                style: {
                    'background-color': '#fff',
                    'border-width': 2,
                    'border-color': '#667eea',
                    'width': 200,  // Match HTML label width
                    'height': 90,  // Match HTML label max-height
                    'shape': 'round-rectangle',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'overlay-padding': 8,
                    'z-index': 10
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
                    'width': 120,  // Slightly smaller for diamond shape
                    'height': 120
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
    
    // Initialize HTML labels for rich content (exclude group container nodes)
    cy.nodeHtmlLabel([
        {
            query: 'node[nodeType]',  // Only apply to nodes with nodeType (excludes group containers)
            valign: "center",
            halign: "center",
            valignBox: "center",
            halignBox: "center",
            tpl: function(data) {
                return createNodeHTML(data);
            }
        }
    ]);
    
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
 * Create rich HTML content for nodes
 */
function createNodeHTML(data) {
    const iconMap = {
        process: 'fa-cogs',
        decision: 'fa-code-branch',
        data: 'fa-database',
        terminal: 'fa-flag-checkered',
        user: 'fa-user',
        system: 'fa-server',
        api: 'fa-plug',
        document: 'fa-file-alt'
    };
    
    const colorMap = {
        process: '#4CAF50',
        decision: '#FF9800',
        data: '#2196F3',
        terminal: '#9C27B0'
    };
    
    const icon = iconMap[data.nodeType] || 'fa-circle';
    const color = colorMap[data.nodeType] || '#667eea';
    
    let html = `
        <div class="node-html-label node-${data.nodeType}">
            <i class="node-icon fas ${icon}" style="color: ${color}"></i>
            <div class="node-title">${data.title || data.id}</div>
    `;
    
    if (data.description) {
        html += `<div class="node-description">${data.description}</div>`;
    }
    
    if (data.metrics) {
        html += '<div class="node-metrics">';
        for (const [key, value] of Object.entries(data.metrics)) {
            html += `
                <div class="metric">
                    <div class="metric-value">${value}</div>
                    <div class="metric-label">${key}</div>
                </div>
            `;
        }
        html += '</div>';
    }
    
    html += '</div>';
    return html;
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

