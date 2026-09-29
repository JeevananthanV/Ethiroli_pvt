const fs = require('fs');
const p = 'J:/eithiroli/ethiroli_react/scripts/generate-eth-web-30-json.js';
let content = fs.readFileSync(p, 'utf8');
content = content.replace(
  /function parseTask\(startIdx\) \{[\s\S]*?return \{ description, requirements: uniqueReqs \};/,
  `function parseTask(startIdx) {
  const requirements = [];
  let description = '';
  let i = startIdx + 1;
  const maxLines = 2000; // Safety guard
  while (i < lines.length && (i - startIdx) < maxLines) {
    const line = lines[i].trim();
    if (line === '---' || line.startsWith('###')) break;
    if (line) {
      // Check for deliverable line
      const dm = line.match(/^\*\*Deliverable:\*\*\s*(.+)/);
      if (dm) { description = dm[1]; i++; continue; }
      
      // Check for bonus line
      const bm = line.match(/^\*\*Bonus:\*\*\s*(.+)/);
      if (bm) { requirements.push('Bonus: ' + bm[1]); i++; continue; }
      
      // Check for numbered items
      const nm = line.match(/^(\d+)\.\s+(.+)/);
      if (nm) { requirements.push(nm[2].trim()); i++; continue; }
      
      // Check for file sections
      if (line.startsWith('**File ') && line.includes(':**')) {
        const parts = line.split(':**');
        if (parts.length === 2) {
          const prefix = parts[0].substring(3); // Remove '**'
          const content = parts[1].trim();
          requirements.push(\`\${prefix}: \${content}\`);
          i++;
          continue;
        }
      }
      
      // Check for bullet points
      if (line.startsWith('- ') || line.startsWith('* ')) {
        requirements.push(line.substring(2).trim());
        i++;
        continue;
      }
      
      // If none of the above but line has content, treat as a requirement
      if (line.length > 10) { // Avoid very short lines
        requirements.push(line);
        i++;
        continue;
      }
    }
    i++;
  }
  
  // If we found requirements but no description, use first requirement as description
  if (!description && requirements.length > 0) {
    description = requirements.shift();
  }
  
  // If still no description, use a default
  if (!description) {
    description = 'Complete the practical task';
  }
  
  // Deduplicate requirements
  const seen = new Set();
  const uniqueReqs = requirements.filter(req => {
    if (seen.has(req)) return false;
    seen.add(req);
    return true;
  });
  
  return { description, requirements: uniqueReqs };
}`
);
fs.writeFileSync(p, content);
console.log('parseTask fixed');
