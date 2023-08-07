import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

// export function determineProjectType (folders: readonly vscode.WorkspaceFolder[]) {
//     // loop through all folders
//     folders.forEach(folder => {
//         const folderPath = folder.uri.fsPath;
//         console.log(folderPath);
//     });
// }

let classFiles: string[] = [];

function findClassFolders(folders: readonly vscode.WorkspaceFolder[]) {
    folders.forEach(folder => {
        let dir = folder.uri;
        processProjectDirectory(dir);
    }
    );
}

function processProjectDirectory(dir: vscode.Uri) {
    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error('An error occurred', err);
            return;
        }
        
        files.forEach(file => {
            const fullPath = path.join(dir, file.name);

            if (file.isDirectory()) {
                processProjectDirectory(fullPath);
            } else if (file.isFile()) {
                processFile(fullPath);
            }
        });
    });
}

function processFile (filePath: string) {
    
}

export function writeDebuggingLines(folders: readonly vscode.WorkspaceFolder[]) {
    // find folders with class files
    const classFolders = findClassFolders(folders);
    // loop through class file
}