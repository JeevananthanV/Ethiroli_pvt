import WebhookSubscription from '../models/WebhookSubscription.js';

export const listWebhooks = async (req, res) => {
  try {
    const list = await WebhookSubscription.list({ tenant_id: req.tenant ? req.tenant.id : null });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createWebhook = async (req, res) => {
  try {
    const id = await WebhookSubscription.create({ ...req.body, tenant_id: req.tenant.id, user_id: req.user.id });
    res.status(201).json({ message: 'Webhook subscription created.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
