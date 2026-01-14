const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  role: {
    type: String,
    required: [true, 'Please add a role'],
    enum: ['senior', 'doctor', 'caretaker', 'family'],
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    unique: true,
  },
  pin: {
    type: String,
    required: [true, 'Please add a PIN'],
    minlength: 4,
    select: false,
  },
  seniorId: {
    type: String,
  },
  dob: String,
  gender: String,
  bloodGroup: String,
  address: String,
  emergencyPrimary: {
    name: String,
    contact: String,
    relation: String,
  },
  specialization: String,
  regNo: String,
  clinic: String,
  city: String,
  relation: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt PIN using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('pin')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.pin = await bcrypt.hash(this.pin, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Match user entered PIN to hashed PIN in database
UserSchema.methods.matchPin = async function (enteredPin) {
  return await bcrypt.compare(enteredPin, this.pin);
};

module.exports = mongoose.model('User', UserSchema);
