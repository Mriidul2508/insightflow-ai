const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || name.trim().length === 0) return res.status(400).json({ error: 'Name is required' });
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Valid email is required' });
  if (!password || password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) return res.status(400).json({ error: 'Email already registered' });

  const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), password });
  const token = signToken(user._id);
  logger.info('User registered', { userId: user._id });
  res.status(201).json({ token, user });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = signToken(user._id);
  logger.info('User logged in', { userId: user._id });
  res.json({ token, user });
};

const getMe = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { register, login, getMe };
