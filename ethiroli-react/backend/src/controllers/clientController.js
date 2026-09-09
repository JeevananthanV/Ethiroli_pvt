import Client from '../models/Client.js';
import AuditLog from '../models/AuditLog.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listClients = asyncHandler(async (req, res) => {
  const list = await Client.list();
  return success(res, 200, list);
});

export const createClient = asyncHandler(async (req, res) => {
  const id = await Client.create(req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_CLIENT',
    entity_type: 'CLIENT',
    entity_id: id,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  return success(res, 201, { id }, 'Client created successfully');
});

export const getClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) throw new NotFoundError('Client not found');
  return success(res, 200, client);
});

export const deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) throw new NotFoundError('Client not found');
  await Client.delete(req.params.id);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'DELETE_CLIENT',
    entity_type: 'CLIENT',
    entity_id: req.params.id,
    old_value: client
  });
  return success(res, 200, null, 'Client deleted successfully');
});

export const updateClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) throw new NotFoundError('Client not found');
  await Client.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_CLIENT',
    entity_type: 'CLIENT',
    entity_id: req.params.id,
    old_value: client,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  return success(res, 200, null, 'Client updated successfully');
});
