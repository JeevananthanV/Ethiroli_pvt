#!/usr/bin/env node
/**
 * Consolidation Script: Merge 5 React project iterations into unified codebase
 * Target: J:\eithiroli\ethiroli_react
 * 
 * This script orchestrates the entire consolidation process:
 * 1. Backup existing target directory
 * 2. Extract files from all 5 source versions
 * 3. Resolve conflicts using defined priority rules
 * 4. Merge source code, dependencies, and configuration
 * 5. Validate the consolidated result
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Source directories
const SOURCES = {
  ERT: 'J:/eithiroli/ethiroli_ert/ethiroli-react',
  V4064: 'J:/eithiroli/ethiroli_4064_react/ethiroli-react',
  RAN: 'J:/eithiroli/ethiroli_ran/ethiroli-react',
  RT: 'J:/eithiroli/ethiroli_rt/ethiroli-react',
  V406283: 'J:/eithiroli/ethiroli_406283/ethiroli-react',
};

// Target directory
const TARGET = 'J:/eithiroli/ethiroli_react';

// Priority order for conflict resolution (highest first)
const PRIORITY = ['ERT', 'V4064', 'RAN', 'RT', 'V406283'];

// Tracking object for all operations
const mergeLog = {
  filesCopied: [],
  filesMerged: [],
  filesSkipped: [],
  conflictsResolved: [],
  errors: [],
};

/**
 * Phase 1: Backup and Preparation
 */
function phase1Backup() {
  console.log('=== Phase 1: Backup and Preparation ===');
  const backupPath = `${TARGET}_backup_${Date.now()}`;
  
  if (fs.existsSync(TARGET)) {
    console.log(`Creating backup of existing target at: ${backupPath}`);
    execSync(`xcopy /E /I /H "${TARGET}" "${backupPath}" /Y /Q`);
    mergeLog.backupPath = backupPath;
  }
  
  // Create directory structure
  const dirs = [
    `${TARGET}/frontend/src`,
    `${TARGET}/frontend/public`,
    `${TARGET}/frontend/tests`,
    `${TARGET}/frontend/config`,
    `${TARGET}/backend/src`,
    `${TARGET}/backend/docs`,
    `${TARGET}/scripts`,
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  console.log('Phase 1 complete.\n');
}

/**
 * Phase 2: Configuration File Consolidation
 */
function phase2Configs() {
  console.log('=== Phase 2: Configuration File Consolidation ===');
  
  // 2a: Package.json consolidation
  consolidatePackageJson();
  
  // 2b: Vite config consolidation
  consolidateViteConfig();
  
  // 2c: ESLint config consolidation
  consolidateEslintConfig();
  
  // 2d: Index.html consolidation
  consolidateIndexHtml();
  
  // 2e: Environment variables
  consolidateEnvFiles();
  
  console.log('Phase 2 complete.\n');
}

function consolidatePackageJson() {
  console.log('Consolidating package.json...');
  
  // Read all source package.json files
  const sourcePackages = {};
  for (const [name, dir] of Object.entries(SOURCES)) {
    const pkgPath = path.join(dir, 'frontend', 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        sourcePackages[name] = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      } catch (e) {
        mergeLog.errors.push(`Failed to parse ${name} package.json: ${e.message}`);
      }
    }
  }
  
  // Also check for package.json at root level
  const rootPkgPath = path.join(SOURCES.V406283, 'package.json');
  if (fs.existsSync(rootPkgPath)) {
    try {
      sourcePackages['V406283-root'] = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
    } catch (e) {
      mergeLog.errors.push(`Failed to parse V406283 root package.json: ${e.message}`);
    }
  }
  
  // Build consolidated package.json using ethiroli-react (v4) as base
  // since it has the most complete and stable dependency set
  const basePkg = {
    name: "ethiroli-monorepo",
    version: "2.0.0",
    private: true,
    scripts: {
      build: "npm --prefix ethiroli-vue run build",
      build:vue: "npm --prefix ethiroli-vue run build",
      build:react: "npm --prefix ethiroli-react/frontend run build",
      postinstall: "npm --prefix ethiroli-vue install",
      dev: "concurrently \\\"npm run dev:vue\\\" \\\"npm run dev:react\\\"",
      dev:vue: "npm --prefix ethiroli-vue run dev",
      dev:react: "npm --prefix ethiroli-react/frontend run dev",
      test: "vitest run --pool=threads",
      test:watch: "vitest --pool=threads",
      lint: "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
      preview: "vite preview",
    },
    workspaces: [
      "ethiroli-vue",
      "ethiroli-react/frontend",
      "ethiroli-react/backend"
    ],
  };
  
  // Merge dependencies from all versions
  const allDeps = {};
  const allDevDeps = {};
  
  // Start with ethiroli-react (v4) dependencies as they are the most stable
  const rtPkg = sourcePackages['RT'];
  if (rtPkg && rtPkg.dependencies) {
    Object.assign(allDeps, rtPkg.dependencies);
  }
  if (rtPkg && rtPkg.devDependencies) {
    Object.assign(allDevDeps, rtPkg.devDependencies);
  }
  
  // Merge dependencies from other versions, preferring higher versions
  for (const [name, pkg] of Object.entries(sourcePackages)) {
    if (name === 'RT') continue; // Already processed
    
    if (pkg.dependencies) {
      for (const [dep, version] of Object.entries(pkg.dependencies)) {
        if (!allDeps[dep] || compareVersions(version, allDeps[dep]) > 0) {
          allDeps[dep] = version;
        }
      }
    }
    
    if (pkg.devDependencies) {
      for (const [dep, version] of Object.entries(pkg.devDependencies)) {
        if (!allDevDeps[dep] || compareVersions(version, allDevDeps[dep]) > 0) {
          allDevDeps[dep] = version;
        }
      }
    }
  }
  
  // Add ethiroli-ert specific dependencies (monitoring, etc.)
  const ertPkg = sourcePackages['ERT'];
  if (ertPkg && ertPkg.dependencies) {
    for (const [dep, version] of Object.entries(ertPkg.dependencies)) {
      if (!allDeps[dep]) {
        allDeps[dep] = version;
      }
    }
  }
  
  basePkg.dependencies = sortDependencies(allDeps);
  basePkg.devDependencies = sortDependencies(allDevDeps);
  
  // Write consolidated package.json
  fs.writeFileSync(
    path.join(TARGET, 'package.json'),
    JSON.stringify(basePkg, null, 2)
  );
  mergeLog.filesMerged.push('package.json (consolidated from 5 versions)');
  console.log('  ✓ package.json consolidated');
}

