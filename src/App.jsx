import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Plus, FileText, Download, Trash2, Rocket, Pencil } from 'lucide-react';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks_queue_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({
    name: '',
    priority: 'Высокий',
    deadline: new Date(),
    assignee: '',
    description: ''
  });

  useEffect(() => {
    localStorage.setItem('tasks_queue_v2', JSON.stringify(tasks));
  }, [tasks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!form.name) return;

    const newTask = {
      ...form,
      id: Date.now().toString(),
      deadline: form.deadline.toISOString()
    };
    setTasks(prev => [...prev, newTask]); // Add to end or beginning? Original looks like a queue
    setForm({
      name: '',
      priority: 'Высокий',
      deadline: new Date(),
      assignee: '',
      description: ''
    });
  };

  const copyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(tasks, null, 2));
    alert('Копировано!');
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.json';
    a.click();
  };

  const clearTasks = () => {
    if (confirm('Очистить все?')) setTasks([]);
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="app-wrapper">
      <header className="main-header">
        <div className="logo-container">
          <Rocket className="header-rocket" />
          <h1>Менеджер очереди</h1>
        </div>
        <p>Управление JSON очередью задач</p>
      </header>

      <div className="content-container">
        <section className="form-section">
          <form onSubmit={addTask}>
            <div className="form-row">
              <div className="form-group third">
                <label>Название задачи *</label>
                <input 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  placeholder="Text" 
                  required 
                />
              </div>

              <div className="form-group third">
                <label>Приоритет</label>
                <select name="priority" value={form.priority} onChange={handleChange}>
                  <option>Высокий</option>
                  <option>Средний</option>
                  <option>Низкий</option>
                </select>
              </div>

              <div className="form-group third">
                <label>Крайний срок</label>
                <DatePicker
                  selected={form.deadline}
                  onChange={(date) => setForm({...form, deadline: date})}
                  showTimeSelect
                  dateFormat="dd.MM.yyyy HH:mm"
                  className="date-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group third">
                <label>Исполнитель</label>
                <input 
                  name="assignee" 
                  value={form.assignee} 
                  onChange={handleChange} 
                  placeholder="Кому назначено" 
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Описание</label>
              <textarea 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                placeholder="Подробное описание задачи"
                rows="3"
              />
            </div>

            <button type="submit" className="btn-add">
              <Plus size={20} /> Добавить в очередь
            </button>
          </form>
        </section>

        <section className="queue-section">
          <div className="queue-header">
            <h2>Очередь задач ({tasks.length})</h2>
            <div className="queue-actions">
              <button className="btn-green" onClick={copyJSON}>
                <FileText size={18} /> Копировать JSON
              </button>
              <button className="btn-green" onClick={downloadJSON}>
                <Download size={18} /> Скачать JSON
              </button>
              <button className="btn-red" onClick={clearTasks}>
                <Trash2 size={18} /> Очистить
              </button>
            </div>
          </div>

          <div className="tasks-container">
            {tasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon-box">
                   <Pencil className="empty-icon" size={32} />
                </div>
                <h3>Очередь пуста</h3>
                <p>Добавьте первую задачу используя форму выше</p>
              </div>
            ) : (
              <div className="tasks-list">
                {tasks.map(task => (
                  <div key={task.id} className="task-item">
                    <div className="task-main">
                      <div className="task-header-row">
                         <span className={`badge ${task.priority === 'Высокий' ? 'high' : task.priority === 'Средний' ? 'medium' : 'low'}`}>
                           {task.priority}
                         </span>
                         <h4>{task.name}</h4>
                      </div>
                      <div className="task-details">
                        <span>👤 {task.assignee || '—'}</span>
                        <span>📅 {new Date(task.deadline).toLocaleString()}</span>
                      </div>
                      {task.description && <p className="task-text">{task.description}</p>}
                    </div>
                    <button className="btn-delete" onClick={() => deleteTask(task.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
