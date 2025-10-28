/**
 * Layout configurations and functions
 */

/**
 * Apply a layout to the graph
 * @param {string} layoutName - Name of the layout to apply
 */
function applyLayout(layoutName) {
    const cy = getCyInstance();
    if (!cy) {
        console.error('Cytoscape not initialized yet');
        return;
    }
    
    const layouts = {
        dagre: {
            name: 'dagre',
            rankDir: 'TB',
            animate: true,
            animationDuration: 500,
            fit: true,
            padding: 50,
            nodeDimensionsIncludeLabels: true,
            spacingFactor: 1.5
        },
        breadthfirst: {
            name: 'breadthfirst',
            directed: true,
            animate: true,
            animationDuration: 500,
            fit: true,
            padding: 50,
            spacingFactor: 1.5
        },
        cola: {
            name: 'cola',
            animate: true,
            randomize: true,  // Always start with random positions for consistent results
            fit: true,
            padding: 50,
            nodeSpacing: 50,
            edgeLength: 150
        },
        grid: {
            name: 'grid',
            animate: true,
            fit: true,
            padding: 50,
            rows: 3
        },
        circle: {
            name: 'circle',
            animate: true,
            fit: true,
            padding: 50
        }
    };
    
    cy.layout(layouts[layoutName]).run();
}

/**
 * Load a dataset into the graph
 * @param {string} type - Type of dataset to load
 */
function loadDataset(type) {
    const cy = getCyInstance();
    if (!cy) {
        console.error('Cytoscape not initialized yet');
        return;
    }

    showLoading();

    const datasets = {
        workflow: getWorkflowData(),
        organization: getOrganizationData(),
        system: getSystemArchitectureData(),
        complex: getComplexDiagramData(),
        complexNoGroups: getComplexNoGroupsData()
    };

    const data = datasets[type];
    cy.elements().remove();
    cy.add(data);
    applyLayout('dagre');

    setTimeout(() => hideLoading(), 500);
}

/**
 * Apply physics simulation to refine the current layout
 * Uses Cola with randomize: false to start from current positions
 */
function applyPhysicsSimulation() {
    const cy = getCyInstance();
    if (!cy) {
        console.error('Cytoscape not initialized yet');
        return;
    }

    console.log('Applying physics simulation from current positions...');

    // Cola configuration with randomize: false to use current positions
    const physicsConfig = {
        name: 'cola',
        animate: true,
        randomize: false,  // Start from current positions
        fit: true,
        padding: 50,
        nodeSpacing: 50,
        edgeLength: 150,
        maxSimulationTime: 4000,  // Run for 4 seconds
        convergenceThreshold: 0.01,
        avoidOverlap: true,
        handleDisconnected: true
    };

    const layout = cy.layout(physicsConfig);
    layout.run();
}

