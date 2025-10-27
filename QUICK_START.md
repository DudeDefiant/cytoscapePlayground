# Quick Start Guide

Get up and running with Cytoscape Playground in 60 seconds!

## 🏃 Run Locally (30 seconds)

### Method 1: Direct Open
```bash
# Clone and open
git clone https://github.com/your-username/cytoscape.git
cd cytoscape
open index.html  # macOS
# or double-click index.html on Windows/Linux
```

### Method 2: Local Server (Recommended)
```bash
# Clone
git clone https://github.com/your-username/cytoscape.git
cd cytoscape

# Start server (choose one)
./start.sh                    # Use the included script
python3 -m http.server 8000   # Python 3
python -m SimpleHTTPServer 8000  # Python 2
npx http-server -p 8000       # Node.js

# Visit http://localhost:8000
```

## 🚀 Deploy to GitHub Pages (2 minutes)

```bash
# 1. Create repo on GitHub (via website or CLI)
gh repo create cytoscape --public

# 2. Push code
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/cytoscape.git
git push -u origin main

# 3. Enable Pages
# Go to Settings → Pages → Select main branch → Save

# 4. Visit your site (wait 1-2 min)
# https://YOUR-USERNAME.github.io/cytoscape
```

## 📖 Basic Usage

### Load Sample Data
Click any dataset button:
- **Workflow** - Simple process flow
- **Org Chart** - Company hierarchy
- **System Arch** - Microservices with groups
- **Complex (With Groups)** - Full features + groups
- **Complex (No Groups)** - Full features, flat

### Change Layout
Click layout buttons:
- **Hierarchical** - Best for workflows
- **Breadth First** - Tree structure
- **Force-Directed** - Organic layout
- **Grid** - Organized grid
- **Circle** - Circular arrangement

### Navigate
- **Pan**: Click and drag
- **Zoom**: Mouse wheel or buttons
- **Select**: Click any node
- **Fit**: Click "Fit to Screen"

### Export/Import
- **Export**: Click "Export JSON" → Download file
- **Edit**: Click "Edit JSON" → Modify → Apply
- **Import**: Click "Import JSON File" → Select file

## 🎨 Customize

### Add Your Own Data

Edit `js/datasets.js`:
```javascript
function getMyData() {
    return [
        { 
            group: 'nodes', 
            data: { 
                id: 'n1', 
                nodeType: 'process',
                title: 'My Node',
                description: 'Description here',
                metrics: { 'Key': 'Value' }
            }, 
            classes: 'process' 
        },
        { 
            group: 'edges', 
            data: { source: 'n1', target: 'n2' }
        }
    ];
}
```

Register in `js/layouts.js`:
```javascript
const datasets = {
    myData: getMyData(),
    // ... others
};
```

Add button in `index.html`:
```html
<button onclick="loadDataset('myData')">My Data</button>
```

## 📁 File Structure

```
cytoscape/
├── index.html          # Main file - start here
├── css/styles.css      # All styles
├── js/
│   ├── app.js         # Initializes app
│   ├── core.js        # Cytoscape config
│   ├── datasets.js    # Sample data ← Add datasets here
│   ├── layouts.js     # Layouts
│   ├── ui.js          # UI functions
│   └── json-editor.js # JSON features
└── README.md          # Full documentation
```

## 🔧 Common Tasks

### Change Colors
Edit `js/core.js` - find the styles section:
```javascript
{
    selector: '.process',
    style: {
        'background-color': '#667eea',  // Change this
        'border-color': '#5568d3'       // And this
    }
}
```

### Add Node Type
1. Add style in `js/core.js`
2. Add icon in `createNodeHTML()` function
3. Use in your data: `nodeType: 'yourtype'`

### Change Default Layout
Edit `js/layouts.js` - `loadDataset()` function:
```javascript
applyLayout('dagre');  // Change to: breadthfirst, cola, grid, circle
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Blank page | Check browser console (F12) for errors |
| Styles missing | Verify `css/styles.css` exists |
| JS errors | Check all files in `js/` folder exist |
| Can't export | Check browser allows downloads |
| Groups not showing | Ensure parent nodes have `label` property |

## 📚 Learn More

- **Full Documentation**: [README.md](README.md)
- **Deployment Guide**: [DEPLOY.md](DEPLOY.md)
- **GitHub Setup**: [GITHUB_SETUP.md](GITHUB_SETUP.md)
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **Cytoscape.js Docs**: https://js.cytoscape.org/

## 🎯 Next Steps

1. ✅ Run locally and explore
2. ✅ Try all datasets and layouts
3. ✅ Export and edit JSON
4. ✅ Add your own data
5. ✅ Deploy to GitHub Pages
6. ✅ Share with others!

## 💡 Tips

- Use **Hierarchical layout** for workflows
- Use **Groups** to organize complex diagrams
- **Export JSON** to save your work
- **Import JSON** to share with others
- Check **browser console** (F12) for debugging

## 🆘 Need Help?

- Check the [README.md](README.md) for detailed docs
- Open an issue on GitHub
- Check [Cytoscape.js documentation](https://js.cytoscape.org/)

---

**Ready to visualize? Let's go! 🚀**