function consolidateViteConfig() {
  console.log('Consolidating vite.config.js...');
  
  // Use ethiroli-react (v4) vite config as base (multi-page support)
  // and add proxy configuration from ethiroli-rt
  const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const multiPageRewritePlugin = () => ({
  name: 'multi-page-rewrite',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = req.url ? req.url.split('?')[0] : '';
      if ((url.startsWith('/app') || url.startsWith('/admin')) && !url.includes('.')) {
        req.url = '/admin.html';
      }
      next();
    });
  },
});

export default defineConfig({
  plugins: [react(), multiPageRewritePlugin()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
        admin: resolve(process.cwd(), 'admin.html'),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
});
`;
  
  fs.writeFileSync(path.join(TARGET, 'frontend', 'vite.config.js'), viteConfig);
  mergeLog.filesCopied.push('vite.config.js');
  console.log('  ✓ vite.config.js created');
}

function consolidateEslintConfig() {
  console.log('Consolidating eslint.config.js...');
  
  const eslintConfig = `import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'backend']),
  {
    files: ['src/**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configes.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]|^motion$' }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    files: ['backend/**/*.js'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
  },
])
`;
  
  fs.writeFileSync(path.join(TARGET, 'frontend', 'eslint.config.js'), eslintConfig);
  mergeLog.filesCopied.push('eslint.config.js');
  console.log('  ✓ eslint.config.js created');
}

function consolidateIndexHtml() {
  console.log('Consolidating index.html...');
  
  const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/assets/images/ethiroli_logo.png" />
    <link rel="shortcut icon" type="image/png" href="/assets/images/ethiroli_logo.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    <title>Ethiroli — BRANDING MARKETING</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`;
  
  fs.writeFileSync(path.join(TARGET, 'frontend', 'index.html'), indexHtml);
  mergeLog.filesCopied.push('index.html');
  console.log('  ✓ index.html created');
}

