import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

let classFiles: string[] = [];

export function findJavaFiles(folders: readonly vscode.WorkspaceFolder[]) {
    folders.forEach(folder => {
        processProjectDirectory(folder.uri);
    });
    return classFiles;
}

export function processProjectDirectory(dir: vscode.Uri) {

    fs.readdir(dir.fsPath, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error('An error occurred', err);
            return;
        }
        files.forEach(file => {
            const fullPath = path.join(dir.fsPath, file.name);
            if (file.isDirectory()) {
                if (file.name !== 'lib' && file.name !== 'target') {
                    processProjectDirectory(vscode.Uri.file(fullPath));
                }
            } else if (file.isFile() && fullPath.endsWith('.java')) {
                readFile(file.path).then(javaFileContent => {
                    let modifiedContent = addDebuggerLines(javaFileContent);
                    writeFile(file.path, modifiedContent);
                }).catch(err => {
                    console.error('An error has occurred reading the file', err);
                });
            }
        });
    });
    return classFiles;
}

function addDebuggerLines(content: string) {
    if (content.includes('interface') || content.includes('abstract class')) {
        return content;
    }

    const lines = content.split('\n');
    let insideMethod = false;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(/\b(public|private|protected)\b/) && lines[i].includes('(')) {
            insideMethod = true;
        }

        if (insideMethod) {
            while (!lines[i].includes('{') && i < lines.length) {
                i++;
            }
            if (i < lines.length) {
                lines.splice(i + 1, 0, 'DebugLogger.log();');
            }
            insideMethod = false;
        }
    }

    return lines.join('\n');
}


function readFile(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
}

function writeFile(filePath: string, content: string): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, content, 'utf8', err => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}