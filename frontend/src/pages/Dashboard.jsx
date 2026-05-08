// src/pages/Dashboard.jsx
// Main page — shows all tasks and handles CRUD operations
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

const FILTERS = ['All', 'Pending', 'In Progress', 'Completed'];

const Dashboard = () => {
  const { user }                          = useAuth();
  const [tasks, setTasks]                 = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState('');
  const [filter, setFilter]               = useState('All');
  const [modalOpen, setModalOpen]         = useState(false);
  const [editingTask, setEditingTask]     = useState(null);
  const [saving, setSaving]               = useState(false);
  const [deleting, setDeleting]           = useState(null); // task id being deleted
  const [successMsg, setSuccessMsg]       = useState('');

  // ── Fetch tasks ────────────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get('/tasks');
      setTasks(data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ── Show brief success message ─────────────────────────────────
  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // ── Create or Update task ──────────────────────────────────────
  const handleSave = async (formData) => {
    try {
      setSaving(true);
      if (editingTask) {
        // UPDATE
        const { data } = await api.put(`/tasks/${editingTask.id}`, formData);
        setTasks((prev) =>
          prev.map((t) => (t.id === editingTask.id ? data.task : t))
        );
        showSuccess('Task updated!');
      } else {
        // CREATE
        const { data } = await api.post('/tasks', formData);
        setTasks((prev) => [data.task, ...prev]);
        showSuccess('Task created!');
      }
      setModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task.');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete task ────────────────────────────────────────────────
  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task? This cannot be undone.')) return;
    try {
      setDeleting(taskId);
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      showSuccess('Task deleted.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task.');
    } finally {
      setDeleting(null);
    }
  };

  // ── Open modal for editing ─────────────────────────────────────
  const handleEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const openAddModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  // ── Filter tasks by status ─────────────────────────────────────
  const filteredTasks =
    filter === 'All' ? tasks : tasks.filter((t) => t.status === filter);

  // ── Stats ──────────────────────────────────────────────────────
  const stats = {
    total:      tasks.length,
    pending:    tasks.filter((t) => t.status === 'Pending').length,
    inProgress: tasks.filter((t) => t.status === 'In Progress').length,
    completed:  tasks.filter((t) => t.status === 'Completed').length,
  };

  return (
    <div className="dashboard">
      {/* ── Header ── */}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">My Tasks</h1>
          <p className="dash-sub">Good to see you, {user?.name?.split(' ')[0]}!</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          + New Task
        </button>
      </div>

      {/* ── Stats row ── */}
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-card stat-pending">
          <span className="stat-number">{stats.pending}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card stat-progress">
          <span className="stat-number">{stats.inProgress}</span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat-card stat-done">
          <span className="stat-number">{stats.completed}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      {/* ── Alerts ── */}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error      && <div className="alert alert-error">{error} <button onClick={() => setError('')}>✕</button></div>}

      {/* ── Filter tabs ── */}
      <div className="filter-tabs">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
            <span className="filter-count">
              {f === 'All' ? tasks.length : tasks.filter((t) => t.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* ── Task list ── */}
      {loading ? (
        <div className="loading-area">
          <div className="spinner" />
          <p>Loading tasks…</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No tasks here</h3>
          <p>{filter === 'All' ? 'Create your first task to get started.' : `No ${filter} tasks.`}</p>
          {filter === 'All' && (
            <button className="btn btn-primary" onClick={openAddModal}>
              + Add First Task
            </button>
          )}
        </div>
      ) : (
        <div className="task-grid">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
              deleting={deleting}
            />
          ))}
        </div>
      )}

      {/* ── Task Modal (Add / Edit) ── */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        onSave={handleSave}
        editingTask={editingTask}
        saving={saving}
      />
    </div>
  );
};

export default Dashboard;
