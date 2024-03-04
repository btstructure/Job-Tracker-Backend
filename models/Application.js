const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  jobTitle: { type: String, required: true },
  jobLink: { type: String, required: true },
  status: { type: String, enum: ['Applied', 'Not applied'], default: 'Not applied' },
  response: { type: String, enum: ['Interview', 'Offer', 'Pending', 'Rejected'], default: null },
  notes: { type: String, default: '' },
});

module.exports = mongoose.model('Application', applicationSchema);
