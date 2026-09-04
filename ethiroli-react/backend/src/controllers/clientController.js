import Client from '../models/Client.js';

export const listClients = async (req, res) => {
  try {
    const list = await Client.list();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createClient = async (req, res) => {
  try {
    const id = await Client.create(req.body);
    res.status(201).json({ message: 'Client created successfully.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    await Client.update(req.params.id, req.body);
    res.status(200).json({ message: 'Client updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
