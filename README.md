# Obsidian Code Sync

Convert your code files into beautifully formatted Markdown documents with syntax highlighting. While primarily designed for Obsidian vaults, this extension works as a general-purpose code-to-markdown converter for any markdown-based documentation system, knowledge base, or note-taking app.

## Features

![VS Code](https://raw.githubusercontent.com/FinnLeh/vscode-obsidian-sync/main/images/vsCode_screenshot.png)

![Obsidian Markdown](https://raw.githubusercontent.com/FinnLeh/vscode-obsidian-sync/main/images/Obsidian_screenshot.png)

### 📝 One-Click Save to Markdown
![Save to Obsidian](https://raw.githubusercontent.com/FinnLeh/vscode-obsidian-sync/main/images/feature_save.png)

Save any code file as a formatted Markdown document with a single keyboard shortcut (`Ctrl+Alt+O` / `Cmd+Alt+O`) or click the save button in the editor toolbar.

### 🔄 Auto-Sync on Save
Enable automatic syncing to keep your markdown documentation always up-to-date. Every time you save a file in VS Code, it's automatically converted to markdown.

### 📁 Organized Structure
Your code files are automatically organized in a configurable subfolder (default: "Code"), keeping everything tidy and structured.

### ✨ Key Features:
- **Universal Markdown Output**: Works with Obsidian, Notion, GitHub wikis, Jekyll blogs, or any markdown-based system
- **Syntax Highlighting Preserved**: Code blocks maintain proper language-specific syntax highlighting
- **Keyboard Shortcut**: `Ctrl+Alt+O` (Windows/Linux) or `Cmd+Alt+O` (Mac) for quick saving
- **Editor Toolbar Button**: Quick access button in the editor title bar
- **Timestamps**: Optional timestamps to track when code was last synced
- **Smart Language Detection**: Automatically detects programming language for proper syntax highlighting (30+ languages)
- **Custom Subfolder**: Configure where files are saved
- **File Path Preservation**: Original file paths are documented in the markdown
- **LaTeX Compatible**: Generated markdown works perfectly with LaTeX processors and academic note-taking tools

## Use Cases

### 🎯 Primary Use: Obsidian Vaults
Originally built for Obsidian users to build a searchable code knowledge base with all of Obsidian's powerful features like backlinks, graph view, and tags.

### 📚 General Markdown Documentation
- **Technical Documentation**: Convert code samples to markdown for documentation sites
- **Academic Notes**: Include code snippets in LaTeX documents or research notes
- **Blog Posts**: Prepare code examples for Jekyll, Hugo, or other static site generators
- **GitHub Wikis**: Create formatted code documentation for repositories
- **Learning Journals**: Track your coding journey in any markdown-based note app
- **Team Knowledge Bases**: Share code snippets in Confluence, Notion, or other collaboration tools

## Requirements

- VS Code version 1.75.0 or higher
- A target directory for saving markdown files (Obsidian vault or any folder)
- Write access to the target directory

## Extension Settings

This extension contributes the following settings:

* `obsidianSync.obsidianPath`: Path to your target directory (automatically set on first use)
* `obsidianSync.autoSync`: Enable/disable automatic syncing when files are saved (default: `false`)
* `obsidianSync.subfolder`: Subfolder name within target directory to save code files (default: `"Code"`)
* `obsidianSync.addTimestamp`: Add timestamp to the markdown file showing last sync time (default: `false`)

### How to Configure:
1. Open VS Code Settings (`Ctrl+,` or `Cmd+,`)
2. Search for "Obsidian"
3. Configure your preferences

Note: Despite the "Obsidian" naming in settings, this works for any markdown destination.

## Usage

### First Time Setup:
1. Open any code file in VS Code
2. Press `Ctrl+Alt+O` (or `Cmd+Alt+O` on Mac)
3. Select your target folder (Obsidian vault or any directory)
4. Your file is now saved as markdown!

### Commands:
- **Obsidian: Save Current File to Obsidian** - Save the active file as markdown
- **Obsidian: Set Vault Path** - Change or set your target directory location

### Example Output:
A Python file `calculator.py` becomes `calculator.md`:

```markdown
# calculator.py

> Last synced: 1/15/2025, 10:30:00 AM

**File:** `/home/user/projects/calculator.py`

```python
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b
```
```

This markdown format is compatible with:
- Obsidian
- GitHub/GitLab markdown
- Pandoc (for conversion to LaTeX, PDF, HTML)
- MkDocs and other documentation generators
- Jupyter notebooks
- Most markdown editors and viewers

## Known Issues

- Only works with local directories (not cloud-only or encrypted vaults)
- Large files (>10MB) may take a moment to convert
- Some special characters in filenames may need escaping

## Release Notes

### 0.1.0
Initial release with core features:
- Code to markdown conversion
- Auto-sync capability
- Configurable settings
- Keyboard shortcuts and toolbar button
- Timestamp support
- Smart language detection for 30+ programming languages
- Universal markdown output compatible with various platforms

---

## Contributing

Found a bug or have a feature request? Please open an issue on [GitHub](https://github.com/FinnLeh/vscode-obsidian-sync/issues).

Pull requests are welcome! Ideas for contributions:
- Additional output formats
- Custom markdown templates
- Integration with more note-taking systems
- Batch conversion features

## License

MIT License - see [LICENSE](LICENSE) file for details

## Credits

Created by Finn Lehmann

**Enjoy converting your code to markdown!** 🚀

---

*While this extension was originally created for Obsidian users, it serves as a versatile tool for anyone needing to convert code files to well-formatted markdown documents.*