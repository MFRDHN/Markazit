const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /dark-800/g, replacement: 'white' },
  { regex: /dark-700/g, replacement: 'cream-200' },
  { regex: /dark-600/g, replacement: 'cream-300' },
  { regex: /bg-white\/50/g, replacement: 'bg-cream-50' },
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
    
    replacements.forEach(r => {
        content = content.replace(r.regex, r.replacement);
    });
    
    if (content !== original) {
        fs.writeFileSync(file, content);
    }
});
