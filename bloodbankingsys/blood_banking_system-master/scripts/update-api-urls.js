/**
 * Update API URLs Script for Blood Banking System
 * 
 * This file will be executed with npm run update-api-urls
 * It will search for all occurrences of hardcoded API URLs in the codebase
 * and replace them with the centralized API configuration.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const sourceDir = path.join(__dirname, 'src');
const oldApiUrlPattern = /["'`]http:\/\/localhost:808[12]\/api(.*?)["'`]/g;
const importStatement = "import { getApiUrl } from \"../utils/apiConfig\";";
const alreadyProcessed = new Set();

// Function to check if a file already imports the API config
function hasApiConfigImport(content) {
  return content.includes('from "../utils/apiConfig"');
}

// Function to add import statement if needed
function addImportIfNeeded(content, filePath) {
  if (hasApiConfigImport(content)) {
    return content;
  }
  
  // Find a good place to add the import
  if (content.includes('import React')) {
    // Add after the last import statement
    const importLines = content.match(/import .* from ".*";/g) || [];
    if (importLines.length > 0) {
      const lastImport = importLines[importLines.length - 1];
      return content.replace(lastImport, lastImport + "\n" + importStatement);
    }
  }
  
  // If no good place found, add at the top
  return importStatement + "\n\n" + content;
}

// Function to replace API URLs in the content
function replaceApiUrls(content) {
  // Replace URLs in fetch statements
  content = content.replace(/fetch\(["'`]http:\/\/localhost:808[12]\/api\/(.*?)["'`]/g, 'fetch(getApiUrl("$1")');
  
  // Replace URLs in template literals
  content = content.replace(/[`]http:\/\/localhost:808[12]\/api\/(.*?)[`]/g, 'getApiUrl(`$1`)');
  
  // Replace URLs in string concatenation
  content = content.replace(/"http:\/\/localhost:808[12]\/api\/" \+ /g, 'getApiUrl("');
  
  return content;
}

// Function to process a file
function processFile(filePath) {
  if (alreadyProcessed.has(filePath)) {
    return;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file contains API URLs
    if (oldApiUrlPattern.test(content)) {
      console.log(`Processing: ${filePath}`);
      
      // Add import if needed and replace URLs
      let updatedContent = addImportIfNeeded(content, filePath);
      updatedContent = replaceApiUrls(updatedContent);
      
      // Write back to the file
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      alreadyProcessed.add(filePath);
      console.log(`Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Function to recursively process directories
function processDirectory(directory) {
  const items = fs.readdirSync(directory);
  
  for (const item of items) {
    const itemPath = path.join(directory, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      processDirectory(itemPath);
    } else if (stats.isFile() && (itemPath.endsWith('.js') || itemPath.endsWith('.jsx'))) {
      processFile(itemPath);
    }
  }
}

// Main execution
console.log('Updating API URLs in all components...');
processDirectory(sourceDir);
console.log('Finished updating API URLs.');