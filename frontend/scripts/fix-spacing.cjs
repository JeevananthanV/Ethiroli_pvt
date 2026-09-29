const fs = require("fs");
const path = require("path");

const frontendDir = "J:\\eithiroli\\ethiroli_react\\frontend";
const rolesDir = path.join(frontendDir, "src", "roles");
const roleFolders = ["student", "tutor", "admin", "super-admin", "employee", "finance", "hr", "sales", "intern", "project-manager", "public"];

let count = 0;

roleFolders.forEach(folder => {
  const folderPath = path.join(rolesDir, folder);
  if (!fs.existsSync(folderPath)) return;
  
  const files = fs.readdirSync(folderPath, { recursive: true });
  const jsxFiles = files.filter(f => f.endsWith(".jsx") || f.endsWith(".js"));
  
  jsxFiles.forEach(file => {
    const filePath = path.join(folderPath, file);
    let content = fs.readFileSync(filePath, "utf8");
    
    let changes = 0;
    
    // Replace p-4 with p-3 (card padding)
    const p4Count = (content.match(/p-4/g) || []).length;
    if (p4Count > 0) {
      content = content.replace(/p-4/g, "p-3");
      changes += p4Count;
    }
    
    // Replace mb-4 with mb-2 (margin-bottom on cards)
    const mb4Count = (content.match(/mb-4/g) || []).length;
    if (mb4Count > 0) {
      content = content.replace(/mb-4/g, "mb-2");
      changes += mb4Count;
    }
    
    // Replace gap-6 with gap-4 (section gaps)
    const gap6Count = (content.match(/gap-6/g) || []).length;
    if (gap6Count > 0) {
      content = content.replace(/gap-6/g, "gap-4");
      changes += gap6Count;
    }
    
    // Replace mr-4 with mr-2 (margin-right on labels/items)
    const mr4Count = (content.match(/mr-4/g) || []).length;
    if (mr4Count > 0) {
      content = content.replace(/mr-4/g, "mr-2");
      changes += mr4Count;
    }
    
    if (changes > 0) {
      fs.writeFileSync(filePath, content);
      count++;
      console.log(`Fixed: ${folder}/${file} (changes: ${changes})`);
    }
  });
});

console.log(`\nTotal files fixed: ${count}`);