# Cytoscape.js Interactive Graph Playground

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://your-username.github.io/cytoscape)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A powerful, interactive graph visualization playground built with Cytoscape.js. Create and visualize flowcharts, organizational charts, system architectures, and complex data flows with an intuitive interface and powerful layout algorithms.

> **🚀 Zero Dependencies** • **📦 No Build Process** • **🎨 Pure Vanilla JavaScript**

## ✨ Features

- **🎨 Multiple Layout Algorithms** - Dagre (hierarchical), Breadth-first, Force-directed (Cola), Grid, and Circle layouts
- **🎯 Rich Node Types** - Process, Decision, Data, Terminal, User, System, API, and Document nodes with custom styling
- **🖱️ Interactive Controls** - Zoom, pan, fit-to-screen, and node selection with detailed info panels
- **📊 5 Sample Datasets** - Pre-configured examples showcasing different use cases and complexity levels
- **📦 Compound Nodes** - Group related nodes together with visual containers and labels
- **💾 Export/Import** - Save and load graph data as JSON files
- **✏️ JSON Editor** - Edit graph structure in real-time with built-in validation
- **📱 Responsive Design** - Clean, modern UI that works across different screen sizes

## 🚀 Quick Start

### View Live Demo
Visit the **[live demo](https://your-username.github.io/cytoscape)** to try it out immediately.

### Run Locally

**Option 1: Direct File Access**
```bash
git clone https://github.com/your-username/cytoscape.git
cd cytoscape
open index.html  # macOS
# or just double-click index.html
```

**Option 2: Local Server (Recommended)**
```bash
git clone https://github.com/your-username/cytoscape.git
cd cytoscape
python -m http.server 8000
# Visit http://localhost:8000
```

That's it! No `npm install`, no build process, no configuration needed.

## 📖 Usage

### Navigation
- **Pan**: Click and drag on the canvas
- **Zoom**: Mouse wheel or zoom buttons
- **Select Node**: Click any node to view details in the info panel
- **Fit to Screen**: Auto-center and scale the entire graph

### Sample Datasets

| Dataset | Nodes | Groups | Features |
|---------|-------|--------|----------|
| **Workflow (No Groups, Medium)** | 13 | 0 | Icon + Title + Description |
| **Org Chart (No Groups, Minimal)** | 23 | 0 | Icon + Title only |
| **System Arch (With Groups, Minimal)** | 30 | 5 | Icon + Title + Groups |
| **Complex (With Groups, Full)** | 17 | 4 | All features + Groups |
| **Complex (No Groups, Full)** | 17 | 0 | All features, flat structure |

### Layout Algorithms

- **Hierarchical (Dagre)** - Best for workflows and process flows
- **Breadth First** - Tree-like expansion from root nodes
- **Force-Directed (Cola)** - Physics-based organic layout
- **Grid Layout** - Organized grid arrangement
- **Circle Layout** - Circular arrangement

### JSON Export/Import

**Export:**
1. Click "Export JSON" button
2. Download JSON file with current graph structure

**Edit:**
1. Click "Edit JSON" button
2. Modify the JSON in the editor
3. Click "Apply Changes" to update the graph

**Import:**
1. Click "Import JSON File" button
2. Select a JSON file from your computer
3. Graph updates automatically

## 📁 Project Structure

```
cytoscape/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # All application styles
├── js/
│   ├── app.js            # Application entry point
│   ├── core.js           # Cytoscape initialization
│   ├── datasets.js       # Sample graph datasets
│   ├── layouts.js        # Layout configurations
│   ├── ui.js             # UI interaction functions
│   └── json-editor.js    # JSON editing features
└── README.md              # This file
```

## 🛠️ Technology Stack

- **[Cytoscape.js](https://js.cytoscape.org/)** v3.26.0 - Graph visualization library
- **[Dagre](https://github.com/dagrejs/dagre)** - Hierarchical layout algorithm
- **[Cola.js](https://ialab.it.monash.edu/webcola/)** - Force-directed layout
- **[cytoscape-node-html-label](https://github.com/kaluginserg/cytoscape-node-html-label)** - Rich HTML node rendering
- **[Font Awesome](https://fontawesome.com/)** 6.4.0 - Icons
- **Vanilla JavaScript** - No frameworks, pure ES6+

## 🎨 Customization

### Adding New Datasets

Create a new function in `js/datasets.js`:

```javascript
function getMyCustomData() {
    return [
        { group: 'nodes', data: { 
            id: 'node1', 
            nodeType: 'process',
            title: 'My Node',
            description: 'Node description',
            metrics: { 'Key': 'Value' }
        }, classes: 'process' },
        { group: 'edges', data: { 
            source: 'node1', 
            target: 'node2',
            label: 'Edge label'
        }}
    ];
}
```

Then register it in `js/layouts.js`:

```javascript
const datasets = {
    myCustom: getMyCustomData(),
    // ... other datasets
};
```

### Node Types

Available node types with built-in styling:
- `process` - Blue rounded rectangles
- `decision` - Yellow diamonds
- `data` - Green cylinders
- `terminal` - Purple rounded rectangles
- `user` - Orange user icons
- `system` - Teal system icons
- `api` - Indigo API icons
- `document` - Gray document icons

## 📄 JSON Format

Graph data follows this structure:

```json
{
  "elements": [
    {
      "group": "nodes",
      "data": {
        "id": "unique_id",
        "nodeType": "process",
        "title": "Node Title",
        "description": "Optional description",
        "metrics": { "Key": "Value" },
        "parent": "group_id"
      },
      "classes": "process"
    },
    {
      "group": "edges",
      "data": {
        "source": "node1_id",
        "target": "node2_id",
        "label": "Edge Label"
      }
    }
  ]
}
```

## 🚀 Deployment

### GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Select branch `main` and folder `/` (root)
4. Click Save
5. Your site will be live at `https://your-username.github.io/cytoscape`

### Other Static Hosts

This project works on any static hosting service:
- **Netlify**: Drag and drop the folder
- **Vercel**: Import from GitHub
- **Cloudflare Pages**: Connect your repository
- **AWS S3**: Upload files to bucket with static hosting enabled

## 📝 License

MIT License - feel free to use this project for any purpose.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 🙏 Acknowledgments

- [Cytoscape.js](https://js.cytoscape.org/) - Amazing graph visualization library
- [Dagre](https://github.com/dagrejs/dagre) - Hierarchical layout algorithm
- [Cola.js](https://ialab.it.monash.edu/webcola/) - Force-directed layout
- [Font Awesome](https://fontawesome.com/) - Beautiful icons

## 📧 Contact

Questions or feedback? Open an issue on GitHub!

---

**Made with ❤️ using Cytoscape.js**

