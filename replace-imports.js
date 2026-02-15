import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const replacements = [
    {
        pattern: /import\s+Link\s+from\s+["']next\/link["']/g,
        replacement: 'import Link from "@/components/common/Link"'
    },
    {
        pattern: /import\s+Image\s+from\s+["']next\/image["']/g,
        replacement: 'import Image from "@/components/common/Image"'
    },
    {
        pattern: /import\s+\{([^}]*)\}\s+from\s+["']next\/navigation["']/g,
        replacement: 'import {$1} from "@/lib/navigation"'
    },
    {
        pattern: /import\s+\{[^}]*cookies[^}]*\}\s+from\s+["']next\/headers["'];?\s*\n/g,
        replacement: ''
    },
    {
        pattern: /import\s+\{[^}]*notFound[^}]*\}\s+from\s+["']next\/navigation["'];?\s*\n/g,
        replacement: ''
    },
    {
        pattern: /import\s+.*Metadata.*from\s+["']next["'];?\s*\n/g,
        replacement: ''
    },
    {
        pattern: /import\s+\{[^}]*MetadataRoute[^}]*\}\s+from\s+["']next["'];?\s*\n/g,
        replacement: ''
    },
    // Process.env replacements
    {
        pattern: /process\.env\.NEXT_PUBLIC_([A-Z_]+)/g,
        replacement: 'import.meta.env.PUBLIC_$1'
    },
    // Next config removal
    {
        pattern: /next:\s*\{\s*revalidate:\s*[^}]+\s*\},?/g,
        replacement: ''
    }
];

function processFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        replacements.forEach(({ pattern, replacement }) => {
            if (pattern.test(content)) {
                content = content.replace(pattern, replacement);
                modified = true;
            }
        });

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✓ Updated: ${filePath}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`✗ Error processing ${filePath}:`, error.message);
        return false;
    }
}

function walkDir(dir, callback) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (!filePath.includes('node_modules') && !filePath.includes('.next') && !filePath.includes('dist')) {
                walkDir(filePath, callback);
            }
        } else if (stat.isFile() && /\.(tsx?|jsx?)$/.test(file)) {
            callback(filePath);
        }
    });
}

console.log('Starting import replacement...\n');

let count = 0;
walkDir(path.join(__dirname, 'src'), (filePath) => {
    if (processFile(filePath)) {
        count++;
    }
});

console.log(`\n✓ Replacement complete! Updated ${count} files.`);
