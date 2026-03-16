import React, { useState, useEffect } from 'react';
import { Task, CreateTaskDTO, Priority, Category } from './types';
import { getTasks, createTask, toggleTask, removeTask } from './api';
import './App.css';

const EMPTY_FORM: CreateTaskDTO = {
  title: '',
  description: '',
  priority: 'medium',
  category: 'general',
  dueDate: '',
};

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState<CreateTaskDTO>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<CreateTaskDTO>>({});
  const [serverError, setServerError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [adding, setAdding] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [filterCat, setFilterCat] = useState<string>('all');

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch {
      setServerError('Could not connect to Backend. Make sure server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const validate = (): boolean => {
    const e: Partial<CreateTaskDTO> = {};
    if (!form.title.trim()) e.title = 'Title required';
    if (!form.dueDate) e.dueDate = 'Due date required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setAdding(true);
    setServerError('');
    try {
      const task = await createTask(form);
      setTasks(prev => [task, ...prev]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch {
      setServerError('Failed to add task.');
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      const updated = await toggleTask(id);
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
    } catch {
      setServerError('Failed to update task.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await removeTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch {
      setServerError('Failed to delete task.');
    }
  };

  const handleChange = (field: keyof CreateTaskDTO, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.length - completed;
  const progress = tasks.length > 0 ? (completed / tasks.length) * 100 : 0;

  const filtered = filterCat === 'all' ? tasks : tasks.filter(t => t.category === filterCat);

  const priorityColor: Record<Priority, string> = {
    low: '#4ade80',
    medium: '#facc15',
    high: '#ff4f6a',
  };

  const categoryIcon: Record<Category, string> = {
    general: '📌',
    work: '💼',
    personal: '👤',
    study: '📚',
  };

  return (
    <div className="app">
      <div className="container">

        {/* Header */}
        <div className="header">
          <div className="header-left">
            <span className="logo">✦</span>
            <div>
              <h1>TaskFlow</h1>
              <p className="subtitle">Manage your work, your way</p>
            </div>
          </div>
          <button className="new-btn" onClick={() => { setShowForm(!showForm); setErrors({}); setServerError(''); }}>
            {showForm ? '✕ Cancel' : '+ New Task'}
          </button>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat-card">
            <span className="stat-num total">{tasks.length}</span>
            <span className="stat-lbl">Total</span>
          </div>
          <div className="stat-card">
            <span className="stat-num done">{completed}</span>
            <span className="stat-lbl">Completed</span>
          </div>
          <div className="stat-card">
            <span className="stat-num pending">{pending}</span>
            <span className="stat-lbl">Pending</span>
          </div>
          <div className="stat-card progress-card">
            <div className="progress-label-row">
              <span className="stat-lbl">Progress</span>
              <span className="stat-lbl">{Math.round(progress)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* Server Error */}
        {serverError && <div className="server-error">❌ {serverError}</div>}

        {/* Add Task Form */}
        {showForm && (
          <div className="form-card">
            <h2 className="form-title">Create New Task</h2>

            <div className="field">
              <label>Task Title *</label>
              <input
                className={errors.title ? 'err' : ''}
                placeholder="e.g. Complete assignment"
                value={form.title}
                onChange={e => handleChange('title', e.target.value)}
              />
              {errors.title && <span className="err-msg">{errors.title}</span>}
            </div>

            <div className="field">
              <label>Description</label>
              <textarea
                placeholder="Add more details about this task..."
                value={form.description}
                onChange={e => handleChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="form-row two-col">
              <div className="field">
                <label>Priority</label>
                <select value={form.priority} onChange={e => handleChange('priority', e.target.value as Priority)}>
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
              <div className="field">
                <label>Category</label>
                <select value={form.category} onChange={e => handleChange('category', e.target.value as Category)}>
                  <option value="general">📌 General</option>
                  <option value="work">💼 Work</option>
                  <option value="personal">👤 Personal</option>
                  <option value="study">📚 Study</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label>Due Date *</label>
              <input
                type="date"
                className={errors.dueDate ? 'err' : ''}
                value={form.dueDate}
                onChange={e => handleChange('dueDate', e.target.value)}
              />
              {errors.dueDate && <span className="err-msg">{errors.dueDate}</span>}
            </div>

            <button className="submit-btn" onClick={handleSubmit} disabled={adding}>
              {adding ? 'Adding...' : '✦ Add Task'}
            </button>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {['all', 'general', 'work', 'personal', 'study'].map(cat => (
            <button
              key={cat}
              className={`tab ${filterCat === cat ? 'active' : ''}`}
              onClick={() => setFilterCat(cat)}
            >
              {cat === 'all' ? 'All' : `${categoryIcon[cat as Category]} ${cat}`}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="task-list">
          {loading ? (
            <div className="empty-state"><span>Loading tasks...</span></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📋</span>
              <p>No tasks here. Add one!</p>
            </div>
          ) : (
            filtered.map(task => (
              <div key={task.id} className={`task-card ${task.completed ? 'done' : ''}`}>
                <div className="task-left">
                  <div className="task-info">
                    <div className="task-top-row">
                      <span className="task-title">{task.title}</span>
                      <span className="priority-dot" style={{ background: priorityColor[task.priority] }} title={task.priority} />
                    </div>
                    {task.description && <p className="task-desc">{task.description}</p>}
                    <div className="task-meta">
                      <span className="badge cat">{categoryIcon[task.category]} {task.category}</span>
                      <span className="badge priority" style={{ color: priorityColor[task.priority] }}>
                        {task.priority}
                      </span>
                      {task.dueDate && <span className="badge due">📅 {task.dueDate}</span>}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="task-actions">
                  <button
                    className={`complete-btn ${task.completed ? 'completed' : ''}`}
                    onClick={() => handleToggle(task.id)}
                  >
                    {task.completed ? '↩ Undo' : '✓ Complete'}
                  </button>
                  <button
                    className="del-btn"
                    onClick={() => handleDelete(task.id)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {tasks.length > 0 && completed === tasks.length && (
          <div className="all-done">🎉 All tasks completed! Amazing work!</div>
        )}

      </div>
    </div>
  );
};

export default App;
