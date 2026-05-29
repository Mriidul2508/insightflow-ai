const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  projectName: { type: String, required: true, trim: true, maxlength: 100 },
  techStack: { type: String, required: true, trim: true, maxlength: 500 },
  features: { type: String, required: true, trim: true, maxlength: 2000 },
  template: {
    type: String,
    default: 'fullstack',
    enum: ['fullstack', 'api', 'frontend', 'cli', 'library', 'mobile']
  },
  readme: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
