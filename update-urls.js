// Script to update all old URLs to new folder structure
const fs = require('fs');
const path = require('path');

const replacements = [
    // Auth pages
    { old: 'href="/login"', new: 'href="/auth/login"' },
    { old: 'href="/register"', new: 'href="/auth/register"' },
    { old: 'href="/forgot-password"', new: 'href="/auth/forgot-password"' },
    { old: 'router.push("/login")', new: 'router.push("/auth/login")' },
    { old: 'Astro.redirect("/login")', new: 'Astro.redirect("/auth/login")' },

    // Shop pages
    { old: 'href="/checkout"', new: 'href="/shop/checkout"' },
    { old: 'href="/cart"', new: 'href="/shop/cart"' },
    { old: 'href="/products/', new: 'href="/shop/products/' },
    { old: 'router.push("/products/', new: 'router.push("/shop/products/' },

    // User pages
    { old: 'href="/profile"', new: 'href="/user/profile"' },
];

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    replacements.forEach(({ old, new: newStr }) => {
        if (content.includes(old)) {
            content = content.replaceAll(old, newStr);
            modified = true;
        }
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Skip node_modules and .git
            if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
                walkDir(filePath);
            }
        } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.astro')) {
            replaceInFile(filePath);
        }
    });
}

// Start from src directory
const srcDir = path.join(__dirname, 'src');
console.log('Starting URL updates...');
walkDir(srcDir);
console.log('Done!');
