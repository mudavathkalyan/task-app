// src/components/TaskModal.jsx
// Modal form for creating and editing tasks
import { useState, useEffect } from 'react';

const STATUSES = ['Pending', 'In Progress', 'Completed'];

const TaskModal = ({ isOpen, onClose, onSave, editingTask, saving }) => {
  const [form, setForm] = useState({
    title: '', description: '', status: 'Pending',
  });
  const [error, setError] = useState('');

  // When editing, pre-fill the form
  useEffect(() => {
    if (editingTask) {
      setForm({
        title:       editingTask.title       || '',
        description: editingTask.description || '',
        status:      editingTask.status      || 'Pending',
      });
    } else {
      setForm({ title: '', description: '', status: 'Pending' });
    }
    setError('');
  }, [editingTask, isOpen]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Task title is required.');
      return;
    }
    await onSave(form);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingTask ? 'Edit Task' : 'New Task'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              autoFocus
              maxLength={255}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add more details (optional)..."
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
