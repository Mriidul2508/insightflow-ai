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
  const [copied, setCopied] = useState(false); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateReadme = async () => {
    setLoading(true);
    setReadme(''); 
    setCopied(false);
    
    // Connects to Render URL in production, or localhost during development
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    
    try {
      const response = await axios.post(`${API_URL}/api/generate-readme`, formData);
      setReadme(response.data.markdown);
    } catch (error) {
      console.error(error);
      setReadme('❌ Error: Could not generate README. Make sure the backend is live.');
    }
    
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(readme);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); 
  };

  const handleDownload = () => {
    const blob = new Blob([readme], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formData.projectName.replace(/\s+/g, '_')}_README.md`; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const inputStyle = {
    width: '100%', padding: '12px', marginBottom: '15px', 
    backgroundColor: '#0f172a', color: 'white', border: '1px solid #334155', borderRadius: '5px',
    boxSizing: 'border-box'
  };

  return (
    <div className="dashboard-container">
      
      {/* Header with Custom Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
        <img 
          src="/favicon.png" 
          alt="InsightFlow Logo" 
          style={{ width: '45px', height: '45px', borderRadius: '8px', boxShadow: '0 0 10px rgba(129, 140, 248, 0.5)' }} 
        />
        <h1 className="title" style={{ margin: 0 }}>InsightFlow AI Dashboard</h1>
      </div>
      <p className="subtitle">Your MERN Stack Portfolio Engine</p>

      <div className="layout-grid">
        
        {/* Left Side: Input Form */}
        <div className="panel form-panel">
          <h2 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Project Details</h2>
          
          <label style={{ display: 'block', marginBottom: '5px', color: '#cbd5e1' }}>Project Name</label>
          <input name="projectName" value={formData.projectName} onChange={handleChange} style={inputStyle} />

          <label style={{ display: 'block', marginBottom: '5px', color: '#cbd5e1' }}>Tech Stack</label>
          <input name="techStack" value={formData.techStack} onChange={handleChange} style={inputStyle} />

          <label style={{ display: 'block', marginBottom: '5px', color: '#cbd5e1' }}>Key Features</label>
          <textarea name="features" rows="4" value={formData.features} onChange={handleChange} style={inputStyle} />

          <button 
            onClick={generateReadme}
            disabled={loading}
            style={{ 
              width: '100%', padding: '15px', backgroundColor: loading ? '#475569' : '#4f46e5', 
              color: 'white', border: 'none', borderRadius: '5px', cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold', fontSize: '1rem', transition: 'background-color 0.2s'
            }}
          >
            {loading ? '🧠 AI is Thinking...' : 'Generate AI README'}
          </button>
        </div>

        {/* Right Side: Output and 3D Canvas */}
        <div className="output-container">
          
          <div className="panel canvas-panel">
            <Canvas>
              <ambientLight intensity={0.5} />
              <directionalLight position={[2, 5, 2]} intensity={1} />
              <ProjectNode />
            </Canvas>
          </div>

          <div className="panel markdown-panel">
            <h2 style={{ marginBottom: '15px', fontSize: '1.2rem' }}>Generated Output</h2>
            <div className="markdown-output">
              {readme ? (
                <ReactMarkdown children={readme} />
              ) : (
                <span style={{ color: '#64748b' }}>Your generated Markdown will appear here...</span>
              )}
            </div>

            {/* The Action Buttons */}
            {readme && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button 
                  onClick={handleCopy}
                  style={{ 
                    flex: 1, padding: '10px', backgroundColor: copied ? '#059669' : '#334155', 
                    color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', 
                    fontWeight: 'bold', transition: 'background-color 0.2s'
                  }}
                >
                  {copied ? '✅ Copied!' : '📋 Copy Text'}
                </button>
                
                <button 
                  onClick={handleDownload}
                  style={{ 
                    flex: 1, padding: '10px', backgroundColor: '#2563eb', color: 'white', 
                    border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold',
                    transition: 'background-color 0.2s'
                  }}
                >
                  ⬇️ Download .md
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;