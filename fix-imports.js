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
    
    if (content.includes('import toast from "react-hot-toast";') || content.includes('import { confirmAction } from "@/lib/toast";')) {
      const lines = content.split('\n');
      const cleanLines = lines.filter(line => 
        line.trim() !== 'import toast from "react-hot-toast";' && 
        line.trim() !== 'import { confirmAction } from "@/lib/toast";'
      );
      
      const newLines = [];
      let inserted = false;
      
      for (let i = 0; i < cleanLines.length; i++) {
        newLines.push(cleanLines[i]);
        if (!inserted && (cleanLines[i].includes('"use client"') || cleanLines[i].includes("'use client'"))) {
          if (content.includes('toast.')) {
            newLines.push('import toast from "react-hot-toast";');
          }
          if (content.includes('confirmAction')) {
            newLines.push('import { confirmAction } from "@/lib/toast";');
          }
          inserted = true;
        }
      }
      
      if (!inserted) {
        if (content.includes('confirmAction')) {
          newLines.unshift('import { confirmAction } from "@/lib/toast";');
        }
        if (content.includes('toast.')) {
          newLines.unshift('import toast from "react-hot-toast";');
        }
      }
      
      fs.writeFileSync(file, newLines.join('\n'));
      console.log('Fixed imports:', file);
    }
  });
});
