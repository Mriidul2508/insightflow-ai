import React from 'react';

const TEMPLATES = [
  { id: 'fullstack', label: 'Full-Stack', icon: '🌐' },
  { id: 'api', label: 'REST API', icon: '⚡' },
  { id: 'frontend', label: 'Frontend', icon: '🎨' },
  { id: 'cli', label: 'CLI Tool', icon: '💻' },
  { id: 'library', label: 'Library', icon: '📦' },
  { id: 'mobile', label: 'Mobile', icon: '📱' }
];

const TemplateSelector = ({ selected, onSelect }) => (
  <div className="template-grid">
    {TEMPLATES.map((t) => (
      <button
        key={t.id}
        onClick={() => onSelect(t.id)}
        className={`template-btn ${selected === t.id ? 'template-btn--active' : ''}`}
      >
        <span className="template-btn-icon">{t.icon}</span>
        <span className="template-btn-label">{t.label}</span>
      </button>
    ))}
  </div>
);

export default TemplateSelector;
