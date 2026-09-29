// Fix Employees.jsx: Remove duplicate const declarations that clash with useHrData hook
// The hook provides: handleCreate, handleUpdate, handleDelete, handleToggleStatus
// The component was re-declaring them, causing esbuild errors

const fs = require("fs");
let content = fs.readFileSync("J:\\eithiroli\\ethiroli_react\\frontend\\src\\roles\\hr\\pages\\Employees.jsx", "utf8");

// Step 1: Remove the const handleCreate declaration (lines 80-96)
// Replace the entire block including the comment and function
content = content.replace(
  `  // --- handleCreate ---\n  const handleCreate = async (e, formData) => {\n    e.preventDefault();\n    setSubmitting(true);\n    try {\n      await handleCreate(formData); // From useHrData\n      await refresh();\n      setShowAddModal(false);\n      showToast(`Employee added successfully!`);\n      setSubmitting(false);\n    } catch (err) {\n      const message = err.response?.data?.message || err.message || 'Failed to create employee';\n      setError(message);\n      showToast(message);\n      setSubmitting(false);\n    }\n  };\n`,
  `  // --- handleCreate from useHrData hook ---\n  // Used directly in form onSubmit; toast shown below\n`
);

// Step 2: Remove the const handleUpdate declaration (the line itself, keep usage references)
// The handleUpdate is referenced at line 106 and used in form onSubmit
// We need to remove just the declaration but keep the function body logic or replace usages
// Let me replace the whole block
content = content.replace(
  `  // --- handleUpdate ---\n  const handleUpdate = async (e, formData) => {\n    e.preventDefault();\n    if (!selectedEmp) return;\n    setSubmitting(true);\n    try {\n      await handleUpdate(selectedEmp.id, formData); // From useHrData\n      await refresh();\n      setShowEditModal(false);\n      showToast(`Employee ${formData.name} updated successfully.`);\n      setSubmitting(false);\n    } catch (err) {\n      const message = err.response?.data?.message || err.message || 'Failed to update employee';\n      setError(message);\n      showToast(message);\n      setSubmitting(false);\n    }\n  };\n`,
  `  // --- handleUpdate from useHrData hook ---\n  // Called directly in form onSubmit handlers with selectedEmp.id and formData\n`
);

// Step 3: Remove the const handleToggleStatus declaration
content = content.replace(
  `  // --- handleToggleStatus ---\n  const handleToggleStatus = async (emp) => {\n    const newStatus = !emp.is_active;\n    try {\n      await handleToggleStatus(emp.id); // From useHrData (if configured)\n      await refresh();\n      showToast(`${emp.full_name || emp.name} marked as ${newStatus ? 'Active' : 'Inactive'}`);\n    } catch (err) {\n      const message = err.response?.data?.message || err.message || 'Status update failed';\n      showToast(message);\n    }\n  };\n`,
  `  // --- handleToggleStatus from useHrData hook ---\n  // Called directly when toggling employee active status\n`
);

// Step 4: Remove the const handleDelete declaration
content = content.replace(
  `  // --- handleDelete ---\n  const handleDelete = async (id, name) => {\n    if (!window.confirm(`Are you sure you want to remove ${name}?`)) return;\n    try {\n      await handleDelete(id); // From useHrData\n      await refresh();\n      showToast(`Employee ${name} removed.`);\n    } catch (err) {\n      const message = err.response?.data?.message || err.message || 'Failed to delete employee';\n      setError(message);\n      showToast(message);\n    }\n  };\n`,
  `  // --- handleDelete from useHrData hook ---\n  // Called directly when deleting employee\n`
);

// Step 5: Update the form onSubmit for Add Employee Modal (line 292)
// Change from handleCreate(e, formData) to directly calling the hook function
content = content.replace(
  `onSubmit={(e) => handleCreate(e, formData)}`,
  `onSubmit={(e) => { e.preventDefault(); handleCreate(formData); setSubmitting(false); showToast('Employee added successfully!'); }}`
);

// Step 6: Update the form onSubmit for Edit Employee Modal (line 364)
// Change from handleUpdate(e, formData) to directly calling the hook function
content = content.replace(
  `onSubmit={(e) => handleUpdate(e, formData)}`,
  `onSubmit={(e) => { e.preventDefault(); handleUpdate(selectedEmp.id, formData); setSubmitting(false); showToast(\`Employee \${formData.name} updated successfully.\`); }}`
);

// Step 7: Update handleToggleStatus button onClick (line 268)
// Change from handleToggleStatus(emp) to directly calling the hook function
content = content.replace(
  `onClick={() => handleToggleStatus(emp)}`,
  `onClick={() => { const newStatus = !emp.is_active; handleToggleStatus(emp.id); showToast(\`${emp.full_name || emp.name} marked as ${newStatus ? 'Active' : 'Inactive'}\`); }}`
);

// Step 8: Update handleDelete button onClick (line 278)
// Change from handleDelete(emp.id, emp.full_name || emp.name) to directly calling the hook function
content = content.replace(
  `onClick={() => handleDelete(emp.id, emp.full_name || emp.name)}`,
  `onClick={() => { if (window.confirm(\`Are you sure you want to remove ${emp.full_name || emp.name}?\`)) { handleDelete(emp.id); showToast(`Employee ${emp.full_name || emp.name} removed.`); }}`
);

fs.writeFileSync("J:\\eithiroli\\ethiroli_react\\frontend\\src\\roles\\hr\\pages\\Employees.jsx", content);
console.log("Fixed Employees.jsx - removed duplicate const declarations and updated references");