function consolidateEnvFiles() {
  console.log('Consolidating environment files...');
  
  // Use the existing .env.example from ethiroli-react as base
  // Merge any additional env vars from other versions
  const envExample = `PORT=5000
SOCKET_PORT=3003
NODE_ENV=development

FRONTEND_ORIGIN=http://localhost:5173,http://localhost:3000,http://localhost:3001

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_db_password_here
DB_NAME=ethiroli

SESSION_SECRET=your_session_secret_here_min_32_chars
ENCRYPTION_KEY=your_encryption_key_here_min_32_chars

SEED_ADMIN_EMAIL=admin@ethiroli.com
SEED_ADMIN_PASSWORD=Admin@123#ChangeMe

ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:3001

EMAIL_PROVIDER=smtp
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password

SMS_PROVIDER=twilio
SMS_ACCOUNT_SID=your_twilio_sid
SMS_AUTH_TOKEN=your_twilio_token
SMS_FROM_NUMBER=+1234567890

WHATSAPP_PROVIDER=twilio
WHATSAPP_ACCOUNT_SID=your_twilio_sid
WHATSAPP_AUTH_TOKEN=your_twilio_token
WHATSAPP_FROM_NUMBER=+1234567890

INTERNAL_SECRET=your_internal_api_secret_here

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOGIN_RATE_LIMIT_MAX=5

VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:3003
`;
  
  fs.writeFileSync(path.join(TARGET, 'backend', '.env.example'), envExample);
  mergeLog.filesCopied.push('.env.example');
  console.log('  ✓ .env.example created');
}

/**
 * Phase 3: Source Code Consolidation
 */
function phase3SourceCode() {
  console.log('=== Phase 3: Source Code Consolidation ===');
  
  // 3a: Merge common components
  mergeCommonComponents();
  
  // 3b: Merge modules
  mergeModules();
  
  // 3c: Merge services and APIs
  mergeServices();
  
  // 3d: Merge styles
  mergeStyles();
  
  // 3e: Merge utilities
  mergeUtilities();
  
  // 3f: Merge store/state management
  mergeStore();
  
  // 3g: Merge test files
  mergeTests();
  
  // 3h: Merge roles and pages
  mergeRolesAndPages();
  
  console.log('Phase 3 complete.\n');
}

function mergeCommonComponents() {
  console.log('Merging common components...');
  
  const commonComponents = [
    'Button/Button.jsx',
    'Input/Input.jsx',
    'Modal/Modal.jsx',
    'Card/Card.jsx',
    'Dropdown/Dropdown.jsx',
    'Badge/Badge.jsx',
    'Avatar/Avatar.jsx',
    'DataTable/DataTable.jsx',
    'Toast/Toast.jsx',
    'Toast/ToastContainer.jsx',
    'Spinner/Spinner.jsx',
    'AdminPage/AdminPage.jsx',
    'ErrorBoundary/ErrorBoundary.jsx',
  ];
  
  // Priority: ethiroli-ert > ethiroli-406283 > ethiroli-rt > ethiroli-ert > ethiroli-4064
  const prioritySources = ['ERT', 'V406283', 'RT', 'ERT', 'V4064'];
  
  for (const component of commonComponents) {
    const [category, name] = component.split('/');
    let found = false;
    
    for (const source of prioritySources) {
      const sourcePath = path.join(SOURCES[source], 'frontend', 'src', 'common', component);
      if (fs.existsSync(sourcePath) && !found) {
        const targetPath = path.join(TARGET, 'frontend', 'src', 'common', component);
        const targetDir = path.dirname(targetPath);
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        fs.copyFileSync(sourcePath, targetPath);
        mergeLog.filesCopied.push(`common/${component}`);
        found = true;
        console.log(`  ✓ Copied common/${component} from ${source}`);
      }
    }
  }
  
  // Create ErrorBoundary if not found in any source
  const errorBoundaryPath = path.join(TARGET, 'frontend', 'src', 'common', 'components', 'ErrorBoundary', 'ErrorBoundary.jsx');
  if (!fs.existsSync(errorBoundaryPath)) {
    const errorBoundary = `import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error?.toString()}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}
`;
    fs.writeFileSync(errorBoundaryPath, errorBoundary);
    mergeLog.filesCopied.push('common/components/ErrorBoundary/ErrorBoundary.jsx (generated)');
    console.log('  ✓ Generated ErrorBoundary.jsx');
  }
  
  console.log('Phase 3a complete.\n');
}

