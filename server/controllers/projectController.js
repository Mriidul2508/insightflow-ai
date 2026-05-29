const Project = require('../models/Project');
const logger = require('../utils/logger');

const getHistory = async (req, res) => {
  const projects = await Project.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .select('-readme')
    .limit(50);
  res.json({ projects });
};

const getProject = async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, user: req.user._id });
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json({ project });
};

const deleteProject = async (req, res) => {
  const project = await Project.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!project) return res.status(404).json({ error: 'Project not found' });
  logger.info('Project deleted', { userId: req.user._id, projectId: req.params.id });
  res.json({ message: 'Deleted successfully' });
};

module.exports = { getHistory, getProject, deleteProject };
