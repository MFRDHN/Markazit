const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /\bbg-dark-950\b/g, replacement: 'bg-cream-50' },
  { regex: /\bbg-dark-900\b/g, replacement: 'bg-cream-100' },
  { regex: /\bbg-dark-800\b/g, replacement: 'bg-white' },
  { regex: /\bbg-dark-700\b/g, replacement: 'bg-cream-200' },
  { regex: /\bborder-dark-700\b/g, replacement: 'border-cream-200' },
  { regex: /\bborder-dark-600\b/g, replacement: 'border-cream-300' },
  { regex: /\bborder-white\/5\b/g, replacement: 'border-primary-900/10' },
  { regex: /\bborder-white\/10\b/g, replacement: 'border-primary-900/10' },
  { regex: /\btext-white\b/g, replacement: 'text-primary-950' },
  { regex: /\btext-dark-200\b/g, replacement: 'text-primary-800' },
  { regex: /\btext-dark-300\b/g, replacement: 'text-primary-700' },
  { regex: /\btext-dark-400\b/g, replacement: 'text-primary-600' },
  { regex: /\btext-dark-500\b/g, replacement: 'text-primary-500' },
  { regex: /\bbg-white\/5\b/g, replacement: 'bg-primary-900/5' },
  { regex: /\bbg-white\/10\b/g, replacement: 'bg-primary-900/10' },
  { regex: /\bfrom-dark-950\b/g, replacement: 'from-cream-50' },
  { regex: /\bvia-dark-950\b/g, replacement: 'via-cream-50' },
  { regex: /\bto-dark-950\b/g, replacement: 'to-cream-50' },
  { regex: /\bglow\b/g, replacement: 'glow-light' }
];

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.jsx')) results.push(file);
        }
    });
    return results;
}

const files = walk('c:/Proyek/Markaz_it/frontend/src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Skip some files if necessary, or apply replacements
    replacements.forEach(r => {
        content = content.replace(r.regex, r.replacement);
    });
    
    if (content !== original) {
        fs.writeFileSync(file, content);
    }
});

console.log("Theme classes updated in JSX files.");