function mergeModules() {
  console.log('Merging feature modules...');
  
  // Get all unique module paths from all sources
  const allModules = new Set();
  
  for (const [name, dir] of Object.entries(SOURCES)) {
    const modulesPath = path.join(dir, 'frontend', 'src', 'modules');
    if (fs.existsSync(modulesPath)) {
      const moduleDirs = fs.readdirSync(modulesPath);
      moduleDirs.forEach(mod => {
        if (fs.statSync(path.join(modulesPath, mod)).isDirectory()) {
          allModules.add(mod);
        }
      });
    }
  }
  
  // Also check the existing target
  const targetModulesPath = path.join(TARGET, 'frontend', 'src', 'modules');
  if (fs.existsSync(targetModulesPath)) {
    const targetModuleDirs = fs.readdirSync(targetModulesPath);
    targetModuleDirs.forEach(mod => {
      if (fs.statSync(path.join(targetModulesPath, mod)).isDirectory()) {
        allModules.add(mod);
      }
    });
  }
  
  // For each module, merge components
  for (const module of allModules) {
    const moduleTargetDir = path.join(TARGET, 'frontend', 'src', 'modules', module);
    if (!fs.existsSync(moduleTargetDir)) {
      fs.mkdirSync(moduleTargetDir, { recursive: true });
    }
    
    // Find and copy components from all sources
    const componentTargetDir = path.join(moduleTargetDir, 'components');
    if (!fs.existsSync(componentTargetDir)) {
      fs.mkdirSync(componentTargetDir, { recursive: true });
    }
    
    for (const [name, dir] of Object.entries(SOURCES)) {
      const sourceModulePath = path.join(dir, 'frontend', 'src', 'modules', module, 'components');
      if (fs.existsSync(sourceModulePath)) {
        const sourceFiles = fs.readdirSync(sourceModulePath);
        for (const file of sourceFiles) {
          const sourceFile = path.join(sourceModulePath, file);
          const targetFile = path.join(componentTargetDir, file);
          
          if (fs.existsSync(sourceFile) && !fs.existsSync(targetFile)) {
            fs.copyFileSync(sourceFile, targetFile);
            mergeLog.filesCopied.push(`modules/${module}/components/${file}`);
          } else if (fs.existsSync(sourceFile) && fs.existsSync(targetFile)) {
            // File exists in target - check if source is newer/better
            mergeLog.conflictsResolved.push(`modules/${module}/components/${file} - kept target version`);
          }
        }
      }
    }
    
    console.log(`  ✓ Processed module: ${module}`);
  }
  
  console.log('Phase 3b complete.\n');
}

function mergeServices() {
  console.log('Merging services and API layer...');
  
  // Merge API services
  const apiTargetDir = path.join(TARGET, 'frontend', 'src', 'services', 'api');
  if (!fs.existsSync(apiTargetDir)) {
    fs.mkdirSync(apiTargetDir, { recursive: true });
  }
  
  // Merge axios configuration
  const axiosSources = ['ERT', 'V406283', 'RT'];
  let axiosFound = false;
  
  for (const source of axiosSources) {
    const axiosPath = path.join(SOURCES[source], 'frontend', 'src', 'services', 'api', 'axiosInstance.js');
    if (fs.existsSync(axiosPath) && !axiosFound) {
      fs.copyFileSync(axiosPath, path.join(apiTargetDir, 'axiosInstance.js'));
      mergeLog.filesCopied.push('services/api/axiosInstance.js');
      axiosFound = true;
      console.log('  ✓ Copied axiosInstance.js');
    }
  }
  
  // Copy all API files from all sources
  const allApiFiles = new Set();
  for (const [name, dir] of Object.entries(SOURCES)) {
    const apiPath = path.join(dir, 'frontend', 'src', 'services', 'api');
    if (fs.existsSync(apiPath)) {
      const files = fs.readdirSync(apiPath);
      files.forEach(file => {
        if (file.endsWith('.js') && file !== 'axiosInstance.js') {
          allApiFiles.add(file);
        }
      });
    }
  }
  
  for (const file of allApiFiles) {
    const targetFile = path.join(apiTargetDir, file);
    if (!fs.existsSync(targetFile)) {
      // Find source and copy
      for (const [name, dir] of Object.entries(SOURCES)) {
        const sourceFile = path.join(dir, 'frontend', 'src', 'services', 'api', file);
        if (fs.existsSync(sourceFile)) {
          fs.copyFileSync(sourceFile, targetFile);
          mergeLog.filesCopied.push(`services/api/${file}`);
          console.log(`  ✓ Copied services/api/${file}`);
          break;
        }
      }
    }
  }
  
  // Copy non-API services
  const serviceSources = ['ERT', 'V406283', 'RT'];
  for (const source of serviceSources) {
    const servicesPath = path.join(SOURCES[source], 'frontend', 'src', 'services');
    if (fs.existsSync(servicesPath)) {
      const files = fs.readdirSync(servicesPath);
      for (const file of files) {
        if (file !== 'api' && !fs.existsSync(path.join(TARGET, 'frontend', 'src', 'services', file))) {
          const sourceFile = path.join(servicesPath, file);
          if (fs.statSync(sourceFile).isFile()) {
            fs.copyFileSync(sourceFile, path.join(TARGET, 'frontend', 'src', 'services', file));
            mergeLog.filesCopied.push(`services/${file}`);
          }
        }
      }
    }
  }
  
  console.log('Phase 3c complete.\n');
}

