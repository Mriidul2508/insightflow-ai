import React, { useState } from 'react';
import axios from 'axios';
import { Canvas } from '@react-three/fiber';
import ProjectNode from './components/ProjectNode';
import ReactMarkdown from 'react-markdown';
import './App.css'; 

function App() {
  const [formData, setFormData] = useState({
    projectName: 'InsightFlow',
    techStack: 'MERN Stack, Gemini AI, Three.js',
    features: 'AI README generation, 3D interactive elements, Responsive mobile architecture'
  });
  
  const [readme, setReadme] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateReadme = async () => {
    if (!formData.projectName.trim()) return; // Prevent empty submissions

    setLoading(true);
    setReadme(''); 
    setError(null);
    setCopied(false);
    
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    
    try {
      const response = await axios.post(`${API_URL}/api/generate-readme`, formData);
      if (response.data && response.data.markdown) {
        setReadme(response.data.markdown);
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      console.error("Generation Error:", err);
      setError('❌ Failed to generate README. Please check your connection and try again.');
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
    
    // Sanitize filename to prevent file system errors
    const safeName = formData.projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'project';
    link.download = `${safeName}_readme.md`; 
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Centralized inline styles for cleaner JSX
  const styles = {
    input: {
      width: '100%', padding: '12px', marginBottom: '16px', 
      backgroundColor: '#1e293b', color: '#f8fafc', border: '1px solid #334155', 
      borderRadius: '6px', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s',
      fontFamily: 'inherit'
    },
    label: {
      display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '0.9rem', fontWeight: '500'
    },
    buttonPrimary: {
      width: '100%', padding: '14px', 
      backgroundColor: loading ? '#475569' : '#4f46e5', color: 'white', 
      border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer',
      fontWeight: '600', fontSize: '1rem', transition: 'all 0.2s ease',
      boxShadow: loading ? 'none' : '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
    },
    buttonSecondary: {
      flex: 1, padding: '12px', color: 'white', border: 'none', borderRadius: '6px', 
      cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s ease',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
    }
  };

  return (
    <div className="dashboard-container" style={{ minHeight: '100vh', padding: '20px', color: '#e2e8f0' }}>
      
      <header style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '8px' }}>
          <img 
            src="/favicon.png" 
            alt="InsightFlow Logo" 
            style={{ width: '40px', height: '40px', borderRadius: '8px', boxShadow: '0 0 12px rgba(99, 102, 241, 0.4)' }} 
          />
          <h1 className="title" style={{ margin: 0, fontSize: '1.8rem', color: '#f8fafc' }}>InsightFlow AI Dashboard</h1>
        </div>
        <p className="subtitle" style={{ color: '#94a3b8', margin: 0, fontSize: '1rem' }}>Intelligent MERN Stack Documentation Engine</p>
      </header>

      <main className="layout-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        
        {/* Input Form Section */}
        <section className="panel form-panel" style={{ backgroundColor: '#0f172a', padding: '24px', borderRadius: '12px', border: '1px solid #1e293b' }}>
          <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '1.25rem', color: '#f8fafc' }}>Project Configuration</h2>
          
          <label style={styles.label}>Project Name</label>
          <input name="projectName" value={formData.projectName} onChange={handleChange} style={styles.input} placeholder="e.g., E-Commerce Platform" />

          <label style={styles.label}>Core Tech Stack</label>
          <input name="techStack" value={formData.techStack} onChange={handleChange} style={styles.input} placeholder="e.g., React, Node, MongoDB" />

          <label style={styles.label}>Key Features & Modules</label>
          <textarea name="features" rows="5" value={formData.features} onChange={handleChange} style={{...styles.input, resize: 'vertical'}} placeholder="List the main functionalities..." />

          <button onClick={generateReadme} disabled={loading} style={styles.buttonPrimary}>
            {loading ? '⏳ Generating Architecture...' : '🚀 Generate AI Documentation'}
          </button>

          {error && (
            <div style={{ marginTop: '15px', padding: '12px', backgroundColor: '#7f1d1d', color: '#fca5a5', borderRadius: '6px', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}
        </section>

        {/* Output & Visuals Section */}
        <section className="output-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="panel canvas-panel" style={{ height: '250px', backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', overflow: 'hidden' }}>
            <Canvas>
              <ambientLight intensity={0.6} />
              <directionalLight position={[3, 5, 2]} intensity={1.2} />
              <ProjectNode />
            </Canvas>
          </div>

          <div className="panel markdown-panel" style={{ flex: 1, backgroundColor: '#0f172a', padding: '24px', borderRadius: '12px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.25rem', color: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Generated Output
              {readme && <span style={{ fontSize: '0.8rem', padding: '4px 8px', backgroundColor: '#064e3b', color: '#34d399', borderRadius: '12px' }}>Success</span>}
            </h2>
            
            <div className="markdown-output" style={{ flex: 1, padding: '16px', backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155', overflowY: 'auto', maxHeight: '400px', lineHeight: '1.6' }}>
              {readme ? (
                <ReactMarkdown children={readme} />
              ) : (
                <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontStyle: 'italic' }}>
                  Awaiting project parameters...
                </div>
              )}
            </div>

            {readme && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button 
                  onClick={handleCopy}
                  style={{ ...styles.buttonSecondary, backgroundColor: copied ? '#059669' : '#334155' }}
                >
                  {copied ? '✅ Copied to Clipboard' : '📋 Copy Markdown'}
                </button>
                
                <button 
                  onClick={handleDownload}
                  style={{ ...styles.buttonSecondary, backgroundColor: '#2563eb' }}
                >
                  ⬇️ Download .md File
                </button>
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}

export default App;