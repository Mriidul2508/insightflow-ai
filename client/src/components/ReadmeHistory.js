import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const TEMPLATE_LABELS = {
  fullstack: '🌐 Full-Stack',
  api: '⚡ REST API',
  frontend: '🎨 Frontend',
  cli: '💻 CLI',
  library: '📦 Library',
  mobile: '📱 Mobile'
};

const ReadmeHistory = ({ onLoad }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/api/projects`)
      .then((res) => setProjects(res.data.projects))
      .catch(() => setError('Failed to load history'))
      .finally(() => setLoading(false));
  }, []);

  const handleLoad = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/api/projects/${id}`);
      onLoad(res.data.project);
    } catch {
      setError('Failed to load project');
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this saved README?')) return;
    try {
      await axios.delete(`${API_URL}/api/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch {
      setError('Failed to delete project');
    }
  };

  if (loading) return <div className="history-state">Loading history...</div>;
  if (error) return <div className="history-state history-state--error">{error}</div>;
  if (!projects.length) {
    return (
      <div className="history-state">
        No saved READMEs yet — generate one while signed in to save it here.
      </div>
    );
  }

  return (
    <div className="history-list">
      {projects.map((p) => (
        <div key={p._id} className="history-item" onClick={() => handleLoad(p._id)}>
          <div className="history-item-body">
            <span className="history-item-name">{p.projectName}</span>
            <span className="history-item-meta">
              {TEMPLATE_LABELS[p.template] || p.template} &bull;{' '}
              {new Date(p.createdAt).toLocaleDateString()}
            </span>
          </div>
          <button
            className="history-delete-btn"
            onClick={(e) => handleDelete(p._id, e)}
            aria-label="Delete"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default ReadmeHistory;
