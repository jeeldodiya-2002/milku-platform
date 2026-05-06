const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Customer name is mandatory'],
    trim: true
  },
  addresses: {
    type: [String],
    required: [true, 'At least one address is mandatory'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one address is required'
    }
  },
  areas: {
    type: [String],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);
