const fs = require('fs');
let content = fs.readFileSync('J:/eithiroli/ethiroli_react/scripts/generate-eth-web-30-json.js', 'utf8');

// Replace corrupted em dash with \u2014
content = content.replace(String.fromCodePoint(0x00E2, 0x20AC, 0x201D), '\\u2014');

// Replace corrupted task emoji with \uD83D\uDEEA
content = content.replace(String.fromCodePoint(0x00F0, 0x0178, 0x00A7, 0x00AA), '\\uD83D\\uDEEA');

// Replace corrupted quiz emoji with \u2753
content = content.replace(String.fromCodePoint(0x00E2, 0x009D, 0x201C), '\\u2753');

fs.writeFileSync('J:/eithiroli/ethiroli_react/scripts/generate-eth-web-30-json.js', content);
console.log('Fixed Unicode');