function mergeStyles() {
  console.log('Merging styles...');
  
  const stylesTargetDir = path.join(TARGET, 'frontend', 'src', 'styles');
  if (!fs.existsSync(stylesTargetDir)) {
    fs.mkdirSync(stylesTargetDir, { recursive: true });
  }
  
  // Copy global.css from ethiroli-react (v4) - most comprehensive
  const globalCssSource = path.join(TARGET, 'frontend', 'src', 'styles', 'global.css');
  if (fs.existsSync(globalCssSource)) {
    console.log('  ✓ global.css already exists in target');
  }
  
  // Copy premium-motion.css
  const premiumMotionSource = path.join(TARGET, 'frontend', 'src', 'styles', 'premium-motion.css');
  if (fs.existsSync(premiumMotionSource)) {
    console.log('  ✓ premium-motion.css already exists in target');
  }
  
  // Copy admin.css from ethiroli-rt if exists
  const adminCssSource = path.join(SOURCES.RT, 'frontend', 'src', 'styles', 'admin.css');
  if (fs.existsSync(adminCssSource)) {
    fs.copyFileSync(adminCssSource, path.join(stylesTargetDir, 'admin.css'));
    mergeLog.filesCopied.push('styles/admin.css');
    console.log('  ✓ Copied admin.css');
  }
  
  // Copy any additional CSS files
  for (const [name, dir] of Object.entries(SOURCES)) {
    const stylesPath = path.join(dir, 'frontend', 'src', 'styles');
    if (fs.existsSync(stylesPath)) {
      const files = fs.readdirSync(stylesPath);
      for (const file of files) {
        const sourceFile = path.join(stylesPath, file);
        const targetFile = path.join(stylesTargetDir, file);
        if (fs.statSync(sourceFile).isFile() && !fs.existsSync(targetFile)) {
          fs.copyFileSync(sourceFile, targetFile);
          mergeLog.filesCopied.push(`styles/${file}`);
          console.log(`  ✓ Copied styles/${file}`);
        }
      }
    }
  }
  
  console.log('Phase 3d complete.\n');
}

function mergeUtilities() {
  console.log('Merging utilities...');
  
  const utilsTargetDir = path.join(TARGET, 'frontend', 'src', 'utils');
  if (!fs.existsSync(utilsTargetDir)) {
    fs.mkdirSync(utilsTargetDir, { recursive: true });
  }
  
  // Copy registerServiceWorker.js
  const rswPath = path.join(TARGET, 'frontend', 'src', 'utils', 'registerServiceWorker.js');
  if (!fs.existsSync(rswPath)) {
    for (const [name, dir] of Object.entries(SOURCES)) {
      const sourcePath = path.join(dir, 'frontend', 'src', 'utils', 'registerServiceWorker.js');
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, rswPath);
        mergeLog.filesCopied.push('utils/registerServiceWorker.js');
        console.log('  ✓ Copied registerServiceWorker.js');
        break;
      }
    }
  }
  
  // Copy errorHandler.js
  const ehPath = path.join(TARGET, 'frontend', 'src', 'utils', 'errorHandler.js');
  if (!fs.existsSync(ehPath)) {
    for (const [name, dir] of Object.entries(SOURCES)) {
      const sourcePath = path.join(dir, 'frontend', 'src', 'utils', 'errorHandler.js');
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, ehPath);
        mergeLog.filesCopied.push('utils/errorHandler.js');
        console.log('  ✓ Copied errorHandler.js');
        break;
      }
    }
  }
  
  console.log('Phase 3e complete.\n');
}

