import fs from 'fs';
import path from 'path';

const SLICES_DIR = path.join(process.cwd(), 'src', 'store', 'slices');

function toPascalCase(str) {
  return str.replace(/(^|_)(\w)/g, (_, __, c) => c.toUpperCase());
}

function toCamelCase(str) {
  return str.replace(/(^|_)(\w)/g, (_, __, c) => c.toLowerCase());
}

function generateSlice(modelName, entityName) {
  const sliceName = toCamelCase(modelName);
  const entityTitle = entityName || toPascalCase(modelName);

  return `import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const ${sliceName}Slice = createSlice({
  name: '${sliceName}',
  initialState,
  reducers: {
    fetch${entityTitle}Start: (state) => { state.loading = true; },
    fetch${entityTitle}Success: (state, action) => { state.items = action.payload; state.loading = false; },
    fetch${entityTitle}Failure: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { fetch${entityTitle}Start, fetch${entityTitle}Success, fetch${entityTitle}Failure } = ${sliceName}Slice.actions;
export default ${sliceName}Slice.reducer;
`;
}

function writeSlice(modelName, entityName) {
  const sliceName = toCamelCase(modelName);
  const filePath = path.join(SLICES_DIR, `${sliceName}Slice.js`);
  const code = generateSlice(modelName, entityName);
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Created: ${filePath}`);
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node write-slices.js <modelName> [entityName]');
  process.exit(1);
}

const modelName = args[0];
const entityName = args[1] || toPascalCase(modelName);
writeSlice(modelName, entityName);
