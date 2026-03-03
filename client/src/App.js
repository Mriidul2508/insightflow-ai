// client/src/App.js
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateReadme = async () => {
    setLoading(true);
    setReadme(''); 
    
    // DYNAMIC API URL: Uses your deployed URL in production, or localhost during development
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

  const inputStyle = {
    width: '100%', padding: '12px', marginBottom: '15px', 
    backgroundColor: '#0f172a', color: 'white', border: '1px solid #334155', borderRadius: '5px',
    boxSizing: 'border-box'
  };

  return (
    <div className="dashboard-container">
      <h1 className="title">InsightFlow AI Dashboard</h1>
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
                <ReactMarkdown>{readme}</ReactMarkdown>
              ) : (
                <span style={{ color: '#64748b' }}>Your generated Markdown will appear here...</span>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;