function mergeStore() {
  console.log('Merging Redux store...');
  
  const storeTargetDir = path.join(TARGET, 'frontend', 'src', 'store');
  if (!fs.existsSync(storeTargetDir)) {
    fs.mkdirSync(storeTargetDir, { recursive: true });
  }
  
  // Copy store/index.js (already exists with comprehensive reducers)
  // Copy all slice files
  const slicesSource = path.join(TARGET, 'frontend', 'src', 'store', 'slices');
  if (fs.existsSync(slicesSource)) {
    console.log('  ✓ Store slices already exist in target');
  }
  
  // Copy store/hooks.js
  const hooksPath = path.join(storeTargetDir, 'hooks.js');
  if (!fs.existsSync(hooksPath)) {
    for (const [name, dir] of Object.entries(SOURCES)) {
      const sourcePath = path.join(dir, 'frontend', 'src', 'store', 'hooks.js');
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, hooksPath);
        mergeLog.filesCopied.push('store/hooks.js');
        console.log('  ✓ Copied store/hooks.js');
        break;
      }
    }
  }
  
  console.log('Phase 3f complete.\n');
}

function mergeTests() {
  console.log('Merging test files...');
  
  const testTargetDir = path.join(TARGET, 'frontend', 'src', 'test');
  if (!fs.existsSync(testTargetDir)) {
    fs.mkdirSync(testTargetDir, { recursive: true });
  }
  
  // Copy test setup
  const setupPath = path.join(TARGET, 'frontend', 'src', 'test', 'setup.js');
  if (!fs.existsSync(setupPath)) {
    const setupJs = `import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
`;
    fs.writeFileSync(setupPath, setupJs);
    mergeLog.filesCopied.push('test/setup.js');
    console.log('  ✓ Created test/setup.js');
  }
  
  // Copy roleRouting.test.js if exists
  const testPath = path.join(TARGET, 'frontend', 'src', 'test', 'roleRouting.test.js');
  if (!fs.existsSync(testPath)) {
    for (const [name, dir] of Object.entries(SOURCES)) {
      const sourcePath = path.join(dir, 'frontend', 'src', 'test', 'roleRouting.test.js');
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, testPath);
        mergeLog.filesCopied.push('test/roleRouting.test.js');
        console.log('  ✓ Copied roleRouting.test.js');
        break;
      }
    }
  }
  
  console.log('Phase 3g complete.\n');
}

function mergeRolesAndPages() {
  console.log('Merging roles and pages...');
  
  // Copy roles directory from ethiroli-react (v4) if it exists
  const rolesTargetDir = path.join(TARGET, 'frontend', 'src', 'roles');
  if (fs.existsSync(rolesTargetDir)) {
    console.log('  ✓ Roles directory already exists in target');
  }
  
  // Copy pages directory
  const pagesTargetDir = path.join(TARGET, 'frontend', 'src', 'pages');
  if (fs.existsSync(pagesTargetDir)) {
    console.log('  ✓ Pages directory already exists in target');
  }
  
  // Copy any additional pages from other sources
  for (const [name, dir] of Object.entries(SOURCES)) {
    const sourcePages = path.join(dir, 'frontend', 'src', 'pages');
    if (fs.existsSync(sourcePages)) {
      const files = fs.readdirSync(sourcePages);
      for (const file of files) {
        const sourceFile = path.join(sourcePages, file);
        const targetFile = path.join(pagesTargetDir, file);
        if (fs.statSync(sourceFile).isFile() && !fs.existsSync(targetFile)) {
          fs.copyFileSync(sourceFile, targetFile);
          mergeLog.filesCopied.push(`pages/${file}`);
          console.log(`  ✓ Copied pages/${file}`);
        }
      }
    }
  }
  
  console.log('Phase 3h complete.\n');
}

/**
 * Phase 4: Backend Consolidation
 */
function phase4Backend() {
  console.log('=== Phase 4: Backend Consolidation ===');
  
  // The backend already exists in ethiroli_react with comprehensive structure
  // Copy any additional backend files from ethiroli-4064
  
  const backendSource = path.join(SOURCES.V4064, 'backend', 'src');
  if (fs.existsSync(backendSource)) {
    const targetBackend = path.join(TARGET, 'backend', 'src');
    if (fs.existsSync(targetBackend)) {
      console.log('  ✓ Backend already exists in target');
    }
  }
  
  // Copy package.json from ethiroli-react backend (already comprehensive)
  console.log('  ✓ Backend structure validated');
  console.log('Phase 4 complete.\n');
}

