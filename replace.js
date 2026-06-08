const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function walk(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
          }
          if (!--pending) done(null, results);
        }
      });
    });
  });
}

walk(directoryPath, function(err, results) {
  if (err) throw err;
  
  results.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    let hasChanges = false;
    
    if (content.includes('alert(')) {
      content = content.replace(/alert\((.*sucesso.*)\)/gi, 'toast.success($1)');
      content = content.replace(/alert\((.*?)\)/g, 'toast.error($1)');
      hasChanges = true;
    }
    
    if (content.includes('confirm(')) {
      content = content.replace(/window\.confirm\((.*?)\)/g, 'await confirmAction($1)');
      content = content.replace(/confirm\((.*?)\)/g, 'await confirmAction($1)');
      hasChanges = true;
    }
    
    if (hasChanges) {
      // Add imports
      const lines = content.split('\n');
      const importLines = [];
      if (original.includes('alert(') && !content.includes('import toast')) {
        importLines.push('import toast from "react-hot-toast";');
      }
      if (original.includes('confirm(') && !content.includes('import { confirmAction }')) {
        importLines.push('import { confirmAction } from "@/lib/toast";');
      }
      
      // Find the first line that is not an import or 'use client'
      let insertIndex = 0;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('import') || lines[i].includes('"use client"')) {
          insertIndex = i + 1;
        } else if (lines[i].trim() !== '') {
          break;
        }
      }
      
      lines.splice(insertIndex, 0, ...importLines);
      
      fs.writeFileSync(file, lines.join('\n'));
      console.log('Updated:', file);
    }
  });
});
