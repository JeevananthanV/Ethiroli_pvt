const fs = require("fs");
let content = fs.readFileSync("J:\\eithiroli\\ethiroli_react\\frontend\\src\\roles\\hr\\pages\\Attendance.jsx", "utf8");
// Find lines with 'half_day' or 'Half Day' or '4.5h' or '2h'
const lines = content.split('\n');
lines.forEach((line, i) => {
  if (line.includes('half_day') || line.includes('Half Day') || line.includes('4.5h') || line.includes('2h')) {
    console.log((i+1) + ':', line.trim());
  });
});