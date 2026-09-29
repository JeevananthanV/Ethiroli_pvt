const fs = require("fs");

let content = fs.readFileSync("J:\\eithiroli\\ethiroli_react\\frontend\\src\\roles\\hr\\pages\\Employees.jsx", "utf8");

// The issue: useHrData provides handleCreate, handleUpdate, handleDelete, handleToggleStatus
// The file re-declares them with const, causing duplicate symbol errors in esbuild

// Fix: Remove the duplicate const declarations and use the destructured versions directly
// We need to remove lines 81-96 (handleCreate), 106 (handleUpdate), 125-135 (handleToggleStatus), 138-149 (handleDelete)
// and update references to use the hook versions directly

// Let me remove the const declarations and update the code to use the hook versions directly

// Remove const handleCreate at line 81-96
content = content.replace(
  `  // --- handleCreate ---\n  const handleCreate = async (e, formData) => {\n    e.preventDefault();\n    setSubmitting(true);\n    try {\n      await handleCreate(formData); // From useHrData\n      await refresh();\n      setShowAddModal(false);\n      showToast(`Employee added successfully!`);\n      setSubmitting(false);\n    } catch (err) {\n      const message = err.response?.data?.message || err.message || 'Failed to create employee';\n      setError(message);\n      showToast(message);\n      setSubmitting(false);\n    }\n  };\n`,
  `  // --- handleCreate is provided by useHrData hook ---\n  // Used directly via handleCreate(formData) in form onSubmit handlers\n`
);

// Remove const handleUpdate at line 106-122
content = content.replace(
  `  // --- handleUpdate ---\n  const handleUpdate = async (e, formData) => {\n    e.preventDefault();\n    if (!selectedEmp) return;\n    setSubmitting(true);\n    try {\n      await handleUpdate(selectedEmp.id, formData); // From useHrData\n      await refresh();\n      setShowEditModal(false);\n      showToast(`Employee ${formData.name} updated successfully.`);\n      setSubmitting(false);\n    } catch (err) {\n      const message = err.response?.data?.message || err.message || 'Failed to update employee';\n      setError(message);\n      showToast(message);\n      setSubmitting(false);\n    }\n  };\n`,
  `  // --- handleUpdate is provided by useHrData hook ---\n  // Used directly via handleUpdate(selectedEmp.id, formData) in form onSubmit handlers\n`
);

// Remove const handleToggleStatus at line 125-135
content = content.replace(
  `  // --- handleToggleStatus ---\n  const handleToggleStatus = async (emp) => {\n    const newStatus = !emp.is_active;\n    try {\n      await handleToggleStatus(emp.id); // From useHrData (if configured)\n      await refresh();\n      showToast(`${emp.full_name || emp.name} marked as ${newStatus ? 'Active' : 'Inactive'}`);\n    } catch (err) {\n      const message = err.response?.data?.message || err.message || 'Status update failed';\n      showToast(message);\n    }\n  };\n`,
  `  // --- handleToggleStatus is provided by useHrData hook ---\n  // Used directly via handleToggleStatus(emp.id) when needed\n`
);

// Remove const handleDelete at line 138-149
content = content.replace(
  `  // --- handleDelete ---\n  const handleDelete = async (id, name) => {\n    if (!window.confirm(`Are you sure you want to remove ${name}?`)) return;\n    try {\n      await handleDelete(id); // From useHrData\n      await refresh();\n      showToast(`Employee ${name} removed.`);\n    } catch (err) {\n      const message = err.response?.data?.message || err.message || 'Failed to delete employee';\n      setError(message);\n      showToast(message);\n    }\n  };\n`,
  `  // --- handleDelete is provided by useHrData hook ---\n  // Used directly via handleDelete(id) when needed\n`
);

// Update the form onSubmit handlers to use the hook versions directly
// Line 292: <form onSubmit={(e) => handleCreate(e, formData)}>
content = content.replace(
  `onSubmit={(e) => handleCreate(e, formData)}`,
  `onSubmit={(e) => { e.preventDefault(); const result = handleCreate(formData); setSubmitting(false); if (result) showToast('Employee added successfully!'); return result; }}`
);

// Line 364: <form onSubmit={(e) => handleUpdate(e, formData)}>
content = content.replace(
  `onSubmit={(e) => handleUpdate(e, formData)}`,
  `onSubmit={(e) => { e.preventDefault(); const result = handleUpdate(selectedEmp.id, formData); setSubmitting(false); if (result) showToast(\`Employee \${formData.name} updated successfully.\`); return result; }}`
);

// Update handleToggleStatus call at line 268
content = content.replace(
  `onClick={() => handleToggleStatus(emp)}`,
  `onClick={() => { const newStatus = !emp.is_active; handleToggleStatus(emp.id); showToast(\`${emp.full_name || emp.name} marked as ${newStatus ? 'Active' : 'Inactive'}\`); }}`
);

// Update handleDelete call at line 278
content = content.replace(
  `onClick={() => handleDelete(emp.id, emp.full_name || emp.name)}`,
  `onClick={() => { if (window.confirm(\`Are you sure you want to remove ${emp.full_name || emp.name}?\`)) { handleDelete(emp.id); showToast(`Employee ${emp.full_name || emp.name} removed.`); }}`
);

fs.writeFileSync("J:\\eithiroli\\ethiroli_react\\frontend\\src\\roles\\hr\\pages\\Employees.jsx", content);
console.log("Fixed Employees.jsx - removed duplicate const declarations");