/**
 * UI interaction functions
 */

/**
 * Show node information in the info panel
 * @param {object} node - Cytoscape node object
 */
function showNodeInfo(node) {
    const data = node.data();
    document.getElementById('nodeId').textContent = data.id;
    document.getElementById('nodeType').textContent = data.nodeType || 'standard';
    document.getElementById('nodeStatus').textContent = data.status || 'active';
    document.getElementById('nodeGroup').textContent = data.parent || 'none';
    
    const incomingEdges = node.incomers('edge').length;
    const outgoingEdges = node.outgoers('edge').length;
    document.getElementById('nodeConnections').textContent = 
        `${incomingEdges} in, ${outgoingEdges} out`;
    
    document.getElementById('infoPanel').classList.add('active');
}

/**
 * Close the info panel
 */
function closeInfoPanel() {
    document.getElementById('infoPanel').classList.remove('active');
}

/**
 * Fit the graph to screen
 */
function fitToScreen() {
    const cy = getCyInstance();
    if (!cy) {
        console.error('Cytoscape not initialized yet');
        return;
    }
    cy.fit();
}

/**
 * Zoom in on the graph
 */
function zoomIn() {
    const cy = getCyInstance();
    if (!cy) {
        console.error('Cytoscape not initialized yet');
        return;
    }
    cy.zoom(cy.zoom() * 1.2);
}

/**
 * Zoom out on the graph
 */
function zoomOut() {
    const cy = getCyInstance();
    if (!cy) {
        console.error('Cytoscape not initialized yet');
        return;
    }
    cy.zoom(cy.zoom() * 0.8);
}

/**
 * Export graph data as JSON
 */
function exportJSON() {
    const cy = getCyInstance();
    if (!cy) {
        console.error('Cytoscape not initialized yet');
        return;
    }
    
    const jsonData = {
        nodes: cy.nodes().map(n => n.data()),
        edges: cy.edges().map(e => e.data())
    };
    
    const dataStr = JSON.stringify(jsonData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cytoscape-flowchart.json';
    link.click();
    
    console.log('Exported JSON:', jsonData);
    alert('JSON exported! Check console and downloads.');
}

/**
 * Show loading indicator
 */
function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

/**
 * Hide loading indicator
 */
function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

