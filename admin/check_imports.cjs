const fs = require('fs');
const path = require('path');

function checkFileImports(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            checkFileImports(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const lines = content.split('\n');
            lines.forEach((line, index) => {
                const match = line.match(/import\s+.*?from\s+['"]([^'"]+)['"]/);
                if (match) {
                    let importPath = match[1];
                    if (importPath.startsWith('.')) {
                        let resolved = path.resolve(path.dirname(fullPath), importPath);
                        if (!fs.existsSync(resolved) && !fs.existsSync(resolved + '.ts') && !fs.existsSync(resolved + '.tsx') && !fs.existsSync(resolved + '.css') && !fs.existsSync(resolved + '/index.ts') && !fs.existsSync(resolved + '/index.tsx')) {
                            console.log(`Missing import in ${fullPath}:${index + 1}: ${importPath}`);
                        }
                    }
                }
            });
        }
    }
}

checkFileImports('/Users/princesingh/Developer/bky/admin/src');
