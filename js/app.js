/**
 * Main application entry point
 * Initializes the Cytoscape playground and coordinates all modules
 */

/**
 * Initialize the application
 */
function initApp() {
    // Register Cytoscape extensions
    registerExtensions();
    
    // Initialize Cytoscape
    initCytoscape();
    
    // Initialize JSON editor
    initJSONEditor();
    
    // Load default dataset
    loadDataset('workflow');
}

/**
 * Initialize on page load
 */
window.addEventListener('DOMContentLoaded', function() {
    initApp();
});

