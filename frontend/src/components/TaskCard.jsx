// src/components/TaskCard.jsx
// Displays a single task with edit and delete actions
const STATUS_COLORS = {
  'Pending':     'status-pending',
  'In Progress': 'status-progress',
  'Completed':   'status-done',
};

const TaskCard = ({ task, onEdit, onDelete, deleting }) => {
  const statusClass = STATUS_COLORS[task.status] || 'status-pending';

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });

  return (
    <div className={`task-card ${task.status === 'Completed' ? 'task-done' : ''}`}>
      <div className="task-card-header">
        <span className={`status-badge ${statusClass}`}>{task.status}</span>
        <span className="task-date">{formatDate(task.created_at)}</span>
      </div>

      <h3 className="task-title">{task.title}</h3>

      {task.description && (
        <p className="task-desc">{task.description}</p>
      )}

      <div className="task-actions">
        <button
          className="btn-task-edit"
          onClick={() => onEdit(task)}
          title="Edit task"
        >
          ✎ Edit
        </button>
        <button
          className="btn-task-delete"
          onClick={() => onDelete(task.id)}
          disabled={deleting === task.id}
          title="Delete task"
        >
          {deleting === task.id ? '...' : '✕ Delete'}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
