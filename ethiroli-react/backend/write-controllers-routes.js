import fs from 'fs';
import path from 'path';

const CONTROLLERS_DIR = path.join(process.cwd(), 'src', 'controllers');
const ROUTES_DIR = path.join(process.cwd(), 'src', 'routes');

function toPascalCase(str) {
  return str.replace(/(^|_)(\w)/g, (_, __, c) => c.toUpperCase());
}

function toCamelCase(str) {
  return str.replace(/(^|_)(\w)/g, (_, __, c) => c.toLowerCase());
}

function toSnakeCase(str) {
  return str.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`);
}

function generateController(modelName, routePrefix, entityName, auditActions = true, socketBroadcast = false, broadcastRole = null) {
  const ModelClass = toPascalCase(modelName);
  const entityTitle = entityName || toPascalCase(modelName);
  const listFn = toCamelCase(modelName);

  let auditImports = '';
  let socketImports = '';
  let createAuditBlock = '';
  let updateAuditBlock = '';
  let deleteAuditBlock = '';
  const snakeTitle = toSnakeCase(entityTitle).toUpperCase();

  if (auditActions) {
    auditImports = `import AuditLog from '../models/AuditLog.js';\n`;
    createAuditBlock = `
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_${snakeTitle}',
    entity_type: '${snakeTitle}',
    entity_id: id,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });`;

    updateAuditBlock = `
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_${snakeTitle}',
    entity_type: '${snakeTitle}',
    entity_id: req.params.id,
    old_value: item,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });`;

    deleteAuditBlock = `
  await AuditLog.create({
    user_id: req.user.id,
    action: 'DELETE_${snakeTitle}',
    entity_type: '${snakeTitle}',
    entity_id: req.params.id,
    old_value: item,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });`;
  }

  if (socketBroadcast && broadcastRole) {
    socketImports = `import { broadcastToRole } from '../services/socketService.js';\n`;
    createAuditBlock += `
  broadcastToRole('${broadcastRole}', '${toCamelCase(entityTitle)}_created', { id });`;
    updateAuditBlock += `
  broadcastToRole('${broadcastRole}', '${toCamelCase(entityTitle)}_updated', { id: req.params.id });`;
    deleteAuditBlock += `
  broadcastToRole('${broadcastRole}', '${toCamelCase(entityTitle)}_deleted', { id: req.params.id });`;
  }

  return `import ${ModelClass} from '../models/${toPascalCase(modelName)}.js';
${auditImports}${socketImports}import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const ${listFn} = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    ${ModelClass}.list({ limit: parseInt(limit), offset }),
    ${ModelClass}.count()
  ]);

  return success(res, 200, items, '${entityTitle} retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const create${toPascalCase(entityTitle)} = asyncHandler(async (req, res) => {
  const id = await ${ModelClass}.create(req.body);${createAuditBlock}
  return success(res, 201, { id }, '${entityTitle} created successfully');
});

export const get${toPascalCase(entityTitle)} = asyncHandler(async (req, res) => {
  const item = await ${ModelClass}.findById(req.params.id);
  if (!item) throw new NotFoundError('${entityTitle} not found');
  return success(res, 200, item, '${entityTitle} retrieved');
});

export const update${toPascalCase(entityTitle)} = asyncHandler(async (req, res) => {
  const item = await ${ModelClass}.findById(req.params.id);
  if (!item) throw new NotFoundError('${entityTitle} not found');
  await ${ModelClass}.update(req.params.id, req.body);${updateAuditBlock}
  return success(res, 200, null, '${entityTitle} updated successfully');
});

export const delete${toPascalCase(entityTitle)} = asyncHandler(async (req, res) => {
  const item = await ${ModelClass}.findById(req.params.id);
  if (!item) throw new NotFoundError('${entityTitle} not found');
  await ${ModelClass}.delete(req.params.id);${deleteAuditBlock}
  return success(res, 200, null, '${entityTitle} deleted successfully');
});
`;
}

function generateRoute(modelName, routePrefix, roles = { list: ['ADMIN', 'SUPER_ADMIN'], create: ['ADMIN', 'SUPER_ADMIN'], get: ['ADMIN', 'SUPER_ADMIN'], update: ['ADMIN', 'SUPER_ADMIN'], delete: ['SUPER_ADMIN'] }, validateBody = false) {
  const ModelClass = toPascalCase(modelName);
  const listFn = toCamelCase(modelName);
  const entityTitle = toPascalCase(modelName);
  const validateImport = validateBody ? "import { validateBody } from '../middleware/validation.js';\n" : '';

  return `import express from 'express';
import { ${listFn}, create${entityTitle}, get${entityTitle}, update${entityTitle}, delete${entityTitle} } from '../controllers/${toPascalCase(modelName)}Controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
${validateImport}
const router = express.Router();
router.use(authenticate);

router.get('/${routePrefix}', requireRole(${roles.list.map(r => `'${r}'`).join(', ')}), ${listFn});
router.post('/${routePrefix}', requireRole(${roles.create.map(r => `'${r}'`).join(', ')}),${validateBody ? " validateBody('create" + entityTitle + "')," : ''} create${entityTitle});
router.get('/${routePrefix}/:id', get${entityTitle});
router.patch('/${routePrefix}/:id', requireRole(${roles.update.map(r => `'${r}'`).join(', ')}),${validateBody ? " validateBody('create" + entityTitle + "')," : ''} update${entityTitle});
router.delete('/${routePrefix}/:id', requireRole(${roles.delete.map(r => `'${r}'`).join(', ')}), delete${entityTitle});

export default router;
`;
}

function writeController(modelName, routePrefix, options = {}) {
  const controllerCode = generateController(
    modelName,
    routePrefix,
    options.entityName,
    options.auditActions !== false,
    options.socketBroadcast || false,
    options.broadcastRole || null
  );
  const controllerPath = path.join(CONTROLLERS_DIR, `${toPascalCase(modelName)}Controller.js`);
  fs.writeFileSync(controllerPath, controllerCode, 'utf8');
  console.log(`Created: ${controllerPath}`);
}

function writeRoute(modelName, routePrefix, options = {}) {
  const routeCode = generateRoute(modelName, routePrefix, options.roles, options.validateBody || false);
  const routePath = path.join(ROUTES_DIR, `${toPascalCase(modelName)}Routes.js`);
  fs.writeFileSync(routePath, routeCode, 'utf8');
  console.log(`Created: ${routePath}`);
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: node write-controllers-routes.js <modelName> <routePrefix> [entityName] [--audit] [--socket <role>] [--validate]');
  process.exit(1);
}

const modelName = args[0];
const routePrefix = args[1];
const entityName = args[2] || toPascalCase(modelName);
const options = {
  entityName,
  auditActions: args.includes('--audit'),
  socketBroadcast: args.includes('--socket'),
  broadcastRole: args[args.indexOf('--socket') + 1] || null,
  validateBody: args.includes('--validate'),
  roles: {
    list: ['ADMIN', 'SUPER_ADMIN'],
    create: ['ADMIN', 'SUPER_ADMIN'],
    get: ['ADMIN', 'SUPER_ADMIN'],
    update: ['ADMIN', 'SUPER_ADMIN'],
    delete: ['SUPER_ADMIN']
  }
};

writeController(modelName, routePrefix, options);
writeRoute(modelName, routePrefix, options);
