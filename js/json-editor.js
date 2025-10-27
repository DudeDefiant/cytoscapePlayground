/**
 * JSON Editor functionality for editing and importing graph data
 */

/**
 * Open the JSON editor modal with current graph data
 */
function openJSONEditor() {
    const cy = getCyInstance();
    if (!cy) {
        console.error('Cytoscape not initialized yet');
        return;
    }
    
    // Get current graph data
    const currentData = getCurrentGraphJSON();
    
    // Populate textarea with formatted JSON
    const textarea = document.getElementById('jsonEditorTextarea');
    textarea.value = JSON.stringify(currentData, null, 2);
    
    // Clear any previous errors
    document.getElementById('jsonError').classList.remove('active');
    
    // Show modal
    document.getElementById('jsonEditorModal').classList.add('active');
}

/**
 * Close the JSON editor modal
 */
function closeJSONEditor() {
    document.getElementById('jsonEditorModal').classList.remove('active');
}

/**
 * Get current graph data as JSON object
 */
function getCurrentGraphJSON() {
    const cy = getCyInstance();
    if (!cy) {
        return { elements: [] };
    }
    
    const elements = [];
    
    // Get all nodes with their data and classes
    cy.nodes().forEach(node => {
        const element = {
            group: 'nodes',
            data: node.data()
        };
        
        // Add classes if present
        const classes = node.classes();
        if (classes && classes.length > 0) {
            element.classes = classes.join(' ');
        }
        
        elements.push(element);
    });
    
    // Get all edges
    cy.edges().forEach(edge => {
        elements.push({
            group: 'edges',
            data: edge.data()
        });
    });
    
    return { elements };
}

/**
 * Apply JSON data to the graph
 */
function applyJSONToGraph() {
    const textarea = document.getElementById('jsonEditorTextarea');
    const errorDiv = document.getElementById('jsonError');
    
    try {
        // Parse JSON
        const jsonData = JSON.parse(textarea.value);
        
        // Validate structure
        if (!jsonData.elements || !Array.isArray(jsonData.elements)) {
            throw new Error('JSON must contain an "elements" array');
        }
        
        // Clear error
        errorDiv.classList.remove('active');
        
        // Update graph
        updateGraphFromJSON(jsonData.elements);
        
        // Close modal
        closeJSONEditor();
        
        // Show success message
        alert('Graph updated successfully!');
        
    } catch (error) {
        // Show error
        errorDiv.textContent = `Error: ${error.message}`;
        errorDiv.classList.add('active');
        console.error('JSON parsing error:', error);
    }
}

/**
 * Update the graph with new JSON data
 * @param {Array} elements - Array of graph elements
 */
function updateGraphFromJSON(elements) {
    const cy = getCyInstance();
    if (!cy) {
        console.error('Cytoscape not initialized yet');
        return;
    }
    
    showLoading();
    
    // Remove existing elements
    cy.elements().remove();
    
    // Add new elements
    cy.add(elements);
    
    // Apply default layout
    applyLayout('dagre');
    
    setTimeout(() => hideLoading(), 500);
}

/**
 * Handle file upload for JSON import
 */
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    
    // Check if it's a JSON file
    if (!file.name.endsWith('.json')) {
        alert('Please select a JSON file');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const jsonData = JSON.parse(e.target.result);
            
            // Validate structure
            if (!jsonData.elements || !Array.isArray(jsonData.elements)) {
                throw new Error('JSON must contain an "elements" array');
            }
            
            // Update graph
            updateGraphFromJSON(jsonData.elements);
            
            // Show success message
            alert('JSON file loaded successfully!');
            
        } catch (error) {
            alert(`Error loading JSON file: ${error.message}`);
            console.error('File parsing error:', error);
        }
    };
    
    reader.onerror = function() {
        alert('Error reading file');
    };
    
    reader.readAsText(file);
}

/**
 * Trigger file input click
 */
function triggerFileUpload() {
    document.getElementById('jsonFileInput').click();
}

/**
 * Export current graph as JSON file (enhanced version)
 */
function exportGraphJSON() {
    const cy = getCyInstance();
    if (!cy) {
        console.error('Cytoscape not initialized yet');
        return;
    }
    
    const jsonData = getCurrentGraphJSON();
    
    const dataStr = JSON.stringify(jsonData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    link.download = `cytoscape-graph-${timestamp}.json`;
    
    link.click();
    URL.revokeObjectURL(url);
    
    console.log('Exported JSON:', jsonData);
}

/**
 * Initialize JSON editor event listeners
 */
function initJSONEditor() {
    // File input change listener
    const fileInput = document.getElementById('jsonFileInput');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('jsonEditorModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeJSONEditor();
            }
        });
    }
}

