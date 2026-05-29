import React, { useState } from 'react';
import axios from 'axios';
import { Canvas } from '@react-three/fiber';
import ProjectNode from './components/ProjectNode';
import ReactMarkdown from 'react-markdown';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSkeleton from './components/LoadingSkeleton';
import TemplateSelector from './components/TemplateSelector';
import AuthModal from './components/AuthModal';
import ReadmeHistory from './components/ReadmeHistory';
import { useAuth } from './contexts/AuthContext';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const { user, logout, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    projectName: 'InsightFlow',
    techStack: 'MERN Stack, Gemini AI, Three.js',
    features: 'AI README generation, 3D interactive elements, Responsive mobile architecture'
  });
  const [template, setTemplate] = useState('fullstack');
  const [readme, setReadme] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const generateReadme = async () => {
    if (!formData.projectName.trim()) return;
    setLoading(true);
    setReadme('');
    setError(null);
    setCopied(false);
    try {
      const response = await axios.post(`${API_URL}/api/generate-readme`, { ...formData, template });
      if (response.data?.markdown) {
        setReadme(response.data.markdown);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.error ||
        'Failed to generate README. Check your connection and try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!readme) return;
    navigator.clipboard.writeText(readme);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!readme) return;
    const blob = new Blob([readme], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeName = formData.projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'project';
    link.download = `${safeName}_readme.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLoadFromHistory = (project) => {
    setFormData({
      projectName: project.projectName,
      techStack: project.techStack,
      features: project.features
    });
    setTemplate(project.template);
    setReadme(project.readme);
    setShowHistory(false);
    setActiveTab('preview');
  };

  if (authLoading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-spinner" />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="app-header">
        <div className="header-left">
          <img src="/favicon.png" alt="InsightFlow Logo" className="header-logo" />
          <div>
            <h1 className="title">InsightFlow AI</h1>
            <p className="subtitle">Intelligent Documentation Engine</p>
          </div>
        </div>
        <div className="header-right">
          {user ? (
            <div className="user-menu">
              <button
                className={`history-toggle-btn ${showHistory ? 'history-toggle-btn--active' : ''}`}
                onClick={() => setShowHistory(!showHistory)}
              >
                My READMEs
              </button>
              <span className="user-name">{user.name}</span>
              <button className="logout-btn" onClick={logout}>Logout</button>
            </div>
          ) : (
            <button className="login-btn" onClick={() => setShowAuth(true)}>
              Sign In / Sign Up
            </button>
          )}
        </div>
      </header>

      {user && showHistory && (
        <section className="panel history-panel">
          <h3 className="history-panel-title">Saved READMEs</h3>
          <ReadmeHistory onLoad={handleLoadFromHistory} />
        </section>
      )}

      <main className="layout-grid">
        <section className="panel form-panel">
          <h2 className="panel-title">Project Configuration</h2>

          <label className="field-label">Project Type</label>
          <TemplateSelector selected={template} onSelect={setTemplate} />

          <label className="field-label">Project Name</label>
          <input
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            className="field-input"
            placeholder="e.g., E-Commerce Platform"
          />

          <label className="field-label">Core Tech Stack</label>
          <input
            name="techStack"
            value={formData.techStack}
            onChange={handleChange}
            className="field-input"
            placeholder="e.g., React, Node.js, MongoDB"
          />

          <label className="field-label">Key Features & Modules</label>
          <textarea
            name="features"
            rows="5"
            value={formData.features}
            onChange={handleChange}
            className="field-input field-textarea"
            placeholder="List the main functionalities..."
          />

          <button
            onClick={generateReadme}
            disabled={loading}
            className={`btn-primary ${loading ? 'btn-primary--loading' : ''}`}
          >
            {loading ? 'Generating...' : 'Generate AI Documentation'}
          </button>

          {!user && (
            <p className="auth-hint">
              <button className="auth-hint-link" onClick={() => setShowAuth(true)}>Sign in</button>{' '}
              to save your generated READMEs
            </p>
          )}

          {error && <div className="error-box">{error}</div>}
        </section>

        <section className="output-container">
          <ErrorBoundary>
            <div className="panel canvas-panel">
              <Canvas>
                <ambientLight intensity={0.6} />
                <directionalLight position={[3, 5, 2]} intensity={1.2} />
                <ProjectNode />
              </Canvas>
            </div>
          </ErrorBoundary>

          <div className="panel markdown-panel">
            <div className="markdown-header">
              <h2 className="panel-title">Generated Output</h2>
              <div className="tab-row">
                <button
                  className={`tab-btn ${activeTab === 'preview' ? 'tab-btn--active' : ''}`}
                  onClick={() => setActiveTab('preview')}
                >
                  Preview
                </button>
                <button
                  className={`tab-btn ${activeTab === 'raw' ? 'tab-btn--active' : ''}`}
                  onClick={() => setActiveTab('raw')}
                >
                  Raw
                </button>
                {readme && <span className="success-badge">✓ Ready</span>}
              </div>
            </div>

            <div className="markdown-output">
              {loading ? (
                <LoadingSkeleton />
              ) : readme ? (
                activeTab === 'preview' ? (
                  <ReactMarkdown>{readme}</ReactMarkdown>
                ) : (
                  <pre className="raw-output">{readme}</pre>
                )
              ) : (
                <div className="empty-state">Awaiting project parameters...</div>
              )}
            </div>

            {readme && (
              <div className="action-buttons">
                <button
                  onClick={handleCopy}
                  className={`btn-secondary ${copied ? 'btn-secondary--success' : ''}`}
                >
                  {copied ? '✓ Copied' : 'Copy Markdown'}
                </button>
                <button onClick={handleDownload} className="btn-secondary btn-secondary--blue">
                  Download .md
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}

export default App;
