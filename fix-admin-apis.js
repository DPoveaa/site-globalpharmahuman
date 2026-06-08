const fs = require('fs');
const path = require('path');

const directories = [
  'categories', 'dashboard', 'header-nav', 'orders', 
  'products', 'promotions', 'settings', 'shipping', 'upload'
];

const basePath = path.join(__dirname, 'src', 'app', 'api', 'admin');

directories.forEach(dir => {
  const dirPath = path.join(basePath, dir);
  if (!fs.existsSync(dirPath)) return;
  
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  
  // Recursively process files
  function processFiles(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    for (let entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        processFiles(fullPath);
      } else if (entry.name.endsWith('.ts')) {
        let content = fs.readFileSync(fullPath, 'utf8');
        content = content.replace(/session\.user\.role !== "ADMIN"/g, '(session.user.role !== "ADMIN" && session.user.role !== "EMPLOYEE")');
        fs.writeFileSync(fullPath, content);
      }
    }
  }
  
  processFiles(dirPath);
});
console.log('API endpoints updated.');
