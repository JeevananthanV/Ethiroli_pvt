import fs from 'fs';
import path from 'path';

function toPascalCase(str) {
  return str.replace(/(^|_)(\w)/g, (_, __, c) => c.toUpperCase());
}

function toCamelCase(str) {
  return str.replace(/(^|_)(\w)/g, (_, __, c) => c.toLowerCase());
}

function generateComponent(modelName, entityName) {
  const ComponentName = toPascalCase(modelName);
  const entityTitle = entityName || toPascalCase(modelName);
  const apiModule = toCamelCase(modelName);

  return `import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ${entityTitle}List, ${entityTitle}Create, ${entityTitle}Update, ${entityTitle}Delete } from '../../store/slices/${toCamelCase(modelName)}Slice.js';
import { list${entityTitle}s, create${entityTitle}, update${entityTitle}, delete${entityTitle} } from '../../services/api/${apiModule}Api.js';
import { Button } from '../../common/components/Button/Button.jsx';
import { Modal } from '../../common/components/Modal/Modal.jsx';
import { Input } from '../../common/components/Input/Input.jsx';
import { DataTable } from '../../common/components/DataTable/DataTable.jsx';
import './${toCamelCase(modelName)}.module.css';

export default function ${ComponentName}Manager() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.${toCamelCase(modelName)});
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    dispatch(${entityTitle}ListStart());
    try {
      const data = await list${entityTitle}s();
      dispatch(${entityTitle}ListSuccess(data.data));
    } catch (err) {
      dispatch(${entityTitle}ListFailure(err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await update${entityTitle}(editingItem.id, formData);
      } else {
        await create${entityTitle}(formData);
      }
      setShowModal(false);
      setEditingItem(null);
      setFormData({});
      loadItems();
    } catch (err) {
      console.error('Failed to save ${entityTitle}:', err);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ${entityTitle}?')) {
      await delete${entityTitle}(id);
      loadItems();
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'created_at', label: 'Created At' }
  ];

  return (
    <div className="${toCamelCase(modelName)}-manager">
      <div className="${toCamelCase(modelName)}-manager__header">
        <h2>${entityTitle} Management</h2>
        <Button onClick={() => { setEditingItem(null); setFormData({}); setShowModal(true); }}>
          Add ${entityTitle}
        </Button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingItem ? 'Edit ${entityTitle}' : 'Add ${entityTitle}'}>
        <form onSubmit={handleSubmit}>
          <Input
            label="Name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <div className="modal-actions">
            <Button type="submit" variant="primary">
              {editingItem ? 'Update' : 'Create'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
`;
}

function generateComponentCSS(modelName) {
  const cssModuleName = toCamelCase(modelName);
  return `.${cssModuleName}-manager {
  padding: 24px;
}

.${cssModuleName}-manager__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.${cssModuleName}-manager__header h2 {
  margin: 0;
  font-size: 24px;
}

.error-message {
  padding: 12px;
  background: #fee;
  color: #c00;
  border-radius: 4px;
  margin-bottom: 16px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  justify-content: flex-end;
}
`;
}

function generateIndexBarrel(modelName) {
  const ComponentName = toPascalCase(modelName);
  return `export { default as ${ComponentName}Manager } from './components/${toPascalCase(modelName)}Manager.jsx';\n`;
}

function writeComponent(modelName, entityName) {
  const ComponentName = toPascalCase(modelName);
  const componentDir = path.join(process.cwd(), 'src', 'modules', toCamelCase(modelName), 'components');
  fs.mkdirSync(componentDir, { recursive: true });

  const jsxPath = path.join(componentDir, `${toCamelCase(modelName)}Manager.jsx`);
  const cssPath = path.join(componentDir, `${toCamelCase(modelName)}.module.css`);
  const indexPath = path.join(process.cwd(), 'src', 'modules', toCamelCase(modelName), 'index.js');

  fs.writeFileSync(jsxPath, generateComponent(modelName, entityName), 'utf8');
  fs.writeFileSync(cssPath, generateComponentCSS(modelName), 'utf8');
  fs.writeFileSync(indexPath, generateIndexBarrel(modelName), 'utf8');

  console.log(`Created: ${jsxPath}`);
  console.log(`Created: ${cssPath}`);
  console.log(`Created: ${indexPath}`);
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node write-components.js <modelName> [entityName]');
  process.exit(1);
}

const modelName = args[0];
const entityName = args[1] || toPascalCase(modelName);
writeComponent(modelName, entityName);
