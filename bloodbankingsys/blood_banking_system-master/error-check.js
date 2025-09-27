// Simple script to check for common errors in JavaScript files
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');

// Patterns to check for
const errorPatterns = [
  { pattern: /localhost:8080/g, message: 'Incorrect backend URL port, should be 8081' },
  { pattern: /\/api\/donations(?!\/|$)/g, message: 'Incorrect API endpoint, should be /api/blood-donations' },
  { pattern: /undefined\s+is\s+not\s+an\s+object/g, message: 'Potential undefined object access' },
  { pattern: /Cannot\s+read\s+properties\s+of\s+null/g, message: 'Potential null object access' },
  { pattern: /import\s+.*\s+from\s+['"]chart\.js['"]/g, message: 'Chart.js import issue' },
  { pattern: /window\.location\.href\s*=/g, message: 'Manual navigation, consider using React Router' }
];

// Function to recursively search files
function searchFiles(dir, extension) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      searchFiles(filePath, extension);
    } else if (path.extname(file) === extension) {
      const content = fs.readFileSync(filePath, 'utf8');
      let hasErrors = false;
      
      errorPatterns.forEach(({ pattern, message }) => {
        const matches = content.match(pattern);
        
        if (matches) {
          if (!hasErrors) {
            console.log(`\nFile: ${filePath}`);
            hasErrors = true;
          }
          console.log(`- ${message}: ${matches.length} occurrences`);
        }
      });
    }
  });
}

console.log('Checking for common errors in JavaScript files...');
searchFiles(srcDir, '.jsx');
console.log('\nCheck complete!');