import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    console.log('Obsidian Code Sync extension is now active!');

    // Helper function to get configuration
    const getConfig = () => {
        return vscode.workspace.getConfiguration('obsidianSync');
    };

    // Helper function to ensure directory exists
    const ensureDirectoryExists = (dirPath: string) => {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    };

    // Helper function to get language identifier for code blocks
    const getLanguageIdentifier = (document: vscode.TextDocument): string => {
        const ext = path.extname(document.fileName).slice(1).toLowerCase();
        
        // Map common file extensions to proper language identifiers
        const languageMap: { [key: string]: string } = {
            'js': 'javascript',
            'ts': 'typescript',
            'py': 'python',
            'cpp': 'cpp',
            'c': 'c',
            'cs': 'csharp',
            'java': 'java',
            'rb': 'ruby',
            'go': 'go',
            'rs': 'rust',
            'php': 'php',
            'swift': 'swift',
            'kt': 'kotlin',
            'scala': 'scala',
            'r': 'r',
            'jsx': 'javascript',
            'tsx': 'typescript',
            'vue': 'vue',
            'html': 'html',
            'css': 'css',
            'scss': 'scss',
            'sass': 'sass',
            'less': 'less',
            'json': 'json',
            'xml': 'xml',
            'yaml': 'yaml',
            'yml': 'yaml',
            'md': 'markdown',
            'sql': 'sql',
            'sh': 'bash',
            'bash': 'bash',
            'zsh': 'bash',
            'fish': 'bash',
            'ps1': 'powershell',
            'dockerfile': 'dockerfile',
            'makefile': 'makefile'
        };

        return languageMap[ext] || document.languageId || ext || 'text';
    };

    // Helper function to create markdown content
    const createMarkdownContent = (document: vscode.TextDocument): string => {
        const config = getConfig();
        const addTimestamp = config.get<boolean>('addTimestamp', false);
        
        const filename = path.basename(document.fileName);
        const filepath = document.fileName;
        const codeContent = document.getText();
        const language = getLanguageIdentifier(document);
        
        let markdownContent = `# ${filename}\n\n`;
        
        if (addTimestamp) {
            const now = new Date();
            markdownContent += `> Last synced: ${now.toLocaleString()}\n\n`;
        }
        
        markdownContent += `**File:** \`${filepath}\`\n\n`;
        markdownContent += `\`\`\`${language}\n${codeContent}\n\`\`\``;
        
        return markdownContent;
    };

    // Command to save current file to Obsidian
    const saveToObsidian = vscode.commands.registerCommand('obsidian-code-sync.saveToObsidian', async () => {
        console.log('Save to Obsidian command triggered');
        
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            vscode.window.showErrorMessage('No active editor! Please open a file first.');
            return;
        }

        const config = getConfig();
        let obsidianPath = config.get<string>('obsidianPath', '');
        
        // If path isn't set, prompt user to select it
        if (!obsidianPath || !fs.existsSync(obsidianPath)) {
            const selectedPath = await vscode.window.showOpenDialog({
                canSelectFolders: true,
                canSelectFiles: false,
                openLabel: 'Select Obsidian Vault',
                title: 'Select your Obsidian vault directory'
            });

            if (selectedPath && selectedPath[0]) {
                obsidianPath = selectedPath[0].fsPath;
                await config.update('obsidianPath', obsidianPath, vscode.ConfigurationTarget.Global);
                vscode.window.showInformationMessage(`Obsidian vault path set to: ${obsidianPath}`);
            } else {
                vscode.window.showErrorMessage('No Obsidian vault path selected. Operation cancelled.');
                return;
            }
        }

        try {
            const document = activeEditor.document;
            const filename = path.basename(document.fileName, path.extname(document.fileName));
            const subfolder = config.get<string>('subfolder', 'Code');
            
            // Create full path with subfolder
            const targetDir = subfolder ? path.join(obsidianPath, subfolder) : obsidianPath;
            ensureDirectoryExists(targetDir);
            
            // Create Markdown content
            const markdownContent = createMarkdownContent(document);
            
            // Create Obsidian file path
            const markdownPath = path.join(targetDir, `${filename}.md`);
            
            // Write to file
            await fs.promises.writeFile(markdownPath, markdownContent, 'utf8');
            
            console.log('Successfully saved to:', markdownPath);
            vscode.window.showInformationMessage(
                `✅ Saved to Obsidian: ${subfolder ? subfolder + '/' : ''}${filename}.md`
            );
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('Error saving to Obsidian:', error);
            vscode.window.showErrorMessage(`Error saving to Obsidian: ${errorMessage}`);
        }
    });

    // Command to set Obsidian path
    const setPathCommand = vscode.commands.registerCommand('obsidian-code-sync.setObsidianPath', async () => {
        console.log('Set Obsidian Path command triggered');
        
        const selectedPath = await vscode.window.showOpenDialog({
            canSelectFolders: true,
            canSelectFiles: false,
            openLabel: 'Select Vault',
            title: 'Select your Obsidian vault directory'
        });

        if (selectedPath && selectedPath[0]) {
            const config = getConfig();
            const vaultPath = selectedPath[0].fsPath;
            
            // Verify it's a valid directory
            if (!fs.existsSync(vaultPath)) {
                vscode.window.showErrorMessage('Selected path does not exist!');
                return;
            }
            
            await config.update('obsidianPath', vaultPath, vscode.ConfigurationTarget.Global);
            console.log('Obsidian path saved:', vaultPath);
            vscode.window.showInformationMessage(`Obsidian vault path set to: ${vaultPath}`);
        } else {
            vscode.window.showWarningMessage('No path selected');
        }
    });

    // Auto-sync on save (if enabled)
    const autoSync = vscode.workspace.onDidSaveTextDocument(async (document) => {
        const config = getConfig();
        const obsidianPath = config.get<string>('obsidianPath', '');
        const autoSyncEnabled = config.get<boolean>('autoSync', false);
        const subfolder = config.get<string>('subfolder', 'Code');

        if (!autoSyncEnabled || !obsidianPath || !fs.existsSync(obsidianPath)) {
            return;
        }

        // Skip if it's not a code file (e.g., avoid syncing .git files, config files, etc.)
        const excludedExtensions = ['.git', '.gitignore', '.env', '.lock'];
        const isExcluded = excludedExtensions.some(ext => document.fileName.includes(ext));
        if (isExcluded) {
            return;
        }

        try {
            console.log('Auto-sync triggered for:', document.fileName);
            
            const filename = path.basename(document.fileName, path.extname(document.fileName));
            const targetDir = subfolder ? path.join(obsidianPath, subfolder) : obsidianPath;
            ensureDirectoryExists(targetDir);
            
            const markdownContent = createMarkdownContent(document);
            const markdownPath = path.join(targetDir, `${filename}.md`);
            
            await fs.promises.writeFile(markdownPath, markdownContent, 'utf8');
            console.log('Auto-sync successful for:', document.fileName);
            
            // Show subtle notification
            vscode.window.setStatusBarMessage(
                `📝 Auto-synced to Obsidian: ${filename}.md`,
                3000
            );
            
        } catch (error) {
            console.error('Auto-sync error:', error);
            // Don't show error messages for auto-sync to avoid being annoying
        }
    });

    // Register all commands and disposables
    context.subscriptions.push(saveToObsidian);
    context.subscriptions.push(setPathCommand);
    context.subscriptions.push(autoSync);

    // Show activation message
    const config = getConfig();
    const obsidianPath = config.get<string>('obsidianPath', '');
    
    if (obsidianPath && fs.existsSync(obsidianPath)) {
        vscode.window.showInformationMessage(
            `Obsidian Code Sync is ready! Vault: ${path.basename(obsidianPath)}`
        );
    } else {
        vscode.window.showInformationMessage(
            'Obsidian Code Sync is ready! Use "Set Obsidian Vault Path" to get started.'
        );
    }
}

export function deactivate() {
    console.log('Obsidian Code Sync extension deactivated');
}