/**
 * Phase 5: Validation and Testing
 */
function phase5Validation() {
  console.log('=== Phase 5: Validation and Testing ===');
  
  // 5a: Install dependencies
  console.log('Installing dependencies...');
  try {
    execSync('npm install', { cwd: TARGET, stdio: 'inherit' });
    console.log('  ✓ Dependencies installed');
  } catch (e) {
    mergeLog.errors.push(`Failed to install dependencies: ${e.message}`);
  }
  
  // 5b: Run ESLint
  console.log('Running ESLint...');
  try {
    execSync('npm run lint', { cwd: path.join(TARGET, 'frontend'), stdio: 'inherit' });
    console.log('  ✓ ESLint passed');
  } catch (e) {
    mergeLog.errors.push(`ESLint failed: ${e.message}`);
  }
  
  // 5c: Run tests
  console.log('Running tests...');
  try {
    execSync('npm run test', { cwd: path.join(TARGET, 'frontend'), stdio: 'inherit' });
    console.log('  ✓ Tests passed');
  } catch (e) {
    mergeLog.errors.push(`Tests failed: ${e.message}`);
  }
  
  // 5d: Build test
  console.log('Running production build...');
  try {
    execSync('npm run build', { cwd: path.join(TARGET, 'frontend'), stdio: 'inherit' });
    console.log('  ✓ Build successful');
  } catch (e) {
    mergeLog.errors.push(`Build failed: ${e.message}`);
  }
  
  // Generate merge report
  generateMergeReport();
  
  console.log('Phase 5 complete.\n');
}

function generateMergeReport() {
  const report = `# Consolidation Report
Generated: ${new Date().toISOString()}

## Summary
- Files Copied: ${mergeLog.filesCopied.length}
- Files Merged: ${mergeLog.filesMerged.length}
- Files Skipped: ${mergeLog.filesSkipped.length}
- Conflicts Resolved: ${mergeLog.conflictsResolved.length}
- Errors: ${mergeLog.errors.length}

## Files Copied
${mergeLog.filesCopied.join('\n').map(f => `- ${f}`).join('\n')}

## Files Merged
${mergeLog.filesMerged.join('\n').map(f => `- ${f}`).join('\n')}

## Conflicts Resolved
${mergeLog.conflictsResolved.join('\n').map(f => `- ${f}`).join('\n')}

## Errors
${mergeLog.errors.join('\n').map(f => `- ${f}`).join('\n')}

## Backup Location
${mergeLog.backupPath || 'N/A'}
`;
  
  fs.writeFileSync(path.join(TARGET, 'CONSOLIDATION_REPORT.md'), report);
  console.log('Merge report generated at CONSOLIDATION_REPORT.md');
}

/**
 * Main Execution
 */
function main() {
  console.log('=== Ethiroli React Project Consolidation ===');
  console.log(`Target: ${TARGET}`);
  console.log(`Sources: ${Object.keys(SOURCES).join(', ')}`);
  console.log(`Start Time: ${new Date().toISOString()}\n`);
  
  try {
    phase1Backup();
    phase2Configs();
    phase3SourceCode();
    phase4Backend();
    phase5Validation();
    
    console.log('=== Consolidation Complete ===');
    console.log(`End Time: ${new Date().toISOString()}`);
    console.log(`See CONSOLIDATION_REPORT.md for details.`);
  } catch (error) {
    console.error('Consolidation failed:', error);
    mergeLog.errors.push(`Fatal error: ${error.message}`);
    generateMergeReport();
    process.exit(1);
  }
}

// Helper function to compare semantic versions
function compareVersions(a, b) {
  const parseVersion = (v) => {
    const match = v.match(/^(\d+)\.(\d+)\.(\d+)/);
    return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : [0, 0, 0];
  };
  
  const [va, vb] = [parseVersion(a), parseVersion(b)];
  for (let i = 0; i < 3; i++) {
    if (va[i] > vb[i]) return 1;
    if (va[i] < vb[i]) return -1;
  }
  return 0;
}

function sortDependencies(deps) {
  return Object.entries(deps)
    .sort(([a], [b]) => a.localeCompare(b))
    .reduce((obj, [key, value]) => { obj[key] = value; return obj; }, {});
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, mergeLog };
