const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');
let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  // Replace text-brand-* with text-slate-* for everything EXCEPT text-brand-600
  // because text-brand-600 is often used for blue accents.
  content = content.replace(/text-brand-(900|800|700|500|400|300|200|100|50)\b/g, 'text-slate-$1');
  
  // Also replace some bg-brand-* if they are meant to be neutral backgrounds 
  // Wait, no, bg-brand is usually good as blue (e.g. blue badges, blue headers).
  // But wait, the user said "até os graficos no menu admin estão azuis".
  // Charts might be using `brand` colors passed via props or JS config, let's check charts separately.

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
  }
});

console.log(`Refactored ${changedFiles} files.`);
