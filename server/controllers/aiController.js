const { GoogleGenerativeAI } = require('@google/generative-ai');
const Project = require('../models/Project');
const logger = require('../utils/logger');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const PROMPTS = {
  fullstack: (name, stack, features) =>
    `Act as a Senior Software Engineer. Write a professional GitHub README.md for a full-stack application named "${name}". Tech Stack: ${stack}. Key Features: ${features}. Include sections: Project Overview, Live Demo, Tech Stack, Features, Getting Started (Prerequisites, Installation, Environment Variables), API Reference, and Contributing. Use proper Markdown formatting with badges.`,

  api: (name, stack, features) =>
    `Act as a Senior Backend Engineer. Write a professional GitHub README.md for a REST API service named "${name}". Tech Stack: ${stack}. Endpoints/Features: ${features}. Include sections: Overview, Authentication, Endpoints, Request/Response Examples, Getting Started, and Deployment. Use proper Markdown formatting with code blocks.`,

  frontend: (name, stack, features) =>
    `Act as a Senior Frontend Engineer. Write a professional GitHub README.md for a frontend application named "${name}". Tech Stack: ${stack}. Features: ${features}. Include sections: Overview, Demo, Features, Installation, Environment Variables, Build & Deployment, and Contributing. Use proper Markdown with badges.`,

  cli: (name, stack, features) =>
    `Act as a Senior Engineer. Write a professional GitHub README.md for a CLI tool named "${name}". Built with: ${stack}. Commands/Features: ${features}. Include sections: Overview, Installation, Usage, Commands Reference, Examples, and Contributing. Use proper Markdown with code blocks.`,

  library: (name, stack, features) =>
    `Act as a Senior Engineer. Write a professional GitHub README.md for a software library named "${name}". Built with: ${stack}. API/Features: ${features}. Include sections: Overview, Installation, Quick Start, API Reference, Examples, and Contributing. Use proper Markdown.`,

  mobile: (name, stack, features) =>
    `Act as a Senior Mobile Engineer. Write a professional GitHub README.md for a mobile application named "${name}". Tech Stack: ${stack}. Features: ${features}. Include sections: Overview, Screenshots, Features, Tech Stack, Getting Started (Prerequisites, Installation), and Contributing. Use proper Markdown.`
};

const generateReadme = async (req, res) => {
  const { projectName, techStack, features, template = 'fullstack' } = req.body;

  if (!projectName || !projectName.trim()) return res.status(400).json({ error: 'Project name is required' });
  if (!techStack || !techStack.trim()) return res.status(400).json({ error: 'Tech stack is required' });
  if (!features || !features.trim()) return res.status(400).json({ error: 'Features are required' });
  if (projectName.length > 100) return res.status(400).json({ error: 'Project name too long' });
  if (techStack.length > 500) return res.status(400).json({ error: 'Tech stack description too long' });
  if (features.length > 2000) return res.status(400).json({ error: 'Features description too long' });

  const promptFn = PROMPTS[template] || PROMPTS.fullstack;
  const prompt = promptFn(projectName.trim(), techStack.trim(), features.trim());

  try {
    const modelName = process.env.GEMINI_MODEL || 'gemini-3-flash-preview';
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    const markdown = result.response.text();

    if (req.user) {
      Project.create({ user: req.user._id, projectName: projectName.trim(), techStack: techStack.trim(), features: features.trim(), template, readme: markdown })
        .then(() => logger.info('README saved', { userId: req.user._id, projectName }))
        .catch((err) => logger.warn('Failed to save README to history', { error: err.message }));
    }

    res.json({ markdown });
  } catch (err) {
    logger.error('Gemini generation failed', { error: err.message });
    res.status(500).json({ error: 'Failed to generate README. Please try again.' });
  }
};

module.exports = { generateReadme };
