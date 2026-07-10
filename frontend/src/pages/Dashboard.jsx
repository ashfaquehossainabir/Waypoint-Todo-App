import { useEffect, useState, useCallback, useMemo } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import ProgressDial from '../components/ProgressDial';
import Filters from '../components/Filters';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import TaskForm from '../components/TaskForm';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/tasks');
      setTasks(data.tasks);
      setStats(data.stats);
    } catch (err) {
      setError('Could not load your tasks. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.categories);
    } catch (err) {
      // Non-critical: task list still works without categories loaded
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, [fetchTasks, fetchCategories]);

  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (filter === 'pending') result = result.filter((t) => !t.completed);
    if (filter === 'completed') result = result.filter((t) => t.completed);
    if (categoryFilter) result = result.filter((t) => t.category?._id === categoryFilter);
    return result;
  }, [tasks, filter, categoryFilter]);

  const counts = useMemo(
    () => ({ all: tasks.length, pending: stats.pending ?? 0, completed: stats.completed ?? 0 }),
    [tasks.length, stats]
  );

  const handleCreate = async (data) => {
    const { data: res } = await api.post('/tasks', data);
    setTasks((prev) => [res.task, ...prev]);
    setStats((s) => ({ ...s, total: s.total + 1, pending: s.pending + 1 }));
    setShowCreate(false);
  };

  const handleUpdate = async (id, data) => {
    const { data: res } = await api.put(`/tasks/${id}`, data);
    setTasks((prev) => prev.map((t) => (t._id === id ? res.task : t)));
    setSelectedTask(res.task);
  };

  const handleToggle = async (task) => {
    const { data: res } = await api.patch(`/tasks/${task._id}/toggle`);
    setTasks((prev) => prev.map((t) => (t._id === task._id ? res.task : t)));
    setStats((s) => ({
      ...s,
      completed: s.completed + (res.task.completed ? 1 : -1),
      pending: s.pending + (res.task.completed ? -1 : 1),
    }));
    setSelectedTask((prev) => (prev && prev._id === task._id ? res.task : prev));
  };

  const handleDeleteConfirmed = async (task) => {
    await api.delete(`/tasks/${task._id}`);
    setTasks((prev) => prev.filter((t) => t._id !== task._id));
    setStats((s) => ({
      total: s.total - 1,
      completed: s.completed - (task.completed ? 1 : 0),
      pending: s.pending - (task.completed ? 0 : 1),
    }));
    setConfirmDelete(null);
    setSelectedTask(null);
  };

  return (
    <div className="min-h-screen bg-paper dark:bg-dark-bg transition-colors">
      <Navbar />

      <main className="container-app py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <ProgressDial total={stats.total} completed={stats.completed} />

          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink dark:bg-focus-500 dark:hover:bg-focus-600 text-white text-sm font-medium px-4 py-2.5 hover:bg-focus-700 transition w-full md:w-auto"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            New task
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <Filters active={filter} onChange={setFilter} counts={counts} />

          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-line dark:border-dark-line bg-surface dark:bg-dark-surface px-3 py-2 text-sm text-ink dark:text-white focus:border-focus-500 focus:ring-1 focus:ring-focus-500 outline-none transition w-full sm:w-auto"
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {error && (
          <div className="text-sm bg-ember/10 text-ember border border-ember/30 rounded-lg px-3 py-2 mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 rounded-xl2 bg-line/40 dark:bg-dark-line/40 animate-pulse" />
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-line dark:border-dark-line rounded-xl2 bg-surface/50 dark:bg-dark-surface/50">
            <p className="font-display text-lg font-semibold text-ink dark:text-white mb-1">
              {filter === 'completed'
                ? 'Nothing completed yet'
                : filter === 'pending'
                ? "You're all caught up"
                : 'No tasks yet'}
            </p>
            <p className="text-sm text-muted dark:text-dark-muted mb-5">
              {filter === 'all'
                ? 'Add your first task to start tracking your day.'
                : 'Switch filters or add a new task.'}
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="text-sm font-medium text-focus-600 dark:text-focus-300 hover:underline"
            >
              + Add a task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onOpen={setSelectedTask}
                onToggle={handleToggle}
                onDelete={setConfirmDelete}
              />
            ))}
          </div>
        )}
      </main>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          categories={categories}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleUpdate}
          onToggle={handleToggle}
          onDelete={setConfirmDelete}
        />
      )}

      {showCreate && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/40 backdrop-blur-sm p-0 sm:p-4"
          onClick={() => setShowCreate(false)}
        >
          <div
            className="w-full sm:max-w-lg bg-surface dark:bg-dark-surface rounded-t-2xl sm:rounded-xl2 shadow-modal max-h-[90vh] overflow-y-auto p-5 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-lg font-semibold text-ink dark:text-white mb-4">
              New task
            </h2>
            <TaskForm
              categories={categories}
              submitLabel="Create task"
              onCancel={() => setShowCreate(false)}
              onSubmit={handleCreate}
            />
          </div>
        </div>
      )}

      {confirmDelete && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="w-full max-w-sm bg-surface dark:bg-dark-surface rounded-xl2 shadow-modal p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-lg font-semibold text-ink dark:text-white mb-2">
              Delete this task?
            </h3>
            <p className="text-sm text-muted dark:text-dark-muted mb-5">
              "{confirmDelete.title}" will be permanently removed. This can't be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted dark:text-dark-muted hover:bg-paper dark:hover:bg-dark-line transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConfirmed(confirmDelete)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-ember text-white hover:bg-ember/90 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
