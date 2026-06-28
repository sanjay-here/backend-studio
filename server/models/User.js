const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * -----------
 * Used by the (optional) Authentication module. Passwords are
 * never stored in plain text - they are hashed with bcrypt
 * via a pre-save hook before being written to MongoDB.
 */
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [4, 'Password must be at least 4 characters'],
    },
  },
  { timestamps: true }
);

// Hash the password automatically whenever it is created/modified
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare a plain-text password to the hashed one
userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
